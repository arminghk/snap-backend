import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configurations } from './config/configurations';
import { RestModule } from './rest/rest.module';
import { ServiceModule } from './services/service.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configurations,
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    RestModule,
    ServiceModule,
    UtilsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
