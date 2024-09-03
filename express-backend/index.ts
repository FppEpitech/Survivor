import express, { Request, Response } from 'express';
import dotenv from 'dotenv';


const app = express();
const port = 3000;

dotenv.config();


app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
