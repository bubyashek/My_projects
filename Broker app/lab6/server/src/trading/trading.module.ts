import { Module } from '@nestjs/common';
import { TradingController } from './trading.controller';
import { TradingService } from './trading.service';
import { TradingGateway } from './trading.gateway';
import { StocksModule } from '../stocks/stocks.module';

@Module({
  imports: [StocksModule],
  controllers: [TradingController],
  providers: [TradingService, TradingGateway],
  exports: [TradingService],
})
export class TradingModule {}


