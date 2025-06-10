import { Table, Column, Model, DataType, AllowNull, Unique } from 'sequelize-typescript';

@Table({ 
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    createdAt: false,
    updatedAt: false,
})
export class User extends Model {
    @AllowNull(false)
    @Unique
    @Column({ type: DataType.STRING})
    corporate_id: string;

    @AllowNull(false)
    @Column({ 
      type: DataType.STRING, 
      validate: { len: [8, 255] },
    })
    password: string;

    @AllowNull(false)
    @Column({ type: DataType.BOOLEAN })
    is_admin: boolean;
}
