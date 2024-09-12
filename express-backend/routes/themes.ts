import express, {Request, Response} from 'express';
import prisma from '../prismaClient'
import restrictCoach from '../middlewares/isManager';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    const id = (req as any).middlewareId

    try {
        const themeDashboard = await prisma.themeDashboard.findUnique({ where: { coach_id: id } });

        if (!themeDashboard) {
            return res.status(404).json({ error: `ThemeDashboard for coach ID ${id} not found` });
        }

        const employee = await prisma.employee.findUnique({ where: { id } });

        if (!employee || employee.work !== 'Coach') {
            return res.status(403).json({ message: "ID provided does not correspond to a coach" });
        }

        res.status(200).json({ theme: themeDashboard.theme });
    } catch (error) {
        console.error('Error retrieving theme:', error);
        res.status(500).json({ error: 'Error retrieving theme' });
    }
});

router.post('/', async (req: Request, res: Response) => {
    const { theme } = req.body;
    const coach_id = (req as any).middlewareId;

    if (!theme || !coach_id) {
        return res.status(400).json({ error: 'Theme and coach_id are required' });
    }

    try {
        const existingThemeDashboard = await prisma.themeDashboard.findUnique({
            where: { coach_id },
        });

        if (existingThemeDashboard) {
            const updatedThemeDashboard = await prisma.themeDashboard.update({
                where: { coach_id },
                data: { theme },
            });
            return res.status(200).json(updatedThemeDashboard);
        } else {
            const newThemeDashboard = await prisma.themeDashboard.create({
                data: {
                    theme,
                    coach_id,
                },
            });
            return res.status(201).json(newThemeDashboard);
        }
    } catch (error) {
        console.error('Error creating/updating ThemeDashboard:', error);
        res.status(500).json({ error: 'Error creating/updating ThemeDashboard' });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { theme, coach_id } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    if (!theme) {
        return res.status(400).json({ error: 'Theme and coach_id are required' });
    }

    try {
        const updatedThemeDashboard = await prisma.themeDashboard.update({
            where: { coach_id: id },
            data: {
                theme,
                coach_id,
            },
        });
        res.status(200).json(updatedThemeDashboard);
    } catch (error) {
        console.error('Error updating ThemeDashboard:', error);
        res.status(500).json({ error: 'Error updating ThemeDashboard' });
    }
});


router.delete('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    try {
        await prisma.themeDashboard.delete({ where: { coach_id: id } });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting ThemeDashboard:', error);
        res.status(500).json({ error: 'Error deleting ThemeDashboard' });
    }
});

export default router;
