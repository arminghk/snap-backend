import { Injectable, Logger, OnModuleInit } from '@nestjs/common';



import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}
  private logger = new Logger('_databases/redis/redis.service');

  public cacheCli!: Redis;
  public sessionCli!: Redis;
  async onModuleInit() {
    const redisConfig = this.configService.get('Database');
    const cacheClient = new Redis({
      host: 'localhost',
      port: 6379,
      db: redisConfig.cacheDb,
    });
    cacheClient.on('error', (e) => {
      this.logger.fatal('cacheClient connecting error');
      this.logger.fatal(e);
      process.exit(1);
    });
    cacheClient.on('connect', () => {
      this.logger.verbose('cacheClient is connected!');
    });
    this.cacheCli = cacheClient;

    const sessionClient = new Redis({
      host: 'localhost',
      port: 6379,
      db: redisConfig.sessionDb,
    });
    sessionClient.on('error', (e) => {
      this.logger.fatal('sessionClient connecting error');
      this.logger.fatal(e);
      process.exit(1);
    });
    sessionClient.on('connect', () => {
      this.logger.verbose('sessionClient is connected!');
    });
    this.sessionCli = sessionClient;
  }
}
