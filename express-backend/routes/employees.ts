import express, {Request, Response} from 'express';
import { cp } from 'fs';
import bcrypt from 'bcryptjs'
import prisma from '../prismaClient'
import restrictCoach from '../middlewares/isManager';

const router = express.Router();

router.get('/me', async (req: Request, res: Response) => {
    try {
      let me = await prisma.employee.findUnique({where: {id: (req as any).middlewareId}});
      if (!me) throw new Error("Failed getting employee's informations");
      res.status(200).json(me);
    } catch (error) {
      res.status(500).json({error: 'Error deleting employee'});
    }
})

router.get('/', restrictCoach, async (req: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany();

    const employeesWithCustomerCount = await Promise.all(
      employees.map(async (employee) => {
        if (employee.work === 'Coach') {
          const customerCount = await prisma.customer.count({
            where: { coach_id: employee.id },
          });
          return {
            ...employee,
            customerCount,
          };
        }
        return employee;
      })
    );

    res.status(200).json(employeesWithCustomerCount);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving employees' });
  }
});


router.get('/:id', restrictCoach, async (req: Request, res: Response) => {
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

router.post('/', restrictCoach, async (req: Request, res: Response) => {
  const {
    email,
    name,
    surname,
    birth_date,
    gender,
    work,
    password,
    image_url,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
        throw new Error("Failed hashing your password");
    }
    const newEmployee = await prisma.employee.create({
        data: {
        email,
        name,
        surname,
        birth_date,
        gender,
        work,
        hashed_password : hashedPassword,
        old_id:-1,
        image_url: image_url,
      },
    });
    res.status(201).json(newEmployee);
  } catch (error) {
    console.log(error);
    res.status(500).json({error: 'Error creating employee'});
  }
});

router.put('/:id', restrictCoach, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const {
        email,
        name,
        surname,
        birth_date,
        gender,
        work,
        } = req.body;

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
        }
      });
      res.status(200).json(updatedEmployee);
    } catch (error) {
      res.status(500).json({error: 'Error updating employee'});
    }
});

router.delete('/:id', restrictCoach, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.employee.delete({where: {id}});
    res.status(204).send();
  } catch (error) {
    res.status(500).json({error: 'Error deleting employee'});
  }
});

router.get('/customers/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    try {
      const employee = (req as any).middlewareUser;
      if (employee?.work === 'Coach') {
        if (id !== employee.id) {
          return res.status(403).json({ message: "Access denied. Coaches cannot access this route." });
        }
      }

      let customers = await prisma.customer.findMany({where: {coach_id: id}});
      res.status(200).json(customers);
    } catch (error) {
      res.status(500).json({error: 'Error deleting employee'});
    }
})


export default router;
