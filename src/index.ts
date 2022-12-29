import express, { Express } from 'express';
import usersRouter from './services/usersService';

const app: Express = express();

app.use(express.json());

app.listen(3000, () => {
    console.log('[server]: Server is running at https://localhost:3000');
});

app.use('/users', usersRouter);
