// src/database/postgres.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostgresService implements OnModuleInit {
  public connection: Sequelize;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    try {
      console.log('🔹 Trying to connect to database with config');
      const dbConfig = this.configService.get('Database');

      this.connection = new Sequelize({
        dialect: dbConfig.dialect,
        host: dbConfig.host,
        port: dbConfig.port,
        username: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.database,
        logging: false,
      });

      await this.connection.authenticate();
      console.log('✅ Database connection established successfully!');
    } catch (error) {
      console.log('error----->', error);
      process.exit(1);
    }
  }
}
