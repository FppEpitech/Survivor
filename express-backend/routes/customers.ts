import express, {Request, Response} from 'express';
import {PrismaClient} from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.use(express.json());

router.get('/', async (req: Request, res: Response) => {
  try {
    const customers = await prisma.customer.findMany();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({error: 'Error retrieving customers'});
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    const customer = await prisma.customer.findUnique({where: {id }});

    if (customer) {
      res.status(200).json(customer);
    } else {
      res.status(404).json({error: 'Customer not found'});
    }
  } catch (error) {
    res.status(500).json({error: 'Error retrieving customer'});
  }
});

router.post('/', async (req: Request, res: Response) => {
  const {
    email,
    name,
    surname,
    birth_date,
    gender = "Not specified",
    description,
    astrological_sign = "Unknown",
  } = req.body;

  try {
    const newCustomer = await prisma.customer.create({
        data: {
        email,
        name,
        surname,
        birth_date,
        gender,
        description,
        astrological_sign,
        old_id:-1
      },
    });
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({error: 'Error creating customer'});
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const {
    email,
    name,
    surname,
    birth_date,
    gender = "Not specified",
    description,
    astrological_sign = "Unknown",
  } = req.body;

  try {
    const updatedCustomer = await prisma.customer.update({
      where: {id},
      data: {
        email,
        name,
        surname,
        birth_date,
        gender,
        description,
        astrological_sign,
      },
    });
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({error: 'Error updating customer'});
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.customer.delete({where: {id}});
    res.status(200).json({message: 'Customer deleted successfully'});
  } catch (error) {
    res.status(500).json({error: 'Error deleting customer'});
  }
});

export default router;
