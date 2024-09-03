import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import tipsRouter from './routes/tips';
import customersRouter from './routes/customers';
import employeesRouter from './routes/employees';
import eventsRouter from './routes/events';


const app = express();
const port = 3001;

dotenv.config();

const prisma = new PrismaClient();

app.use('/tips', tipsRouter);
app.use('/customers', customersRouter);
app.use('/employees', employeesRouter);
app.use('/events', eventsRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

async function main() {
    const allTips = await prisma.tip.findMany();

    console.log('All Tips:', allTips);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });