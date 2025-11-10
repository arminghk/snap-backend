import { lastValueFrom } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class DriversService {
  constructor(@Inject('DRIVER') private driverClient: ClientProxy) {}

  async requsetOtp(data:any) {
    const result = await lastValueFrom(
      this.driverClient.send({ cmd: 'driver_requsetOtp' }, data),
    );
    return result;
  }
}
