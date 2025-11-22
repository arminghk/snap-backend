// src/database/postgres.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '@nestjs/config';
import * as models from "./models";

@Injectable()
export class PostgresService implements OnModuleInit {
  public connection: Sequelize;
  private logger = new Logger("databases/postgres/postgres.service");
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {

      console.log('🔹 Trying to connect to database with config');
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
       sequelizeInstance.addModels(Object.values(models));

       models.Driver.hasOne(models.DriverSession, { foreignKey: "driverId", as: "session" });
       models.DriverSession.belongsTo(models.Driver, { foreignKey: "driverId", as: "driver" });
         
       try {
            await sequelizeInstance.sync({alter:true});
        } catch (e) {
            this.logger.fatal("Syncing error");
            this.logger.fatal(e);
            console.log(e)
            process.exit(1);
        }
        this.logger.verbose("Postgres database is connected!");
        this.connection = sequelizeInstance;
    
   
  }

  public models = models;
}
