import * as pg from 'pg';
import { Sequelize } from 'sequelize-typescript';
import { UserModel } from '../models/User.model';
import { GroupModel } from '../models/Group.model';
import { UserGroupModel } from '../models/UserGroup.model';

const sequelize = new Sequelize('postgres://postgres:289824@localhost:5432/homework_db', {
    dialectModule: pg,
    dialectOptions: {
        multipleStatements: true
    },
    models: [
        UserModel,
        GroupModel,
        UserGroupModel
    ]
});

export default sequelize;
