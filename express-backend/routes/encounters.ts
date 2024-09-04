import express, {Request, Response} from 'express';
import {PrismaClient} from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.use(express.json());

router.get('/', async (req: Request, res: Response) => {
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

    if (encounter) {
      res.status(200).json(encounter);
    } else {
      res.status(404).json({error: 'Encounter not found'});
    }
  } catch (error) {
    res.status(500).json({error: 'Error retrieving encounter'});
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
    await prisma.encounter.delete({where: {id}});
    res.status(204).send();
  } catch (error) {
    res.status(500).json({error: 'Error deleting encounter'});
  }
});

export default router;
