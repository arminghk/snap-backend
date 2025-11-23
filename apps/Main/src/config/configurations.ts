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
  host: '127.0.0.1',
  port: 6379,
  cacheDb: 10,
  sessionDb: 11,
}));

const JwtConfig = registerAs('Jwt', () => ({
  access: { secret: 'ACCESS_SECRET', expiresInSeconds: 60 * 15 }, 
  refresh: { secret: 'REFRESH_SECRET', expiresInSeconds: 60 * 60 * 24 * 7 }, 
}));

export const configurations = [DatabaseConfig, RedisConfig,JwtConfig];
