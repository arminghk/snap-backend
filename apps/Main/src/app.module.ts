import { Module } from '@nestjs/common';
import { ServiceModule } from './services/service.module';
import { ConfigModule } from '@nestjs/config';
import { DatabasesModule } from './databases/database.module';
import { UtilsModule } from './_utils/utils.module';


@Module({
  imports: [
    DatabasesModule,
    UtilsModule,
    ServiceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
