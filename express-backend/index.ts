import express, { Request, Response } from 'express';
import cron, { ScheduledTask } from 'node-cron';
import { exec } from 'child_process';
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
import assetsRouter from './routes/assets';
import themesRouter from './routes/themes';
import dashboardRouter from './routes/dashboard';
require('dotenv').config();

const app = express();
const port = process.env.BACK_PORT || 3001;

let fetchAndStoreCronJob: ScheduledTask | null = null;

if (process.env.FROM_DOCKER == "true") {
    app.use('/', express.static(path.join(__dirname, '../../angular-frontend/dist/angular-frontend')));
} else {
    //we could serve angular dist folder from here.
    app.get('/', (req: Request, res: Response) => {
        res.send('Hello world');
    });
}

let apiRouter = express.Router();

apiRouter.use(express.json());
apiRouter.use(require('cors')());
apiRouter.use(require('helmet')());
apiRouter.use(loginRouter);

apiRouter.use(authenticateToken);

apiRouter.use('/assets', assetsRouter);
apiRouter.use('/tips', tipsRouter);
apiRouter.use('/customers', customersRouter);
apiRouter.use('/employees', employeesRouter);
apiRouter.use('/encounters', encountersRouter);
apiRouter.use('/events', eventsRouter);
apiRouter.use('/clothes', clothesRouter);
apiRouter.use('/paymenthistory', PaymentHistoryRouter);
apiRouter.use('/compatibility', compatibilityRouter);
apiRouter.use('/themes', themesRouter);
apiRouter.use('/dashboard', dashboardRouter);

app.use('/api', apiRouter);

fetchAndStoreCronJob = cron.schedule('0 */2 * * *', () => {
    console.log('Running fetchAndStoreData script...');
    exec('ts-node ./prisma/fetchData/fetchAndStoreData.ts', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Error output: ${stderr}`);
            return;
        }
        console.log(`Script output: ${stdout}`);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

process.on('SIGINT', () => {
    console.log('Received SIGINT. Shutting down...');
    if (fetchAndStoreCronJob) {
        fetchAndStoreCronJob.stop();
        console.log('Cron job stopped.');
    }
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Shutting down...');
    if (fetchAndStoreCronJob) {
        fetchAndStoreCronJob.stop();
        console.log('Cron job stopped.');
    }
    process.exit(0);
});
