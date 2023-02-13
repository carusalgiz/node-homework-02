import { Transaction } from 'sequelize';
import sequelize from '../config/connection';
import { logTime } from '../middleware/logger.middleware';

export default class UserGroupService {
    userGroupModel: any;
    userModel: any;
    groupModel: any;

    constructor(userGroupModel: any, userModel: any, groupModel: any) {
        this.userGroupModel = userGroupModel;
        this.userModel = userModel;
        this.groupModel = groupModel;
    }

    @logTime('Add Users To Group')
    async addUsersToGroup(groupId: string, userIds: string[]): Promise<any> {
        return await sequelize.transaction(async (t: Transaction) => {
            try {
                const group = await this.groupModel.findOne({ where: { id: groupId } });

                if (!group) {
                    throw new Error(`Group with id ${groupId} doesn't exist`);
                } else {
                    for (const userId of userIds) {
                        const user = await this.userModel.findOne({ where: { id: userId } });
                        if (user) {
                            const userGroup = await this.userGroupModel.findOne({ where: { user_id: userId, group_id: groupId } });
                            if (!userGroup) {
                                await this.userGroupModel.create({ user_id: userId, group_id: groupId }, { transaction: t });
                            } else {
                                throw new Error(`User ${userId} already added to group ${groupId}`);
                            }
                        } else {
                            throw new Error(`User with id ${userId} doesn't exist`);
                        }
                    }
                    return `Users successfully added to the group ${groupId}`;
                }
            } catch (error: any) {
                await t.rollback();
                return Promise.reject(error.message);
            }
        });
    }
}
