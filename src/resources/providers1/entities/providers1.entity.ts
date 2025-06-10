import { Table, Column, Model, DataType, AllowNull, Unique, } from 'sequelize-typescript';

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

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
    validate: { len: [1, 255] },
  })
  address: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(15),
    validate: { len: [8, 15] },
  })
  phone: string;
}
