import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { Stock } from './stock.interface';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get()
  getAllStocks(): Stock[] {
    return this.stocksService.getAllStocks();
  }

  @Get('active')
  getActiveStocks(): Stock[] {
    return this.stocksService.getActiveStocks();
  }

  @Get(':symbol')
  getStock(@Param('symbol') symbol: string): Stock | undefined {
    return this.stocksService.getStockBySymbol(symbol);
  }

  @Post(':symbol/toggle')
  toggleStock(@Param('symbol') symbol: string): Stock | undefined {
    return this.stocksService.toggleStockStatus(symbol);
  }

  @Put(':symbol')
  updateStock(
    @Param('symbol') symbol: string,
    @Body() updates: { isActive: boolean },
  ): Stock | undefined {
    const stock = this.stocksService.getStockBySymbol(symbol);
    if (stock) {
      stock.isActive = updates.isActive;
      return stock;
    }
    return undefined;
  }
}

