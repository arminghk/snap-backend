import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Driver } from './Driver.model';

@Table({
  tableName: 'driver_profile',
  timestamps: true,
  freezeTableName: true,
})
export class DriverProfile extends Model {
  @ForeignKey(() => Driver)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
  })
  driverId!: string;

  @Column(DataType.STRING)
  fullName?: string;

  @Column(DataType.STRING)
  nationalId?: string;

  @Column(DataType.STRING)
  carModel?: string;

  @Column(DataType.STRING)
  carColor?: string;

  @Column(DataType.STRING)
  plateNumber?: string;

  @Column(DataType.STRING)
  licenseNumber?: string;
}
