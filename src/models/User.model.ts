import { Table, Column, Model, DataType, AutoIncrement, PrimaryKey, Default, Unique, BelongsToMany } from 'sequelize-typescript';
import { GroupModel } from './Group.model';
import { UserGroupModel } from './UserGroup.model';

@Table({ tableName: 'users', createdAt: false, updatedAt: false })
export class UserModel extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
        id!: number;

    @Unique(true)
    @Column(DataType.TEXT)
        login!: string;

    @Column(DataType.TEXT)
        password!: string;

    @Column(DataType.INTEGER)
        age!: number;

    @Default(false)
    @Column({ type: DataType.BOOLEAN, field: 'is_deleted' })
        isDeleted!: boolean;

    @BelongsToMany(() => GroupModel, () => UserGroupModel)
        groups!: Array<GroupModel & {UserGroupModel: UserGroupModel}>;
}
