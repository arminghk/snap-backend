// src/driver/entities/driver-otp.model.ts
import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { Driver } from './Driver.model';

@Table({
  tableName: 'driver_otp',
  timestamps: true,
  freezeTableName: true,
})
export class DriverOtp extends Model {

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  phone!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  otp!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expiresAt!: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isUsed!: boolean;
}
