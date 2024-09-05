import express, { Request, Response } from 'express';
import path from 'path';
import {PrismaClient} from '@prisma/client';

import tipsRouter from './routes/tips';
import loginRouter from './routes/login';
import customersRouter from './routes/customers';
import employeesRouter from './routes/employees';
import encountersRouter from './routes/encounters';
import eventsRouter from './routes/events';
import clothesRouter from './routes/clothes';
import PaymentHistoryRouter from './routes/paymentHistory'
import authenticateToken from './middlewares/isLoggedIn';
import compatibilityRouter from './routes/compatibility';

const app = express();
const port = 3001;

app.use(express.json());
app.use(loginRouter)

app.use(authenticateToken); //now all routes are protected, user need to have a valid acc_token.

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/tips', tipsRouter);
app.use('/customers', customersRouter);
app.use('/employees', employeesRouter);
app.use('/encounters', encountersRouter);
app.use('/events', eventsRouter);
app.use('/clothes', clothesRouter);
app.use('/paymenthistory', PaymentHistoryRouter);
app.use('/compatibility', compatibilityRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
