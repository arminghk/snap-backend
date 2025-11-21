import { Injectable } from '@nestjs/common';
import { DriverRequestOtpInputDto } from 'src/dtos/driver.dto';
import { handleSrvCliResponse } from 'src/response/httpException.filter';
import { MainServiceClient } from 'src/services/main.service';

@Injectable()
export class DriverAuthService {
  constructor(private readonly mainSrvCli: MainServiceClient) {}

  async requestOtp(body: DriverRequestOtpInputDto) {
    const data = await this.mainSrvCli.callAction({
      provider: 'DRIVERS',
      action: 'requestOtp',
      query: body,
    });

     return handleSrvCliResponse(data);
  }
}
