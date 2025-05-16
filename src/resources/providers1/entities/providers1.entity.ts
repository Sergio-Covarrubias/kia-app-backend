import { Table, Column, Model, DataType, AllowNull, Unique,  } from 'sequelize-typescript';

@Table({ 
    tableName: 'providers_1',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    createdAt: false,
    updatedAt: false,
})
export class Provider1 extends Model {
    @AllowNull(false)
    @Unique
    @Column({ 
        type: DataType.STRING,
        validate: { len: [1, 255] },
    })
    name: string;
    
    @AllowNull(false)
    @Unique
    @Column({
        type: DataType.STRING(15),
        validate: { len: [10, 15] },
    })
    semarnat_code: string;
}
