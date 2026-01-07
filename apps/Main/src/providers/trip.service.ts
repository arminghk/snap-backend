import { HttpStatus, Injectable } from '@nestjs/common';
import { PostgresService } from 'src/databases/postgres/postgres.service';
import {
  ServiceClientContextDto,
  ServiceResponseData,
  SrvError,
} from 'src/services/dto';
import { Transaction } from 'sequelize';
import config from 'config';

@Injectable()
export class TripService {
  private readonly fareConfig = config.get('fare');
  constructor(private readonly pg: PostgresService) {}

 async create({
  query,
}: ServiceClientContextDto): Promise<ServiceResponseData> {
  const {
    passengerId,
    originLat,
    originLng,
    destinationLat,
    destinationLng,
  } = query;

  if (!passengerId) {
    throw new SrvError(HttpStatus.UNAUTHORIZED, 'Passenger not authorized');
  }

  /**
   * ⚠️ موقتاً mock estimate
   * بعداً اینو می‌بریم روی MapService (Google / Mapbox)
   */
  const estimatedDistanceKm = this.calculateDistanceKm(
    originLat,
    originLng,
    destinationLat,
    destinationLng,
  );

  const estimatedDurationMin = Math.ceil(estimatedDistanceKm * 2); // فرضی
  const trafficLevel: 'low' | 'medium' | 'high' = 'medium';

  const { baseFare, perKm, perMinute, trafficMultiplier } = this.fareConfig;

  const rawFare =
    baseFare +
    estimatedDistanceKm * perKm +
    estimatedDurationMin * perMinute;

  const priceEstimate = Math.round(
    rawFare * (trafficMultiplier[trafficLevel] || 1),
  );

  const trip = await this.pg.models.Trip.create({
    passengerId,
    originLat,
    originLng,
    destinationLat,
    destinationLng,
    priceEstimate,
    status: 'REQUESTED',
  });

  return {
    message: 'Trip created successfully',
    data: trip,
  };
}
private calculateDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371; // km
  const dLat = this.deg2rad(lat2 - lat1);
  const dLng = this.deg2rad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(this.deg2rad(lat1)) *
      Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

private deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

  async accept({
    query,
  }: ServiceClientContextDto): Promise<ServiceResponseData> {
    const { tripId, driverId } = query;

    if (!tripId || !driverId) {
      throw new SrvError(HttpStatus.BAD_REQUEST, 'Invalid input');
    }

    return await this.pg.connection.transaction(
      async (transaction: Transaction) => {
        const trip = await this.pg.models.Trip.findOne({
          where: {
            id: tripId,
            status: 'REQUESTED',
          },
          lock: transaction.LOCK.UPDATE,
          transaction,
        });

        if (!trip) {
          throw new SrvError(
            HttpStatus.CONFLICT,
            'Trip already accepted or not found',
          );
        }

        await trip.update(
          {
            driverId,
            status: 'ACCEPTED',
            acceptedAt: new Date(),
          },
          { transaction },
        );

        return {
          message: 'Trip accepted successfully',
          data: trip,
        };
      },
    );
  }

  async arrived({
    query,
  }: ServiceClientContextDto): Promise<ServiceResponseData> {
    const { tripId, driverId } = query;

    if (!tripId || !driverId) {
      throw new SrvError(HttpStatus.BAD_REQUEST, 'Invalid input');
    }

    return await this.pg.connection.transaction(
      async (transaction: Transaction) => {
        const trip = await this.pg.models.Trip.findOne({
          where: {
            id: tripId,
            driverId,
            status: 'ACCEPTED',
          },
          lock: transaction.LOCK.UPDATE,
          transaction,
        });

        if (!trip) {
          throw new SrvError(
            HttpStatus.CONFLICT,
            'Trip not found or invalid state',
          );
        }

        await trip.update(
          {
            status: 'DRIVER_ARRIVED',
            arrivedAt: new Date(),
          },
          { transaction },
        );

        return {
          message: 'Driver arrived successfully',
          data: trip,
        };
      },
    );
  }

  async start({
    query,
  }: ServiceClientContextDto): Promise<ServiceResponseData> {
    const { tripId, driverId } = query;

    if (!tripId || !driverId) {
      throw new SrvError(HttpStatus.BAD_REQUEST, 'Invalid input');
    }

    return await this.pg.connection.transaction(
      async (transaction: Transaction) => {
        const trip = await this.pg.models.Trip.findOne({
          where: {
            id: tripId,
            driverId,
            status: 'DRIVER_ARRIVED',
          },
          lock: transaction.LOCK.UPDATE,
          transaction,
        });

        if (!trip) {
          throw new SrvError(HttpStatus.CONFLICT, 'Trip not ready to start');
        }

        await trip.update(
          {
            status: 'STARTED',
            startedAt: new Date(),
          },
          { transaction },
        );

        return {
          message: 'Trip started successfully',
          data: trip,
        };
      },
    );
  }

  async end({ query }: ServiceClientContextDto): Promise<ServiceResponseData> {
    const { tripId, driverId } = query;

    if (!tripId || !driverId) {
      throw new SrvError(HttpStatus.BAD_REQUEST, 'Invalid input');
    }

    return await this.pg.connection.transaction(
      async (transaction: Transaction) => {
        const trip = await this.pg.models.Trip.findOne({
          where: {
            id: tripId,
            driverId,
            status: 'STARTED',
          },
          lock: transaction.LOCK.UPDATE,
          transaction,
        });

        if (!trip) {
          throw new SrvError(HttpStatus.CONFLICT, 'Trip not in started state');
        }

        const finishedAt = new Date();

        await trip.update(
          {
            status: 'FINISHED',
            finishedAt,
          },
          { transaction },
        );

        return {
          message: 'Trip ended successfully',
          data: trip,
        };
      },
    );
  }
}
