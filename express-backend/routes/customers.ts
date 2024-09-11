import express, {Request, Response} from 'express';
import prisma from '../prismaClient'
import restrictCoach from '../middlewares/isManager';

const router = express.Router();

router.get('/', restrictCoach, async (req: Request, res: Response) => {
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
    const customer = await prisma.customer.findUnique({where: {id}});

    const employee = (req as any).middlewareUser;
    if (employee?.work === 'Coach') {
      if (customer?.coach_id !== employee.id) {
        return res.status(403).json({ message: "Access denied. Coaches cannot access this route." });
      }
    }

    if (customer) {
      res.status(200).json(customer);
    } else {
      res.status(404).json({error: 'Customer not found'});
    }
  } catch (error) {
    console.error('Error retrieving customer:', error);
    res.status(500).json({error: 'Error retrieving customer'});
  }
});

router.get('/:id/payments_history', restrictCoach, async (req: Request, res: Response) => {
  const customerId = parseInt(req.params.id);

  if (isNaN(customerId)) {
    return res.status(400).json({ error: 'Invalid customer ID' });
  }

  try {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const payments = await prisma.paymentHistory.findMany({
      where: {
        id: {
          in: customer.payment_ids,
        },
      },
    });

    res.status(200).json(payments);
  } catch (error) {
    console.error('Error retrieving payment histories:', error);
    res.status(500).json({ error: 'Error retrieving payment histories' });
  }
});

router.get('/:id/image', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    const customer = await prisma.customer.findUnique({where: {id}});

    const employee = (req as any).middlewareUser;
    if (employee?.work === 'Coach') {
      if (customer?.coach_id !== employee.id) {
        return res.status(403).json({ message: "Access denied. Coaches cannot access this route." });
      }
    }

    if (customer) {
      res.status(200).json(customer.image_url);
    } else {
      res.status(404).json({error: 'Customer not found'});
    }
  } catch (error) {
    console.error('Error retrieving customer:', error);
    res.status(500).json({error: 'Error retrieving customer'});
  }
});

interface Clothe {
  id: number;
  type: string;
}

router.get('/:id/clothes', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid customer ID' });
  }

  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    if (customer) {
        const employee = (req as any).middlewareUser;
        if (employee?.work === 'Coach') {
            if (customer?.coach_id !== employee.id) {
                return res.status(403).json({ message: "Access denied. Coaches cannot access this route." });
            }
        }

        let clothes: any[] = [];

        if (customer.clothes) {
          try {
            const clothesJsonArray = customer.clothes as unknown as { id: number, type: string }[];

            const results = await Promise.all(clothesJsonArray.map(async (clothe) => {
              const clothURL = await prisma.clothe.findUnique({ where: { id: clothe.id } });

              if (clothURL) {
                return {
                  type: clothe.type,
                  url: clothURL.type
                };
              } else {
                return {
                  type: clothe.type,
                  url: 'Not found'
                };
              }
            }));

            clothes = results;
          } catch (error) {
            console.error('Error converting clothes data:', error);
            return res.status(500).json({ error: 'Error processing clothes data' });
          }
        }
        console.log(clothes);
        res.status(200).json(clothes);
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (error) {
    console.error('Error retrieving customer:', error);
    res.status(500).json({ error: 'Error retrieving customer' });
  }
});


router.post('/', restrictCoach, async (req: Request, res: Response) => {
  const {
    email,
    name,
    surname,
    birth_date,
    gender,
    description,
    astrological_sign,
    image_url,
    coach_id,
    clothes
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
        old_id: -1,
        image_url,
        coach_id,
        clothes: JSON.stringify(clothes),
      },
    });

    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Error creating customer' });
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
    description,
    astrological_sign = "Unknown",
    coach_id,
    image_url
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
        coach_id,
        image_url
      },
    });
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({error: 'Error updating customer'});
  }
});

router.delete('/:id', restrictCoach, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.customer.delete({where: {id}});
    res.status(204).send();
  } catch (error) {
    res.status(500).json({error: 'Error deleting customer'});
  }
});

export default router;
