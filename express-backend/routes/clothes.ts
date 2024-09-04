import express, {Request, Response} from 'express';
import {PrismaClient} from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.use(express.json());

router.get('/', async (req: Request, res: Response) => {
    try {
      const clothes = await prisma.clothe.findMany();
      res.status(200).json(clothes);
    } catch (error) {
      res.status(500).json({error: 'Error retrieving clothes'});
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    try {
      const clothe = await prisma.clothe.findUnique({where: {id}});

      if (clothe) {
        res.status(200).json(clothe);
      } else {
        res.status(404).json({error: 'Clothe not found'});
      }
    } catch (error) {
      res.status(500).json({error: 'Error retrieving clothe'});
    }
});

router.post('/', async (req: Request, res: Response) => {
    const {type} = req.body;

    try {
      const newClothe = await prisma.clothe.create({
        data: {type, old_id: -1}
      });
      res.status(201).json(newClothe);
    } catch (error) {
      res.status(500).json({error: 'Error creating clothe'});
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const {type} = req.body;

    try {
      const updatedClothe = await prisma.clothe.update({where: {id},
        data: {type}
      });
      res.status(200).json(updatedClothe);
    } catch (error) {
      res.status(500).json({error: 'Error updating clothe'});
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      await prisma.clothe.delete({where: {id}});
      res.status(204).send();
    } catch (error) {
      res.status(500).json({error: 'Error deleting clothe'});
    }
});

export default router;
