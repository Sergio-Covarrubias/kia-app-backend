import { Table, Column, Model, DataType, AllowNull, Unique, } from 'sequelize-typescript';

@Table({
  tableName: 'providers_2',
  timestamps: true,
  paranoid: true,
  deletedAt: 'deleted_at',
  createdAt: false,
  updatedAt: false,
})
export class Provider2 extends Model {
  @AllowNull(false)
  @Unique
  @Column({
    type: DataType.STRING,
    validate: { len: [1, 255] },
  })
  name: string;

  @AllowNull(true)
  @Unique
  @Column({
    type: DataType.STRING(20),
    validate: { len: [10, 20] },
  })
  authorization_code: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
    validate: { len: [1, 255] },
  })
  address: string;
}
