import { DriverModel, DriverSessionModel } from "./driver.dto";


export class AuthorizeOutputDto {
  isAuthorized: boolean;
  driver?: DriverModel;
  session?: DriverSessionModel;
  tokenData?: {
    token: string;
    ttl: number;
  };
  clearCookie?
}