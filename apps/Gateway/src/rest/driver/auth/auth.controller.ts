import { Body, Controller, Post } from '@nestjs/common';
import { DriverAuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { DriverRequestOtpInputDto } from 'src/dtos/driver.dto';


@Controller('Auth')
export class DriverAuthController {
  constructor(private readonly driverAuthService: DriverAuthService) {}

  @Post('request-otp')
  @ApiOperation({ summary: 'requestOtp in app by phone number' })
  async requsetOtp(@Body() body: DriverRequestOtpInputDto) {
    const requsetOtpData = await this.driverAuthService.requsetOtp(body);
    return requsetOtpData
  }
}
