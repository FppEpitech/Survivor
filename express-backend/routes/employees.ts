import express, {Request, Response} from 'express';
import {PrismaClient} from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.use(express.json());

router.get('/', async (req: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({error: 'Error retrieving employees'});
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    const employee = await prisma.employee.findUnique({where: {id}});

    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).json({error: 'employee not found'});
    }
  } catch (error) {
    res.status(500).json({error: 'Error retrieving employee'});
  }
});

router.post('/', async (req: Request, res: Response) => {
  const {
    email,
    name,
    surname,
    birth_date,
    gender = "Not specified",
    work,
    hashed_password,
    image_url,
  } = req.body;

  try {
    const newEmployee = await prisma.employee.create({
        data: {
        email,
        name,
        surname,
        birth_date,
        gender,
        work,
        hashed_password,
        old_id:-1,
        image_url: image_url,
      },
    });
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({error: 'Error creating employee'});
  }
});

router.put('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const {
        email,
        name,
        surname,
        birth_date,
        gender,
        work,
        hashed_password} = req.body;

    try {
      const updatedEmployee = await prisma.employee.update({
        where: {id},
        data: {
          email,
          name,
          surname,
          birth_date,
          gender,
          work,
          hashed_password
        }
      });
      res.status(200).json(updatedEmployee);
    } catch (error) {
      res.status(500).json({error: 'Error updating employee'});
    }
  });

router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.employee.delete({where: {id}});
    res.status(204).send();
  } catch (error) {
    res.status(500).json({error: 'Error deleting employee'});
  }
});

export default router;
