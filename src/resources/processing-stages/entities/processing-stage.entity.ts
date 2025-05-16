import { Table, Column, Model, DataType, AllowNull, Unique,  } from 'sequelize-typescript';

@Table({ 
    tableName: 'processing_stages',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    createdAt: false,
    updatedAt: false,
})
export class ProcessingStage extends Model { 
    @AllowNull(false)
    @Unique
    @Column({ 
        type: DataType.STRING,
        validate: { len: [1, 255] },
    })
    name: string;
}