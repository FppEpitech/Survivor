import express, {Request, Response} from 'express';
import {PrismaClient} from '@prisma/client';
import { eachDayOfInterval, format } from 'date-fns';

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

router.get('/encounters-by-day/:period', async (req: Request, res: Response) => {
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

        const encountersByDay = await prisma.encounter.groupBy({
            by: ['date'],
            where: {
                date: {
                    gte: startDate.toISOString().slice(0, 10),
                },
            },
            _count: {
                date: true,
            },
            orderBy: {
                date: 'asc',
            },
        });

        const formattedResponse = encountersByDay.map(day => ({
            date: day.date,
            count: day._count.date,
        }));

        res.status(200).json(formattedResponse);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving encounters by day' });
    }
});

router.get('/events-by-day/:period', async (req: Request, res: Response) => {
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

        const datesInRange = eachDayOfInterval({ start: startDate, end: new Date() });

        const eventsByDay = await prisma.event.groupBy({
            by: ['date'],
            where: {
                date: {
                    gte: startDate.toISOString().slice(0, 10),
                },
            },
            _count: {
                date: true,
            },
            orderBy: {
                date: 'asc',
            },
        });

        const eventsMap = eventsByDay.reduce((acc, day) => {
            acc[day.date] = day._count.date;
            return acc;
        }, {} as { [key: string]: number });

        const formattedResponse = datesInRange.map(date => {
            const dateString = format(date, 'yyyy-MM-dd');
            return {
                date: dateString,
                count: eventsMap[dateString] || 0,
            };
        });

        res.status(200).json(formattedResponse);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving events by day' });
    }
});



export default router;
