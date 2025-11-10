import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DriverService } from './driver.service';

@Controller()
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @MessagePattern({ cmd: 'driver_requsetOtp' })
  async requsetOtp(data: any) {
    return this.driverService.requsetOtp(data);
  }
}
