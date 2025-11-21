import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { RedisService } from 'src/databases/redis/redis.service';
import { ServiceClientContextDto, ServiceResponseData, SrvError } from 'src/services/dto';

@Injectable()
export class DriversService {
  private static readonly role = 'driver';
  constructor(private readonly redis: RedisService) {}

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
}
