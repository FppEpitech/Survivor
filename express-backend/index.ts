import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import tipsRouter from './routes/tips';
import loginRouter from './routes/login';
import isLoggedIn from './middlewares/isLoggedIn'
import customersRouter from './routes/customers';
import employeesRouter from './routes/employees';

const app = express();
const port = 3001;

app.use(express.json());
app.use(loginRouter)

app.use('/tips', tipsRouter);
app.use('/customers', customersRouter);
app.use('/employees', employeesRouter);
app.use('/tips', tipsRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
