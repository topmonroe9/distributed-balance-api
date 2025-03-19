import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'users' })
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  balance: number;
}
