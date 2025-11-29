import { Module } from '@nestjs/common';
import { BrokersModule } from './brokers/brokers.module';
import { StocksModule } from './stocks/stocks.module';
import { TradingModule } from './trading/trading.module';

@Module({
  imports: [BrokersModule, StocksModule, TradingModule],
})
export class AppModule {}


