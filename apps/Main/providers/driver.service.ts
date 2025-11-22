import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PostgresService } from 'src/databases/postgres/postgres.service';
import { RedisService } from 'src/databases/redis/redis.service';
import { ServiceClientContextDto, ServiceResponseData, SrvError } from 'src/services/dto';

@Injectable()
export class DriversService {
  private static readonly role = 'driver';
  constructor(
    private readonly pg: PostgresService,
    private readonly redis: RedisService
  ) {}

  async requestOtp({ query }: ServiceClientContextDto):Promise<ServiceResponseData> {
    let {phone} = query
    const key = `otp:${DriversService.role}:${phone}`;
    const existing = await this.redis.cacheCli.get(key);
    if (existing) throw new SrvError(HttpStatus.BAD_REQUEST, 'OTP already sent');

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const ttl = 2 * 60;
    await this.redis.cacheCli.set(key, otp, 'EX', ttl);

    return {
      message:'OTP send successfully!',
      data:{
        success: true, otp, phone, expiresIn: ttl 
      }
    };
  }

  async verifyOtp({ query }: ServiceClientContextDto): Promise<ServiceResponseData> {
    const { phone, otp } = query;
    const key = `otp:${DriversService.role}:${phone}`;

    const savedOtp = await this.redis.cacheCli.get(key);
    if (!savedOtp) {
      throw new SrvError(HttpStatus.BAD_REQUEST, 'OTP not found or expired');
    }

    if (savedOtp !== otp) {
      throw new SrvError(HttpStatus.BAD_REQUEST, 'Invalid OTP');
    }

    await this.redis.cacheCli.del(key);

     let driver = await this.pg.models.Driver.findOne({ where: { phone } });
    if (!driver) {
        driver = await this.pg.models.Driver.create({ phone });
    }

    const newSession = await this.pg.models.DriverSession.create({
        driverId: driver.id,
        refreshExpiresAt: +new Date() 
    });

    return {
      message: 'OTP verified successfully!',
      data: {
        success: true,
        phone,
      },
    };
  }
}
