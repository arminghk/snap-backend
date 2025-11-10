import { Injectable } from '@nestjs/common';
import { DriverRequestOtpInputDto } from 'src/dtos/driver.dto';
import { MainServiceClient } from 'src/services/main.service';

@Injectable()
export class DriverAuthService {
  constructor(private readonly mainSrvCli: MainServiceClient) {}

  async requsetOtp(body: DriverRequestOtpInputDto) {
    const data = await this.mainSrvCli.callAction({
      provider: 'DRIVERS',
      action: 'requsetOtp',
      query: body,
    });

    return data
  }
}
