import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TradingService } from './trading.service';
import { StocksService } from '../stocks/stocks.service';
import * as fs from 'fs';
import * as path from 'path';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TradingGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private tradingFilePath: string;
  private watchInterval: NodeJS.Timeout;

  constructor(
    private tradingService: TradingService,
    private stocksService: StocksService,
  ) {
    const dataPath = process.env.DATA_PATH || '../../lab5/server/data';
    // Use process.cwd() which is the server directory
    this.tradingFilePath = path.resolve(process.cwd(), dataPath, 'trading.json');
    console.log('📁 WebSocket watching:', this.tradingFilePath);
  }

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
    this.startWatchingTradingFile();
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    // Send initial data with filtered prices
    const settings = this.tradingService.getTradingSettings();
    const filteredSettings = this.filterActivePrices(settings);
    client.emit('trading-update', filteredSettings);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  private startWatchingTradingFile() {
    let lastContent = '';

    this.watchInterval = setInterval(() => {
      try {
        if (fs.existsSync(this.tradingFilePath)) {
          const content = fs.readFileSync(this.tradingFilePath, 'utf-8');
          if (content !== lastContent) {
            lastContent = content;
            const settings = JSON.parse(content);
            const filteredSettings = this.filterActivePrices(settings);
            this.server.emit('trading-update', filteredSettings);
            this.server.emit('price-update', filteredSettings.currentPrices);
          }
        }
      } catch (error) {
        console.error('Error watching trading file:', error);
      }
    }, 500); // Check every 500ms
  }

  private filterActivePrices(settings: any): any {
    // Get active stocks
    const activeStocks = this.stocksService.getActiveStocks();
    const activeSymbols = new Set(activeStocks.map(s => s.symbol));
    
    // Filter currentPrices to only include active stocks
    const filteredPrices: { [symbol: string]: string } = {};
    for (const symbol of activeSymbols) {
      if (settings.currentPrices && settings.currentPrices[symbol]) {
        filteredPrices[symbol] = settings.currentPrices[symbol];
      }
    }
    
    return {
      ...settings,
      currentPrices: filteredPrices,
    };
  }

  ngOnDestroy() {
    if (this.watchInterval) {
      clearInterval(this.watchInterval);
    }
  }
}

