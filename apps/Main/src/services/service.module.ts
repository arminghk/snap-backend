import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { SelfActionService } from './actions.service';
import { DriversService } from 'providers/driver.service';
import { ClientsModule, Transport } from '@nestjs/microservices';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DRIVER',
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 4010 },
      },
    ])
  ],
  controllers: [ServiceController],
  providers: [
    DriversService,


    SelfActionService
  ],
})
export class ServiceModule {}
