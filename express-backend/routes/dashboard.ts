import express, {Request, Response} from 'express';
import {PrismaClient} from '@prisma/client';

const router = express.Router();
import prisma from '../prismaClient'


router.get('/customer-stats/:period', async (req: Request, res: Response) => {
    try {
        const { period } = req.params;

        let startDate: string;
        const now = new Date();
        if (period === '7') {
            startDate = new Date(now.setDate(now.getDate() - 7)).toISOString().slice(0, 10);
        } else if (period === '3') {
            startDate = new Date(now.setMonth(now.getMonth() - 3)).toISOString().slice(0, 10);
        } else {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
        }

        const totalCustomers = await prisma.customer.count();

        const customersWithEncounters = await prisma.encounter.count({
            where: {
                date: {
                    gte: startDate
                }
            }
        });

        const percentageWithEncounter = (customersWithEncounters / totalCustomers) * 100;

        const totalCoaches = await prisma.customer.groupBy({
            by: ['coach_id'],
            _count: true,
        });
        const averageCustomersPerCoach = totalCustomers / totalCoaches.length;

        res.status(200).json({
            totalCustomers,
            percentageWithEncounter,
            averageCustomersPerCoach
        });
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving customer statistics' });
    }
});

router.get('/event-stats', async (req: Request, res: Response) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
        const startOfWeek = new Date(now.setDate(now.getDate() - 7)).toISOString().slice(0, 10);

        const totalEventsLastMonth = await prisma.event.count({
            where: {
                date: {
                    gte: startOfMonth
                }
            }
        });

        const totalEventsLastWeek = await prisma.event.count({
            where: {
                date: {
                    gte: startOfWeek
                }
            }
        });

        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const averageEventsPerDay = totalEventsLastMonth / daysInMonth;

        res.status(200).json({
            totalEventsLastMonth,
            totalEventsLastWeek,
            averageEventsPerDay
        });
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving event statistics' });
    }
});

router.get('/encounter-sources/:period', async (req: Request, res: Response) => {
    try {
        const period = parseInt(req.params.period);

        let startDate: Date;

        switch (period) {
            case 7:
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);
                break;
            case 1:
                startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
                break;
            case 3:
                startDate = new Date();
                startDate.setMonth(startDate.getMonth() - 3);
                break;
            default:
                return res.status(400).json({ error: 'Invalid period. Use 7, 1, or 3.' });
        }

        const encounterSources = await prisma.encounter.groupBy({
            by: ['source'],
            where: {
                date: {
                    gte: startDate.toISOString().slice(0, 10),
                },
            },
            _count: {
                source: true,
            },
        });

        const formattedResponse = encounterSources.map(source => ({
            source: source.source,
            count: source._count.source,
        }));

        res.status(200).json(formattedResponse);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving encounter sources statistics' });
    }
});

export default router;
