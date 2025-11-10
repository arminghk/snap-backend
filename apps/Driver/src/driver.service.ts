// driver-service/driver.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { PostgresService } from './databases/postgres/postgres.service';
import { Op } from 'sequelize';

@Injectable()
export class DriverService {
  constructor(private readonly pg: PostgresService) {}

  async requsetOtp(data: any) {
    let { phone } = data;
    const existingOtp = await this.pg.models.DriverOtp.findOne({
      where: {
        phone,
        isUsed: false,
        expiresAt: { [Op.gt]: new Date() },
      },
    });
    if (existingOtp) {
      throw new BadRequestException('OTP already sent, please wait');
    }

    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    const newOtp = await this.pg.models.DriverOtp.create({
      phone,
      otp: otpCode,
      expiresAt,
      isUsed: false,
    });

    return newOtp;
  }
}
