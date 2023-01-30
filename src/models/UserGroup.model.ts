import { Table, Column, Model, DataType, AutoIncrement, PrimaryKey, ForeignKey } from 'sequelize-typescript';
import { GroupModel } from './Group.model';
import { UserModel } from './User.model';

@Table({ tableName: 'usergroup', createdAt: false, updatedAt: false })
export class UserGroupModel extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
        id!: number;

    @ForeignKey(() => UserModel)
    @Column
        user_id!: number;

    @ForeignKey(() => GroupModel)
    @Column
        group_id!: number;
}
