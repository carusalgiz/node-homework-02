import { Op } from 'sequelize';
import sequelize from '../config/connection';
import { IUser } from '../interfaces/IUser';
import { logTime } from '../middleware/logger.middleware';

export default class UserService {
    userModel: any;
    userGroupModel: any;

    constructor(userModel: any, userGroupModel: any) {
        this.userModel = userModel;
        this.userGroupModel = userGroupModel;
    }

    @logTime('Get User')
    async get(id: number): Promise<any> {
        return await this.userModel.findOne({ where: { id } });
    }

    @logTime('Get User By Login')
    async getUserByLogin(login: string): Promise<any> {
        return await this.userModel.findOne({ where: { login } });
    }

    @logTime('Create User')
    async create(user: IUser): Promise<any> {
        return await this.userModel.create({ login: user.login, password: user.password, age: user.age });
    }

    @logTime('Update User')
    async update(user: IUser): Promise<any> {
        const [, db_user] = await this.userModel.update({
            login: user.login,
            password: user.password,
            age: user.age
        }, {
            where: { id: Number.parseInt(user.id, 10) },
            returning: true,
            plain: true
        });
        return db_user;
    }

    @logTime('Delete User')
    async deleteUser(id: number): Promise<any> {
        const t = await sequelize.transaction();

        try {
            await this.userGroupModel.destroy({
                where: { user_id: id },
                returning: true,
                plain: true,
                transaction: t
            });

            const [, db_user] = await this.userModel.update({
                isDeleted: true
            }, {
                where: { id },
                returning: true,
                plain: true,
                transaction: t
            });

            await t.commit();
            return db_user;
        } catch (error) {
            await t.rollback();
            return error;
        }
    }

    @logTime('Get Users')
    async getUsers(): Promise<any> {
        return await this.userModel.findAll();
    }

    @logTime('Get Autosuggest Users')
    async getAutoSuggestUsers(limit: number, login: string): Promise<any> {
        return await this.userModel.findAll({
            limit,
            where: {
                login: {
                    [Op.like]: `%${login}%`
                }
            },
            order: [['login', 'DESC']]
        });
    }
}
