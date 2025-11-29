import { Injectable } from '@nestjs/common';
import { Stock } from './stock.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StocksService {
  private stocksFilePath: string;

  constructor() {
    const dataPath = process.env.DATA_PATH || '../../lab5/server/data';
    // Use process.cwd() which is the server directory
    this.stocksFilePath = path.resolve(process.cwd(), dataPath, 'stocks.json');
    console.log('📁 Stocks file path:', this.stocksFilePath);
  }

  private readStocks(): Stock[] {
    try {
      const data = fs.readFileSync(this.stocksFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading stocks:', error);
      return [];
    }
  }

  getAllStocks(): Stock[] {
    return this.readStocks();
  }

  getActiveStocks(): Stock[] {
    return this.readStocks().filter(stock => stock.isActive);
  }

  getStockBySymbol(symbol: string): Stock | undefined {
    return this.readStocks().find(stock => stock.symbol === symbol);
  }

  getStockPrice(symbol: string, date: string): number | null {
    const stock = this.getStockBySymbol(symbol);
    if (!stock) return null;

    const dataPoint = stock.historicalData.find(d => d.date === date);
    if (!dataPoint) return null;

    return parseFloat(dataPoint.open.replace('$', ''));
  }

  getStockPriceRange(symbol: string, startDate: string, endDate: string): { date: string; price: number }[] {
    const stock = this.getStockBySymbol(symbol);
    if (!stock) return [];

    const start = this.parseDate(startDate);
    const end = this.parseDate(endDate);

    return stock.historicalData
      .filter(d => {
        const date = this.parseDate(d.date);
        return date >= start && date <= end;
      })
      .map(d => ({
        date: d.date,
        price: parseFloat(d.open.replace('$', '')),
      }));
  }

  private parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('.');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
}

