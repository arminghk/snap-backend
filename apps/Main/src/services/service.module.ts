import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { SelfActionService } from './actions.service';
import { DriversService } from 'providers/driver.service';


@Module({
  imports: [],
  controllers: [ServiceController],
  providers: [
    DriversService,


    SelfActionService
  ],
})
export class ServiceModule {}
