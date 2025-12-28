import { Injectable } from '@nestjs/common';
import { handleSrvCliResponse } from 'src/response/httpException.filter';
import { MainServiceClient } from 'src/services/main.service';
import { AppSocketGateway } from 'src/socket/socket.gateway';

@Injectable()
export class DriverTripService {
  constructor(
    private readonly mainSrvCli: MainServiceClient,
    private readonly socketGateway: AppSocketGateway,
  ) {}

  async acceptTrip(data: any) {
    const res = await this.mainSrvCli.callAction({
      provider: 'TRIPS',
      action: 'accept',
      query: data,
    });

    const trip = res.data;

    // Notify passenger
    this.socketGateway.server
      .to(`passenger_${trip.passengerId}`)
      .emit('trip:accepted', trip);

    return handleSrvCliResponse(res);
  }
}
