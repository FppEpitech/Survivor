import express, {Request, Response} from 'express';
import {PrismaClient} from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.use(express.json());

router.get('/', async (req: Request, res: Response) => {
  try {
    const tips = await prisma.tip.findMany();
    res.json(tips);
  } catch (error) {
    res.status(500).json({error: 'Error retrieving tips'});
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    const tip = await prisma.tip.findUnique({where: {id }});

    if (tip) {
      res.json(tip);
    } else {
      res.status(404).json({error: 'Tip not found'});
    }
  } catch (error) {
    res.status(500).json({error: 'Error retrieving tip'});
  }
});

router.post('/', async (req: Request, res: Response) => {
  const {title, tip} = req.body;
  try {
    const newTip = await prisma.tip.create({
      data: {title, tip, old_id:-1}
    });
    res.status(201).json(newTip);
  } catch (error) {
    res.status(500).json({error: 'Error creating tip'});
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const {title, tip} = req.body;
  try {
    const updatedTip = await prisma.tip.update({
      where: {id},
      data: {title, tip}
    });
    res.json(updatedTip);
  } catch (error) {
    res.status(500).json({error: 'Error updating tip'});
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.tip.delete({where: {id}});
    res.status(204).send();
  } catch (error) {
    res.status(500).json({error: 'Error deleting tip'});
  }
});

export default router;
