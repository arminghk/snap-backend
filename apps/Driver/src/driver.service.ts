// driver-service/driver.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { PostgresService } from './databases/postgres/postgres.service';
import { Op } from 'sequelize';
import { RedisService } from './databases/redis/redis.service';

@Injectable()
export class DriverService {
  constructor(
    private readonly pg: PostgresService,
    private readonly redisService: RedisService,
  ) {}

  async requsetOtp(data: any) {
    const { phone } = data;
    const existingOtp = await this.redisService.cacheCli.get(`otp:${phone}`);
    if (existingOtp) {
      throw new BadRequestException('OTP already sent, please wait');
    }

    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const ttlSeconds = 2 * 60;

    await this.redisService.cacheCli.set(`otp:${phone}`,otpCode, 'EX',ttlSeconds);

    return { phone, otp: otpCode, expiresIn: ttlSeconds };
  }
}
