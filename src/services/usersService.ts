import { Op } from 'sequelize';
import { IUser } from '../interfaces/IUser';

export default class UsersService {
    userModel: any;

    constructor(userModel: any) {
        this.userModel = userModel;
    }

    async get(id: number): Promise<any> {
        return await this.userModel.findOne({ where: { id } });
    }

    async create(user: IUser): Promise<any> {
        return await this.userModel.create({ login: user.login, password: user.password, age: user.age });
    }

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

    async deleteUser(id: number): Promise<any> {
        const [, db_user] = await this.userModel.update({
            isDeleted: true
        }, {
            where: { id },
            returning: true,
            plain: true
        });
        return db_user;
    }

    async getUsers(): Promise<any> {
        return await this.userModel.findAll();
    }

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
