import { Table, Column, Model, DataType, AllowNull, Unique,  } from 'sequelize-typescript';

@Table({ 
    tableName: 'residues',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    createdAt: false,
    updatedAt: false,
})
export class Residue extends Model { 
    @AllowNull(false)
    @Unique
    @Column({ 
        type: DataType.STRING,
        validate: { len: [1, 255] },
    })
    name: string;

    @AllowNull(false)
    @Column({ 
        type: DataType.STRING,
        validate: { len: [1, 255] },
    })
    translated_name: string;

    @AllowNull(false)
    @Column({ 
        type: DataType.STRING(10),
        validate: { len: [10, 10] },
    })
    materials: string;
}
