import { Injectable } from '@nestjs/common';
import { handleSrvCliResponse } from 'src/response/httpException.filter';
import { MainServiceClient } from 'src/services/main.service';

@Injectable()
export class DriverTripService {
  constructor(private readonly mainSrvCli: MainServiceClient) {}

  async acceptTrip(data: any) {
    const res = await this.mainSrvCli.callAction({
      provider: 'TRIPS',
      action: 'accept',
      query: data,
    });

     return handleSrvCliResponse(res);
  }
}
