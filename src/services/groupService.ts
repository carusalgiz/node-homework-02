import sequelize from '../config/connection';
import { IGroup } from '../interfaces/IGroup';
import { logTime } from '../middleware/logger.middleware';

export default class GroupService {
    groupModel: any;
    userGroupModel: any;

    constructor(groupModel: any, userGroupModel: any) {
        this.groupModel = groupModel;
        this.userGroupModel = userGroupModel;
    }

    @logTime('Get group')
    async get(id: number): Promise<any> {
        return await this.groupModel.findOne({ where: { id } });
    }

    @logTime('Create Group')
    async create(group: IGroup): Promise<any> {
        return await this.groupModel.create({ name: group.name, permissions: group.permissions });
    }

    @logTime('Update Group')
    async update(group: IGroup): Promise<any> {
        const [, db_group] = await this.groupModel.update({
            name: group.name,
            permissions: group.permissions
        }, {
            where: { id: Number.parseInt(group.id, 10) },
            returning: true,
            plain: true
        });
        return db_group;
    }

    @logTime('Delete Group')
    async deleteGroup(id: number): Promise<any> {
        const t = await sequelize.transaction();

        try {
            await this.userGroupModel.destroy({
                where: { group_id: id },
                returning: true,
                plain: true,
                transaction: t
            });

            await this.groupModel.destroy({
                where: { id },
                returning: true,
                plain: true,
                transaction: t
            }).then(async (rowsCount: number) => {
                if (rowsCount === 0) {
                    throw new Error(`Group with id ${id} doesn't exist`);
                }
            });

            await t.commit();
            return `Group ${id} successfully removed`;
        } catch (error: any) {
            await t.rollback();
            return Promise.reject(error.message);
        }
    }

    @logTime('Get Groups')
    async getGroups(): Promise<any> {
        return await this.groupModel.findAll();
    }
}
