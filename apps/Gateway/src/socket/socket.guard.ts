import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { MainServiceClient } from 'src/services/main.service';

@Injectable()
export class SocketAuthGuard implements CanActivate {
  constructor(private readonly mainSrv: MainServiceClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const token = client.handshake.auth?.token;

    if (!token) return false;

    const res = await this.mainSrv.callAction({
      provider: 'DRIVERS',
      action: 'authorize',
      query: { token },
    });

    if (!res?.data?.isAuthorized) return false;


    client.data.driver = res.data.driver;
    client.data.session = res.data.session;

    return true;
  }
}
