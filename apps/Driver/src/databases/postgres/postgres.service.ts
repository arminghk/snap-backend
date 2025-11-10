import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import * as models from './models';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostgresService implements OnModuleInit {
  private logger = new Logger('PostgresService');
  public connection!: Sequelize;
  public models = models;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const dbConfig = this.configService.get('Database');

    const sequelizeInstance = new Sequelize({
      dialect: dbConfig.dialect,
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
      logging: false,
    });

    sequelizeInstance.addModels([
      models.Driver,
      models.DriverProfile,
      models.DriverStatus,
      models.DriverOtp,
    ]);
    models.Driver.hasOne(models.DriverStatus, {
      foreignKey: 'driverId',
      as: 'status',
    });
    models.DriverStatus.belongsTo(models.Driver, {
      foreignKey: 'driverId',
      as: 'driver',
    });

    models.Driver.hasOne(models.DriverProfile, {
      foreignKey: 'driverId',
      as: 'profile',
    });
    models.DriverProfile.belongsTo(models.Driver, {
      foreignKey: 'driverId',
      as: 'driver',
    });


    try {
      await sequelizeInstance.authenticate();
      this.logger.log('✅ Database connection established successfully!');
      await sequelizeInstance.sync({ alter: true });
      this.logger.log('✅ All models synchronized successfully!');
    } catch (error) {
      this.logger.error('Database connection failed');
      this.logger.error(error);
      process.exit(1);
    }

    this.connection = sequelizeInstance;
  }
}
