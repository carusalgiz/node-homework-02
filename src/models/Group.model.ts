import { Table, Column, Model, DataType, AutoIncrement, PrimaryKey, Unique, BelongsToMany } from 'sequelize-typescript';
import { UserModel } from './User.model';
import { UserGroupModel } from './UserGroup.model';

@Table({ tableName: 'groups', createdAt: false, updatedAt: false })
export class GroupModel extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
        id!: number;

    @Unique(true)
    @Column(DataType.TEXT)
        name!: string;

    @Column({ type: DataType.ARRAY(DataType.STRING) })
        permissions!: string[];

    @BelongsToMany(() => UserModel, () => UserGroupModel)
        users!: Array<UserModel & {UserGroupModel: UserGroupModel}>;
}
