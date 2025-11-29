import { Injectable } from '@nestjs/common';
import { StocksService } from '../stocks/stocks.service';
import { TradingSettings } from './trading.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TradingService {
  private readonly dataPath = path.join(__dirname, '../../data/trading.json');
  private readonly statePath = path.join(__dirname, '../../data/trading-state.json');
  private settings: TradingSettings;
  private tradingInterval: NodeJS.Timeout | null = null;
  private currentIndex = 0;
  private priceUpdateCallback: ((data: any) => void) | null = null;

  constructor(private readonly stocksService: StocksService) {
    this.loadSettings();
    this.loadState();
  }

  private loadState(): void {
    try {
      if (fs.existsSync(this.statePath)) {
        const data = fs.readFileSync(this.statePath, 'utf-8');
        const state = JSON.parse(data);
        this.currentIndex = state.currentIndex || 0;
      }
    } catch (error) {
      console.error('Error loading trading state:', error);
      this.currentIndex = 0;
    }
  }

  private saveState(): void {
    try {
      const dataDir = path.dirname(this.statePath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(this.statePath, JSON.stringify({ currentIndex: this.currentIndex }, null, 2));
    } catch (error) {
      console.error('Error saving trading state:', error);
    }
  }

  private loadSettings(): void {
    try {
      const dataDir = path.dirname(this.dataPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      if (fs.existsSync(this.dataPath)) {
        const data = fs.readFileSync(this.dataPath, 'utf-8');
        this.settings = JSON.parse(data);
      } else {
        this.settings = this.getDefaultSettings();
        this.saveSettings();
      }
    } catch (error) {
      console.error('Error loading trading settings:', error);
      this.settings = this.getDefaultSettings();
    }
  }

  private getDefaultSettings(): TradingSettings {
    return {
      startDate: '01.11.2024',
      speedInSeconds: 1,
      isRunning: false,
      currentDate: '01.11.2024',
      currentPrices: {},
    };
  }

  private saveSettings(): void {
    try {
      fs.writeFileSync(this.dataPath, JSON.stringify(this.settings, null, 2));
    } catch (error) {
      console.error('Error saving trading settings:', error);
    }
  }

  getSettings(): TradingSettings {
    return this.settings;
  }

  updateSettings(updates: Partial<TradingSettings>): TradingSettings {
    // Stop trading if it's running
    if (this.settings.isRunning) {
      this.stopTrading();
    }

    // If startDate is being updated, find nearest trading day and reset everything
    if (updates.startDate !== undefined) {
      const nearestTradingDay = this.findNearestTradingDay(updates.startDate);
      this.settings.startDate = nearestTradingDay;
      this.settings.currentDate = nearestTradingDay;
      this.currentIndex = 0;
      this.settings.currentPrices = {};
      
      // Update speed if provided
      if (updates.speedInSeconds !== undefined) {
        this.settings.speedInSeconds = updates.speedInSeconds;
      }
    } else if (updates.speedInSeconds !== undefined) {
      // Only speed is being updated
      this.settings.speedInSeconds = updates.speedInSeconds;
    }
    
    this.saveSettings();
    this.saveState();
    return this.settings;
  }

  private findNearestTradingDay(dateStr: string): string {
    const activeStocks = this.stocksService.getActiveStocks();
    if (activeStocks.length === 0) {
      return dateStr; // No stocks, return as-is
    }

    const firstStock = activeStocks[0];
    
    // Try to find exact match first
    const exactMatch = firstStock.historicalData.find(d => d.date === dateStr);
    if (exactMatch) {
      return dateStr;
    }

    // Parse the requested date
    const requestedDateParts = dateStr.split('.');
    const requestedDate = new Date(
      parseInt(requestedDateParts[2]), // year
      parseInt(requestedDateParts[1]) - 1, // month (0-indexed)
      parseInt(requestedDateParts[0]) // day
    );

    // Find the closest trading day on or after the requested date
    let closestDate: string | null = null;
    let minDiff = Infinity;

    for (const dataPoint of firstStock.historicalData) {
      const dateParts = dataPoint.date.split('.');
      const tradingDate = new Date(
        parseInt(dateParts[2]),
        parseInt(dateParts[1]) - 1,
        parseInt(dateParts[0])
      );

      // Calculate difference in days
      const diff = tradingDate.getTime() - requestedDate.getTime();

      // Only consider dates on or after requested date
      if (diff >= 0 && diff < minDiff) {
        minDiff = diff;
        closestDate = dataPoint.date;
      }
    }

    if (closestDate) {
      if (closestDate !== dateStr) {
        console.log(`Adjusted start date from ${dateStr} to ${closestDate} (nearest trading day)`);
      }
      return closestDate;
    }

    // If no date found after requested date, return the last trading day
    const lastDate = firstStock.historicalData[firstStock.historicalData.length - 1].date;
    console.log(`Requested date ${dateStr} is after all available data. Using last trading day: ${lastDate}`);
    return lastDate;
  }

  startTrading(): TradingSettings {
    if (this.settings.isRunning) {
      return this.settings;
    }

    this.settings.isRunning = true;

    const activeStocks = this.stocksService.getActiveStocks();
    if (activeStocks.length === 0) {
      console.log('No active stocks available for trading');
      this.settings.isRunning = false;
      return this.settings;
    }

    // Find the index for the current date in historical data
    const firstStock = activeStocks[0];
    const startIndex = firstStock.historicalData.findIndex(
      (data) => data.date === this.settings.currentDate,
    );

    if (startIndex === -1) {
      console.log(`Start date ${this.settings.currentDate} not found in historical data`);
      this.settings.isRunning = false;
      return this.settings;
    }

    this.currentIndex = startIndex;
    console.log(`Starting trading from ${this.settings.currentDate} (index: ${this.currentIndex})`);

    // Update prices immediately
    this.updatePrices();

    // Start interval
    this.tradingInterval = setInterval(() => {
      this.updatePrices();
    }, this.settings.speedInSeconds * 1000);

    this.saveSettings();
    return this.settings;
  }

  stopTrading(): TradingSettings {
    if (this.tradingInterval) {
      clearInterval(this.tradingInterval);
      this.tradingInterval = null;
    }
    this.settings.isRunning = false;
    // Save current state so we can continue from here
    this.saveSettings();
    this.saveState();
    return this.settings;
  }

  private updatePrices(): void {
    const activeStocks = this.stocksService.getActiveStocks();
    
    if (activeStocks.length === 0) {
      console.log('No active stocks, stopping trading');
      this.stopTrading();
      return;
    }

    const newPrices: { [symbol: string]: string } = {};
    let currentDate = this.settings.currentDate;

    // Check if we've reached the end of data
    const firstStock = activeStocks[0];
    if (this.currentIndex >= firstStock.historicalData.length) {
      console.log(`Reached end of historical data at index ${this.currentIndex}`);
      this.stopTrading();
      return;
    }

    // Get prices for all active stocks at current index
    activeStocks.forEach((stock) => {
      if (this.currentIndex < stock.historicalData.length) {
        const dataPoint = stock.historicalData[this.currentIndex];
        newPrices[stock.symbol] = dataPoint.open;
        currentDate = dataPoint.date;
      }
    });

    this.settings.currentDate = currentDate;
    this.settings.currentPrices = newPrices;

    console.log(`Trading day ${this.currentIndex + 1}: ${currentDate}`);

    // Save state after updating prices
    this.saveState();
    this.saveSettings();

    // Notify WebSocket clients
    if (this.priceUpdateCallback) {
      this.priceUpdateCallback({
        currentDate: this.settings.currentDate,
        currentPrices: this.settings.currentPrices,
      });
    }

    // Move to next day
    this.currentIndex++;
  }

  setPriceUpdateCallback(callback: (data: any) => void): void {
    this.priceUpdateCallback = callback;
  }

  resetTrading(): TradingSettings {
    this.stopTrading();
    this.currentIndex = 0;
    this.settings.currentDate = this.settings.startDate;
    this.settings.currentPrices = {};
    this.settings.isRunning = false;
    console.log(`🔄 Trading reset to start date: ${this.settings.startDate}`);
    this.saveSettings();
    this.saveState();
    return this.settings;
  }
}

