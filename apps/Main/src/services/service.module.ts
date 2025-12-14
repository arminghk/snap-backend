import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { SelfActionService } from './actions.service';
import { DriversService } from 'src/providers/driver.service';
import { AdminsService } from 'src/providers/admin.service';
import { PassengersService } from 'src/providers/passenger.service';


@Module({
  imports: [],
  controllers: [ServiceController],
  providers: [
    DriversService,
    AdminsService,
    PassengersService,


    SelfActionService
  ],
})
export class ServiceModule {}
