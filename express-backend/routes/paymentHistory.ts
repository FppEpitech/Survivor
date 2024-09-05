import express, {Request, Response} from 'express';
import prisma from '../prismaClient'

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const paymentHistorys = await prisma.paymentHistory.findMany();
        res.status(200).json(paymentHistorys);
    } catch (error) {
        res.status(500).json({error: 'Error retrieving paymentHistorys'});
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    try {
        const paymentHistory = await prisma.paymentHistory.findUnique({where: {id}});

        if (paymentHistory) {
        res.status(200).json(paymentHistory);
        } else {
        res.status(404).json({error: 'paymentHistory not found'});
        }
    } catch (error) {
        res.status(500).json({error: 'Error retrieving paymentHistory'});
    }
});

router.post('/', async (req: Request, res: Response) => {
    const {
        date,
        payment_method,
        amount,
        comment,
        customer_id
    } = req.body;

    try {
      const newpaymentHistory = await prisma.paymentHistory.create({
        data: {
            old_id : -1,
            date,
            payment_method,
            amount,
            comment,
            customer_id,
        },
      });
      res.status(201).json(newpaymentHistory);
    } catch (error) {
      res.status(500).json({error: 'Error creating paymentHistory'});
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const {
        date,
        payment_method,
        amount,
        comment,
        customer_id,
    } = req.body;

    try {
      const updatedpaymentHistory = await prisma.paymentHistory.update({
        where: { id },
        data: {
            date,
            payment_method,
            amount,
            comment,
            customer_id,
        },
      });

      res.status(200).json(updatedpaymentHistory);
    } catch (error) {
      res.status(500).json({error: 'Error updating paymentHistory'});
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    try {
      await prisma.paymentHistory.delete({where: {id}});
      res.status(204).send();
    } catch (error) {
      res.status(500).json({error: 'Error deleting paymentHistory'});
    }
});

router.get('/customer/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    try {
        const paymentHistory = await prisma.paymentHistory.findMany({where: {customer_id: id}});

        if (paymentHistory) {
        res.status(200).json(paymentHistory);
        } else {
        res.status(404).json({error: 'paymentHistory not found'});
        }
    } catch (error) {
        res.status(500).json({error: 'Error retrieving paymentHistory'});
    }
});

export default router;
