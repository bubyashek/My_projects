import { Controller, Get, Post, Put, Body } from '@nestjs/common';
import { TradingService } from './trading.service';
import { TradingSettings } from './trading.interface';

@Controller('trading')
export class TradingController {
  constructor(private readonly tradingService: TradingService) {}

  @Get('settings')
  getSettings(): TradingSettings {
    return this.tradingService.getSettings();
  }

  @Put('settings')
  updateSettings(@Body() updates: Partial<TradingSettings>): TradingSettings {
    return this.tradingService.updateSettings(updates);
  }

  @Post('start')
  startTrading(): TradingSettings {
    return this.tradingService.startTrading();
  }

  @Post('stop')
  stopTrading(): TradingSettings {
    return this.tradingService.stopTrading();
  }

  @Post('reset')
  resetTrading(): TradingSettings {
    return this.tradingService.resetTrading();
  }
}

