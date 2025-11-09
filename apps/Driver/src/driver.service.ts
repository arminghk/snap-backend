// driver-service/driver.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class DriverService {
  async signUp(data: any) {
    return 'hi from driver service';
  }
}