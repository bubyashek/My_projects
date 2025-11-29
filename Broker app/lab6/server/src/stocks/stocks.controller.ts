import { Controller, Get, Param, Query } from '@nestjs/common';
import { StocksService } from './stocks.service';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get()
  getAllStocks(@Query('active') active?: string) {
    if (active === 'true') {
      return this.stocksService.getActiveStocks();
    }
    return this.stocksService.getAllStocks();
  }

  @Get(':symbol')
  getStock(@Param('symbol') symbol: string) {
    return this.stocksService.getStockBySymbol(symbol);
  }

  @Get(':symbol/price/:date')
  getStockPrice(@Param('symbol') symbol: string, @Param('date') date: string) {
    const price = this.stocksService.getStockPrice(symbol, date);
    return { symbol, date, price };
  }

  @Get(':symbol/range')
  getStockPriceRange(
    @Param('symbol') symbol: string,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.stocksService.getStockPriceRange(symbol, start, end);
  }
}


