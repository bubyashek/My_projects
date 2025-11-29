import { Controller, Get } from '@nestjs/common';
import { TradingService } from './trading.service';

@Controller('trading')
export class TradingController {
  constructor(private readonly tradingService: TradingService) {}

  @Get('settings')
  getTradingSettings() {
    return this.tradingService.getTradingSettings();
  }

  @Get('prices')
  getCurrentPrices() {
    return this.tradingService.getCurrentPrices();
  }
}


