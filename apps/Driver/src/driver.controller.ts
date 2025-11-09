import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DriverService } from './driver.service';

@Controller()
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @MessagePattern({ cmd: 'driver_signup' })
  async signUp(data: any) {
    return this.driverService.signUp(data);
  }
}
