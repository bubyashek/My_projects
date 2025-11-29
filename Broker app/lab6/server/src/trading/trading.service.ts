import { Injectable } from '@nestjs/common';
import { TradingSettings } from './trading.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TradingService {
  private tradingFilePath: string;

  constructor() {
    const dataPath = process.env.DATA_PATH || '../../lab5/server/data';
    // Use process.cwd() which is the server directory
    this.tradingFilePath = path.resolve(process.cwd(), dataPath, 'trading.json');
    console.log('📁 Trading file path:', this.tradingFilePath);
  }

  private readTradingSettings(): TradingSettings {
    try {
      const data = fs.readFileSync(this.tradingFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading trading settings:', error);
      return {
        startDate: '01.01.2024',
        speedInSeconds: 1,
        isRunning: false,
        currentDate: '01.01.2024',
        currentPrices: {},
      };
    }
  }

  getTradingSettings(): TradingSettings {
    return this.readTradingSettings();
  }

  getCurrentPrices(): { [symbol: string]: string } {
    const settings = this.readTradingSettings();
    return settings.currentPrices || {};
  }

  getCurrentDate(): string {
    const settings = this.readTradingSettings();
    return settings.currentDate;
  }

  parsePrice(priceStr: string): number {
    return parseFloat(priceStr.replace('$', ''));
  }
}

