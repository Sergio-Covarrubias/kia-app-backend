import { Table, Column, Model, DataType, AllowNull, Unique,  } from 'sequelize-typescript';

@Table({ 
    tableName: 'sct_codes',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    createdAt: false,
    updatedAt: false,
})
export class SctCode extends Model { 
    @AllowNull(false)
    @Unique
    @Column({ 
        type: DataType.STRING(30),
        validate: { len: [20, 30] },
    })
    code: string;
}