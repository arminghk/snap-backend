import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { SocketAuthGuard } from './socket.guard';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class AppSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('SocketGateway');


  @UseGuards(SocketAuthGuard)
  async handleConnection(client: Socket) {
    const driver = client.data?.driver;
    if (driver) {
      client.join(`driver_${driver.id}`);
      this.logger.log(`Driver ${driver.id} joined room`);
    }
  }

  async handleDisconnect(client: Socket) {
    const driver = client.data?.driver;
    if (driver) {
      this.logger.log(`Driver ${driver.id} disconnected`);
    } else {
      this.logger.log(`Client disconnected: ${client.id}`);
    }
  }


  @UseGuards(SocketAuthGuard)
  @SubscribeMessage('driver:location')
  handleLocation(
    @MessageBody() data: { lat: number; lng: number },
    @ConnectedSocket() client: Socket,
  ) {
    const driver = client.data.driver;
    this.server.emit('driver:location:update', {
      driverId: driver.id,
      ...data,
    });
  }
}
