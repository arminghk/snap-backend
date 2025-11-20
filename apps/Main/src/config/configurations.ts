// export default () => ({
//   port: parseInt(process.env.PORT ?? '3000', 10) || 3000
// });


import {registerAs} from "@nestjs/config";

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
  sessionDb: 11
}));




export const configurations = [DatabaseConfig,RedisConfig];