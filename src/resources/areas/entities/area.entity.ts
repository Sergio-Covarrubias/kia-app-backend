import { Table, Column, Model, DataType, AllowNull, Unique,  } from 'sequelize-typescript';

@Table({ 
    tableName: 'areas',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    createdAt: false,
    updatedAt: false,
})
export class Area extends Model { 
    @AllowNull(false)
    @Unique
    @Column({ 
        type: DataType.STRING,
        validate: { len: [1, 255] },
    })
    name: string;
}
