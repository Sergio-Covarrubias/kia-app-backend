import { Table, Column, Model, DataType, AllowNull, Unique, Default } from 'sequelize-typescript';

@Table({ 
    tableName: 'users',
    timestamps: false,
})
export class User extends Model {
    @AllowNull(false)
    @Unique
    @Column({ type: DataType.STRING})
    corporate_id: string;

    @AllowNull(false)
    @Column({ type: DataType.STRING })
    password: string;

    @AllowNull(false)
    @Column({ type: DataType.BOOLEAN })
    is_admin: boolean;
}
