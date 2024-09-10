import express, {Request, Response} from 'express';
import {PrismaClient} from '@prisma/client';
import prisma from '../prismaClient'
import restrictCoach from '../middlewares/isManager';

const router = express.Router();

router.get('/', restrictCoach, async (req: Request, res: Response) => {
  try {
    const encounters = await prisma.encounter.findMany();
    res.status(200).json(encounters);
  } catch (error) {
    res.status(500).json({error: 'Error retrieving encounters'});
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    const encounter = await prisma.encounter.findUnique({where: {id}});

    if (!encounter) {
      return res.status(404).json({ error: 'Encounter not found' });
    }

    const customer = await prisma.customer.findFirst({ where: { id: encounter.customer_id } });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const employee = (req as any).middlewareUser;
    if (employee?.work === 'Coach') {
      if (customer?.coach_id !== employee.id) {
        return res.status(403).json({ message: "Access denied. Coaches cannot access this route." });
      }
    }

    if (encounter) {
      res.status(200).json(encounter);
    } else {
      res.status(404).json({error: 'Encounter not found'});
    }
  } catch (error) {
    res.status(500).json({error: 'Error retrieving encounter'});
  }
});

router.get('/customer/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid customer ID' });
  }

  const customer = await prisma.customer.findFirst({ where: { id: id } });
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  const employee = (req as any).middlewareUser;
  if (employee?.work === 'Coach') {
    if (customer?.coach_id !== employee.id) {
      return res.status(403).json({ message: "Access denied. Coaches cannot access this route." });
    }
  }

  try {
    const encounters = await prisma.encounter.findMany({
      where: {
        customer_id: id,
      },
      select: {
        id: true,
        customer_id: true,
        date: true,
        rating: true,
        comment: true,
        source: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    if (encounters.length === 0) {
      return res.status(404).json({ error: 'No encounters found for this customer' });
    }

    res.status(200).json(encounters);
  } catch (error) {
    console.error('Error retrieving encounters:', error);
    res.status(500).json({ error: 'Error retrieving encounters' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const {
    customer_id,
    date,
    rating,
    comment,
    source} = req.body;

  try {
    const newEncounter = await prisma.encounter.create({
      data: {
        customer_id,
        date,
        rating,
        comment,
        source,
        old_id: -1,
      },
    });
    res.status(201).json(newEncounter);
  } catch (error) {
    res.status(500).json({error: 'Error creating encounter'});
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const {
    customer_id,
    date,
    rating,
    comment,
    source} = req.body;

  try {
    const encounter = await prisma.encounter.findUnique({where: {id}});
    if (!encounter) {
      return res.status(404).json({ error: 'Encounter not found' });
    }

    const customer = await prisma.customer.findFirst({ where: { id: encounter.customer_id } });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const employee = (req as any).middlewareUser;
    if (employee?.work === 'Coach') {
      if (customer?.coach_id !== employee.id) {
        return res.status(403).json({ message: "Access denied. Coaches cannot access this route." });
      }
    }

    const updatedEncounter = await prisma.encounter.update({where: {id},
      data: {
        customer_id,
        date,
        rating,
        comment,
        source,
      },
    });
    res.status(200).json(updatedEncounter);
  } catch (error) {
    res.status(500).json({error: 'Error updating encounter'});
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    const encounter = await prisma.encounter.findUnique({where: {id}});
    if (!encounter) {
      return res.status(404).json({ error: 'Encounter not found' });
    }

    const customer = await prisma.customer.findFirst({ where: { id: encounter.customer_id } });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const employee = (req as any).middlewareUser;
    if (employee?.work === 'Coach') {
      if (customer?.coach_id !== employee.id) {
        return res.status(403).json({ message: "Access denied. Coaches cannot access this route." });
      }
    }

    await prisma.encounter.delete({where: {id}});
    res.status(204).send();
  } catch (error) {
    res.status(500).json({error: 'Error deleting encounter'});
  }
});

export default router;
