import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path'
dotenv.config();

import tipsRouter from './routes/tips';
import loginRouter from './routes/login';
import customersRouter from './routes/customers';
import employeesRouter from './routes/employees';

const app = express();
const port = 3001;

app.use(express.json());
app.use(loginRouter)

app.use('/assets', express.static(path.join(__dirname, 'assets')));
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
