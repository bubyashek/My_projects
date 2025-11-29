import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { BrokersService } from './brokers.service';
import { Broker } from './broker.interface';

@Controller('brokers')
export class BrokersController {
  constructor(private readonly brokersService: BrokersService) {}

  @Get()
  getAllBrokers(): Broker[] {
    return this.brokersService.getAllBrokers();
  }

  @Get(':id')
  getBroker(@Param('id') id: string): Broker | undefined {
    return this.brokersService.getBrokerById(id);
  }

  @Post()
  createBroker(@Body() brokerData: { name: string; initialFunds: number }): Broker {
    return this.brokersService.createBroker(brokerData);
  }

  @Put(':id')
  updateBroker(@Param('id') id: string, @Body() updates: Partial<Broker>): Broker | undefined {
    return this.brokersService.updateBroker(id, updates);
  }

  @Delete(':id')
  deleteBroker(@Param('id') id: string): { success: boolean } {
    const success = this.brokersService.deleteBroker(id);
    return { success };
  }

  @Post(':id/reset')
  resetBroker(@Param('id') id: string): Broker | undefined {
    return this.brokersService.resetBrokerFunds(id);
  }
}

