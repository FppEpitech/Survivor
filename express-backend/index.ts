import express, { Request, Response } from 'express';
import path from 'path';
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
require('dotenv').config();

const app = express();
const port = process.env.BACK_PORT || 0;

app.use('/', express.static(path.join(__dirname, '../../angular-frontend/dist/angular-frontend')));

let apiRouter = express.Router();

apiRouter.use(express.json());
apiRouter.use(loginRouter)
apiRouter.use(require('cors')());
apiRouter.use(require('helmet')());

apiRouter.use(authenticateToken); //now all routes are protected, user need to have a valid acc_token.

apiRouter.use('/assets', express.static(path.join(__dirname, '../assets')));
apiRouter.use('/tips', tipsRouter);
apiRouter.use('/customers', customersRouter);
apiRouter.use('/employees', employeesRouter);
apiRouter.use('/encounters', encountersRouter);
apiRouter.use('/events', eventsRouter);
apiRouter.use('/clothes', clothesRouter);
apiRouter.use('/paymenthistory', PaymentHistoryRouter);
apiRouter.use('/compatibility', compatibilityRouter);

app.use('/api', apiRouter);




app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
