import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { SelfActionService } from './actions.service';
import { DriversService } from 'src/providers/driver.service';
import { AdminsService } from 'src/providers/admin.service';


@Module({
  imports: [],
  controllers: [ServiceController],
  providers: [
    DriversService,
    AdminsService,


    SelfActionService
  ],
})
export class ServiceModule {}
