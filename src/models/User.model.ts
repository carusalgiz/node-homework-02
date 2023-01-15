import { Table, Column, Model, DataType, AutoIncrement, PrimaryKey, Default, Unique } from 'sequelize-typescript';

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
    @Column({type: DataType.BOOLEAN, field: 'is_deleted'})
    isDeleted!: boolean;
}