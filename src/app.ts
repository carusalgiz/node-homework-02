import express, { Express } from 'express';
import userController from './controllers/usersController';
import * as pg from 'pg';
import { Sequelize } from 'sequelize-typescript';
import { promises } from 'fs';
import { UserModel } from './models/User.model';

const app: Express = express();
const sequelize = new Sequelize('postgres://postgres:289824@localhost:5432/homework_db', {
    dialectModule: pg,
    dialectOptions: {
        multipleStatements: true
    },
    models: [UserModel]
});

async function tableInit() {
    try {
        const sql = await promises.readFile('src/db_init.sql', 'utf8');
        await sequelize.query(sql);
    } catch (err) {
        console.log(err);
    }
}

app.use(express.json());

async function checkDBconnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await tableInit();
        console.log('Initial data setted.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

app.listen(3000, () => {
    checkDBconnection();
    console.log('[server]: Server is running at https://localhost:3000');
});

app.use('/users', userController);
