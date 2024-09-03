import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import tipsRouter from './routes/tips';
import loginRouter from './routes/login';

const app = express();
const port = 3001;

app.use(express.json());
app.use(loginRouter)

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

app.use('/tips', tipsRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
