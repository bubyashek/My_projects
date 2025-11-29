import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { BrokersService } from './brokers.service';

@Controller('brokers')
export class BrokersController {
  constructor(private readonly brokersService: BrokersService) {}

  @Get()
  getAllBrokers() {
    return this.brokersService.getAllBrokers();
  }

  @Get(':id')
  getBroker(@Param('id') id: string) {
    return this.brokersService.getBrokerById(id);
  }

  @Post()
  createBroker(@Body() body: { name: string; initialFunds?: number }) {
    return this.brokersService.createBroker(body.name, body.initialFunds);
  }

  @Delete(':id')
  deleteBroker(@Param('id') id: string) {
    return { success: this.brokersService.deleteBroker(id) };
  }

  @Post(':id/buy')
  buyStock(
    @Param('id') id: string,
    @Body() body: { symbol: string; quantity: number; price: number; date: string },
  ) {
    return this.brokersService.buyStock(id, body.symbol, body.quantity, body.price, body.date);
  }

  @Post(':id/sell')
  sellStock(
    @Param('id') id: string,
    @Body() body: { symbol: string; quantity: number; price: number },
  ) {
    return this.brokersService.sellStock(id, body.symbol, body.quantity, body.price);
  }
}


