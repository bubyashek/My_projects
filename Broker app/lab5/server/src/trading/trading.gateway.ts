import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TradingService } from './trading.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
export class TradingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly tradingService: TradingService) {}

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
    
    // Set up callback for price updates
    this.tradingService.setPriceUpdateCallback((data) => {
      this.server.emit('priceUpdate', data);
    });
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    // Send current trading state to new client
    const settings = this.tradingService.getSettings();
    client.emit('tradingState', settings);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}

