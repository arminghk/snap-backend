import { DataType, Table, Column, Model } from 'sequelize-typescript';

/* =====================
   Trip Status Enum
===================== */
 enum TripStatus {
  REQUESTED = 'REQUESTED',
  SEARCHING = 'SEARCHING',
  ACCEPTED = 'ACCEPTED',
  DRIVER_ARRIVED = 'DRIVER_ARRIVED',
  STARTED = 'STARTED',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
}

@Table({
  tableName: 'trip',
  timestamps: true,
  freezeTableName: true,
})
export class Trip extends Model {
  /* =====================
     Primary Key
  ===================== */

  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  /* =====================
     Relations
  ===================== */

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  passengerId: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  driverId?: string;

  /* =====================
     Location
  ===================== */

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  originLat: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  originLng: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  destinationLat: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  destinationLng: number;

  /* =====================
     Trip State
  ===================== */

  @Column({
    type: DataType.ENUM(...Object.values(TripStatus)),
    allowNull: false,
    defaultValue: TripStatus.REQUESTED,
  })
  status: TripStatus;

  /* =====================
     Fare - Estimate
     (Calculated on CREATE)
  ===================== */

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  estimatedDistanceKm?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  estimatedDurationMin?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  priceEstimate?: number;

  /* =====================
     Fare - Final
     (Calculated on FINISH)
  ===================== */

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  actualDistanceKm?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  actualDurationMin?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  finalFare?: number;

  /* =====================
     Timeline
  ===================== */

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  acceptedAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  startedAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  finishedAt?: Date;
}
