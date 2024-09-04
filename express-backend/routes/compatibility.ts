import express, {Request, Response} from 'express';
import {PrismaClient} from '@prisma/client';

const router = express.Router();
import prisma from '../prismaClient'

router.use(express.json());

router.get('/:id/:id', async (req: Request, res: Response) => {
  
});


export default router;
