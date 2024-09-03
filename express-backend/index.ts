import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import tipsRouter from './routes/tips';


const app = express();
const port = 3001;

dotenv.config();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

app.use('/tips', tipsRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

