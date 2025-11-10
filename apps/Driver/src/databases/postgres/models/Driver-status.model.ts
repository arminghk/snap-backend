import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Driver } from './Driver.model';

export enum DriverState {
  OFFLINE = 'OFFLINE',
  ONLINE = 'ONLINE',
  SEARCHING = 'SEARCHING',
  ASSIGNED = 'ASSIGNED',
  EN_ROUTE_PICKUP = 'EN_ROUTE_PICKUP',
  ARRIVED_PICKUP = 'ARRIVED_PICKUP',
  LOADING = 'LOADING',
  ON_TRIP = 'ON_TRIP',
  ARRIVED_DROPOFF = 'ARRIVED_DROPOFF',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

@Table({
  tableName: 'driver_status',
  timestamps: true,
  freezeTableName: true,
})
export class DriverStatus extends Model {
  @ForeignKey(() => Driver)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
  })
  driverId!: string;


  @Column({
    type: DataType.ENUM(...Object.values(DriverState)),
    allowNull: false,
    defaultValue: DriverState.OFFLINE,
  })
  state!: DriverState;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  latitude?: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  longitude?: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isAvailable!: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  lastSeenAt?: Date;
}
