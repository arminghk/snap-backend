import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DriversService } from 'src/providers/driver.service';
import { ServiceClientActionInputDto, ServiceResponseData } from './dto';
import _ from 'lodash'
import { AdminsService } from 'src/providers/admin.service';
import { PassengersService } from 'src/providers/passenger.service';
import { TripService } from 'src/providers/trip.service';


@Injectable()
export class SelfActionService {
  constructor(
    private readonly driversService: DriversService,
    private readonly adminsService: AdminsService,
    private readonly passengerService: PassengersService,
    private readonly tripService: TripService

  ) {}

  async findAndCall(data:ServiceClientActionInputDto): Promise<ServiceResponseData> {
    const providerName = data?.provider || null;
    const actionName = data?.action || null;
    if (!providerName || !actionName)
      throw new Error('err_service_noActionOrProvider');

    let provider: any;
    switch (providerName) {
      case 'DRIVERS':
        provider = this.driversService;
        break;
      case 'ADMINS':
        provider = this.adminsService;
        break;  
      case 'PASSENGERS':
        provider = this.passengerService;
        break;    
      case 'TRIPS':
        provider = this.tripService;
        break;      
      default:
        provider = null;
    }
    if (!provider || !provider[actionName])
      throw new Error('err_service_actionNotFound');

    const response = await provider[actionName](_.pick(data, ["query", "set", "options"])); 

    return {
      message: response?.message ?? 'Ok',
      data: response?.data ?? response,
    };
  }
}
