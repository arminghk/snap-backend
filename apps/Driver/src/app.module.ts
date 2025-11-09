import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configurations } from './config/configurations';
import { DatabasesModule } from './databases/database.module';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configurations,
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    DatabasesModule
  ],
  controllers: [DriverController],
  providers: [DriverService],
})
export class AppModule {}
