import { HttpStatus, Injectable } from '@nestjs/common';
import { PostgresService } from 'src/databases/postgres/postgres.service';
import {
  ServiceClientContextDto,
  ServiceResponseData,
  SrvError,
} from 'src/services/dto';
import { Transaction } from 'sequelize';

@Injectable()
export class TripService {
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

    const trip = await this.pg.models.Trip.create({
      passengerId,
      originLat,
      originLng,
      destinationLat,
      destinationLng,
      status: 'REQUESTED',
    });

    return {
      message: 'Trip created successfully',
      data: trip,
    };
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

  async start({ query }: ServiceClientContextDto): Promise<ServiceResponseData> {
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
        throw new SrvError(
          HttpStatus.CONFLICT,
          'Trip not ready to start',
        );
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

}
