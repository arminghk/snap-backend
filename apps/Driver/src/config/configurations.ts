// export default () => ({
//   port: parseInt(process.env.PORT ?? '3000', 10) || 3000
// });

import { registerAs } from '@nestjs/config';

const DatabaseConfig = registerAs('Database', () => ({
  database: 'snappdb',
  username: 'snapp',
  password: 'snapp_pass',
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
}));

const RedisConfig = registerAs('Redis', () => ({
  host: 'localhost',
  port: 6379,
  cacheDb: 11,
  sessionDb: 12,
}));

export const configurations = [DatabaseConfig ,RedisConfig];
