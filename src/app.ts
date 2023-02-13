import express, { Express } from 'express';
import userController from './controllers/userController';
import groupController from './controllers/groupController';
import { promises } from 'fs';
import sequelize from './config/connection';
import LoggerMiddleware from './middleware/logger.middleware';

const app: Express = express();
const logger = new LoggerMiddleware();

async function tableInit() {
    try {
        const sql = await promises.readFile('src/db_init.sql', 'utf8');
        await sequelize.query(sql);
    } catch (err) {
        console.log(err);
    }
}

app.use(express.json());

async function setupDB() {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await tableInit();
    console.log('Initial data setted.');
}

setupDB().then(() => {
    app.listen(3000, () => {
        console.log('[server]: Server is running at https://localhost:3000');
        // Promise.reject(new Error('Test unhandledRejection'));
        // throw new Error('Test uncaughtException');
    });
}).catch((error) => {
    console.error('Unable to connect to the database:', error);
});

app.use('/users', userController);
app.use('/groups', groupController);
app.use('*', logger.unhandledError);

process.on('uncaughtException', logger.catchException);
process.on('unhandledRejection', logger.catchException);
