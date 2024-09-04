import express, {Request, Response} from 'express';
import {PrismaClient} from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.use(express.json());

router.get('/', async (req: Request, res: Response) => {
    try {
        const events = await prisma.event.findMany();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({error: 'Error retrieving events'});
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    try {
        const event = await prisma.event.findUnique({where: {id}});

        if (event) {
        res.status(200).json(event);
        } else {
        res.status(404).json({error: 'Event not found'});
        }
    } catch (error) {
        res.status(500).json({error: 'Error retrieving event'});
    }
});

router.post('/', async (req: Request, res: Response) => {
    const {
      name,
      date,
      max_participants,
      location_x,
      location_y,
      type,
      employee_id,
      location_name
    } = req.body;

    try {
      const newEvent = await prisma.event.create({
        data: {
          name,
          date,
          max_participants,
          location_x,
          location_y,
          type,
          employee_id,
          location_name,
          old_id: -1
        },
      });
      res.status(201).json(newEvent);
    } catch (error) {
      res.status(500).json({error: 'Error creating event'});
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const {
      name,
      date,
      max_participants,
      location_x,
      location_y,
      type,
      employee_id,
      location_name
    } = req.body;

    try {
      const updatedEvent = await prisma.event.update({
        where: { id },
        data: {
          name,
          date,
          max_participants,
          location_x,
          location_y,
          type,
          employee_id,
          location_name,
        },
      });

      res.status(200).json(updatedEvent);
    } catch (error) {
      res.status(500).json({error: 'Error updating event'});
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    try {
      await prisma.event.delete({where: {id}});
      res.status(204).send();
    } catch (error) {
      res.status(500).json({error: 'Error deleting event'});
    }
});

export default router;
