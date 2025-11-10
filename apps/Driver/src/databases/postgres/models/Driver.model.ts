import { Table, Column, Model, DataType, HasOne } from 'sequelize-typescript';


@Table({
  tableName: 'driver',
  timestamps: true,
  freezeTableName: true,
})
export class Driver extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  phone!: string;


  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isVerified!: boolean;


}
