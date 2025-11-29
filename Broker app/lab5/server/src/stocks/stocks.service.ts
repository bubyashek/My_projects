import { Injectable } from '@nestjs/common';
import { Stock } from './stock.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StocksService {
  private readonly dataPath = path.join(__dirname, '../../data/stocks.json');
  private stocks: Stock[] = [];

  constructor() {
    this.loadStocks();
  }

  private loadStocks(): void {
    try {
      const dataDir = path.dirname(this.dataPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      if (fs.existsSync(this.dataPath)) {
        const data = fs.readFileSync(this.dataPath, 'utf-8');
        this.stocks = JSON.parse(data);
      } else {
        this.stocks = this.getDefaultStocks();
        this.saveStocks();
      }
    } catch (error) {
      console.error('Error loading stocks:', error);
      this.stocks = this.getDefaultStocks();
    }
  }

  private getDefaultStocks(): Stock[] {
    return [
      {
        symbol: 'AAPL',
        name: 'Apple, Inc.',
        isActive: true,
        historicalData: this.generateAAPLData(),
      },
      {
        symbol: 'SBUX',
        name: 'Starbucks, Inc.',
        isActive: true,
        historicalData: this.generateSBUXData(),
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft, Inc.',
        isActive: true,
        historicalData: this.generateMSFTData(),
      },
      {
        symbol: 'CSCO',
        name: 'Cisco Systems, Inc.',
        isActive: false,
        historicalData: this.generateCSCOData(),
      },
      {
        symbol: 'QCOM',
        name: 'QUALCOMM Incorporated',
        isActive: false,
        historicalData: this.generateQCOMData(),
      },
      {
        symbol: 'AMZN',
        name: 'Amazon.com, Inc.',
        isActive: true,
        historicalData: this.generateAMZNData(),
      },
      {
        symbol: 'TSLA',
        name: 'Tesla, Inc.',
        isActive: true,
        historicalData: this.generateTSLAData(),
      },
      {
        symbol: 'AMD',
        name: 'Advanced Micro Devices, Inc.',
        isActive: false,
        historicalData: this.generateAMDData(),
      },
    ];
  }

  // Real historical data inspired by actual November 2024 trends
  private generateAAPLData() {
    return [
      { date: '01.11.2024', open: '$225.52' },
      { date: '04.11.2024', open: '$220.89' },
      { date: '05.11.2024', open: '$223.45' },
      { date: '06.11.2024', open: '$222.91' },
      { date: '07.11.2024', open: '$226.96' },
      { date: '08.11.2024', open: '$226.50' },
      { date: '11.11.2024', open: '$224.23' },
      { date: '12.11.2024', open: '$225.12' },
      { date: '13.11.2024', open: '$225.77' },
      { date: '14.11.2024', open: '$225.00' },
      { date: '15.11.2024', open: '$229.87' },
      { date: '18.11.2024', open: '$228.02' },
      { date: '19.11.2024', open: '$228.28' },
      { date: '20.11.2024', open: '$229.00' },
      { date: '21.11.2024', open: '$228.52' },
      { date: '22.11.2024', open: '$229.87' },
      { date: '25.11.2024', open: '$229.00' },
      { date: '26.11.2024', open: '$234.93' },
      { date: '27.11.2024', open: '$236.17' },
      { date: '29.11.2024', open: '$234.00' },
    ];
  }

  private generateSBUXData() {
    return [
      { date: '01.11.2024', open: '$98.32' },
      { date: '04.11.2024', open: '$99.22' },
      { date: '05.11.2024', open: '$98.85' },
      { date: '06.11.2024', open: '$97.55' },
      { date: '07.11.2024', open: '$100.15' },
      { date: '08.11.2024', open: '$99.95' },
      { date: '11.11.2024', open: '$99.40' },
      { date: '12.11.2024', open: '$98.90' },
      { date: '13.11.2024', open: '$98.77' },
      { date: '14.11.2024', open: '$99.05' },
      { date: '15.11.2024', open: '$98.73' },
      { date: '18.11.2024', open: '$99.28' },
      { date: '19.11.2024', open: '$99.12' },
      { date: '20.11.2024', open: '$98.54' },
      { date: '21.11.2024', open: '$98.35' },
      { date: '22.11.2024', open: '$98.90' },
      { date: '25.11.2024', open: '$99.55' },
      { date: '26.11.2024', open: '$100.32' },
      { date: '27.11.2024', open: '$100.88' },
      { date: '29.11.2024', open: '$100.15' },
    ];
  }

  private generateMSFTData() {
    return [
      { date: '01.11.2024', open: '$415.69' },
      { date: '04.11.2024', open: '$418.13' },
      { date: '05.11.2024', open: '$412.72' },
      { date: '06.11.2024', open: '$413.65' },
      { date: '07.11.2024', open: '$420.56' },
      { date: '08.11.2024', open: '$421.43' },
      { date: '11.11.2024', open: '$422.54' },
      { date: '12.11.2024', open: '$421.17' },
      { date: '13.11.2024', open: '$425.02' },
      { date: '14.11.2024', open: '$423.04' },
      { date: '15.11.2024', open: '$415.49' },
      { date: '18.11.2024', open: '$413.50' },
      { date: '19.11.2024', open: '$415.49' },
      { date: '20.11.2024', open: '$415.22' },
      { date: '21.11.2024', open: '$417.79' },
      { date: '22.11.2024', open: '$418.01' },
      { date: '25.11.2024', open: '$417.19' },
      { date: '26.11.2024', open: '$423.90' },
      { date: '27.11.2024', open: '$426.89' },
      { date: '29.11.2024', open: '$423.43' },
    ];
  }

  private generateCSCOData() {
    return [
      { date: '01.11.2024', open: '$56.00' },
      { date: '04.11.2024', open: '$55.83' },
      { date: '05.11.2024', open: '$55.22' },
      { date: '06.11.2024', open: '$55.44' },
      { date: '07.11.2024', open: '$57.29' },
      { date: '08.11.2024', open: '$57.32' },
      { date: '11.11.2024', open: '$56.89' },
      { date: '12.11.2024', open: '$56.52' },
      { date: '13.11.2024', open: '$59.05' },
      { date: '14.11.2024', open: '$58.77' },
      { date: '15.11.2024', open: '$58.21' },
      { date: '18.11.2024', open: '$57.75' },
      { date: '19.11.2024', open: '$58.18' },
      { date: '20.11.2024', open: '$58.50' },
      { date: '21.11.2024', open: '$58.19' },
      { date: '22.11.2024', open: '$58.50' },
      { date: '25.11.2024', open: '$58.67' },
      { date: '26.11.2024', open: '$59.00' },
      { date: '27.11.2024', open: '$59.22' },
      { date: '29.11.2024', open: '$58.95' },
    ];
  }

  private generateQCOMData() {
    return [
      { date: '01.11.2024', open: '$168.54' },
      { date: '04.11.2024', open: '$170.21' },
      { date: '05.11.2024', open: '$169.05' },
      { date: '06.11.2024', open: '$171.54' },
      { date: '07.11.2024', open: '$173.22' },
      { date: '08.11.2024', open: '$175.05' },
      { date: '11.11.2024', open: '$173.87' },
      { date: '12.11.2024', open: '$172.50' },
      { date: '13.11.2024', open: '$173.91' },
      { date: '14.11.2024', open: '$171.83' },
      { date: '15.11.2024', open: '$171.19' },
      { date: '18.11.2024', open: '$173.57' },
      { date: '19.11.2024', open: '$174.03' },
      { date: '20.11.2024', open: '$172.38' },
      { date: '21.11.2024', open: '$169.05' },
      { date: '22.11.2024', open: '$169.93' },
      { date: '25.11.2024', open: '$170.05' },
      { date: '26.11.2024', open: '$170.50' },
      { date: '27.11.2024', open: '$167.90' },
      { date: '29.11.2024', open: '$165.91' },
    ];
  }

  private generateAMZNData() {
    return [
      { date: '01.11.2024', open: '$186.63' },
      { date: '04.11.2024', open: '$188.59' },
      { date: '05.11.2024', open: '$186.38' },
      { date: '06.11.2024', open: '$189.98' },
      { date: '07.11.2024', open: '$197.68' },
      { date: '08.11.2024', open: '$199.50' },
      { date: '11.11.2024', open: '$206.84' },
      { date: '12.11.2024', open: '$205.14' },
      { date: '13.11.2024', open: '$207.09' },
      { date: '14.11.2024', open: '$204.49' },
      { date: '15.11.2024', open: '$201.20' },
      { date: '18.11.2024', open: '$197.12' },
      { date: '19.11.2024', open: '$199.50' },
      { date: '20.11.2024', open: '$198.31' },
      { date: '21.11.2024', open: '$197.00' },
      { date: '22.11.2024', open: '$196.13' },
      { date: '25.11.2024', open: '$195.98' },
      { date: '26.11.2024', open: '$201.70' },
      { date: '27.11.2024', open: '$205.14' },
      { date: '29.11.2024', open: '$202.88' },
    ];
  }

  private generateTSLAData() {
    return [
      { date: '01.11.2024', open: '$248.98' },
      { date: '04.11.2024', open: '$242.84' },
      { date: '05.11.2024', open: '$251.44' },
      { date: '06.11.2024', open: '$288.53' },
      { date: '07.11.2024', open: '$296.91' },
      { date: '08.11.2024', open: '$315.62' },
      { date: '11.11.2024', open: '$350.00' },
      { date: '12.11.2024', open: '$328.49' },
      { date: '13.11.2024', open: '$330.24' },
      { date: '14.11.2024', open: '$311.18' },
      { date: '15.11.2024', open: '$320.72' },
      { date: '18.11.2024', open: '$338.74' },
      { date: '19.11.2024', open: '$340.80' },
      { date: '20.11.2024', open: '$342.03' },
      { date: '21.11.2024', open: '$338.95' },
      { date: '22.11.2024', open: '$352.56' },
      { date: '25.11.2024', open: '$361.64' },
      { date: '26.11.2024', open: '$355.15' },
      { date: '27.11.2024', open: '$354.00' },
      { date: '29.11.2024', open: '$345.16' },
    ];
  }

  private generateAMDData() {
    return [
      { date: '01.11.2024', open: '$145.00' },
      { date: '04.11.2024', open: '$144.89' },
      { date: '05.11.2024', open: '$142.10' },
      { date: '06.11.2024', open: '$145.89' },
      { date: '07.11.2024', open: '$147.33' },
      { date: '08.11.2024', open: '$146.55' },
      { date: '11.11.2024', open: '$146.00' },
      { date: '12.11.2024', open: '$144.68' },
      { date: '13.11.2024', open: '$143.37' },
      { date: '14.11.2024', open: '$137.90' },
      { date: '15.11.2024', open: '$139.50' },
      { date: '18.11.2024', open: '$141.72' },
      { date: '19.11.2024', open: '$143.16' },
      { date: '20.11.2024', open: '$143.50' },
      { date: '21.11.2024', open: '$142.15' },
      { date: '22.11.2024', open: '$143.01' },
      { date: '25.11.2024', open: '$143.42' },
      { date: '26.11.2024', open: '$140.89' },
      { date: '27.11.2024', open: '$139.26' },
      { date: '29.11.2024', open: '$135.53' },
    ];
  }

  private saveStocks(): void {
    try {
      const dataDir = path.dirname(this.dataPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(this.dataPath, JSON.stringify(this.stocks, null, 2));
    } catch (error) {
      console.error('Error saving stocks:', error);
    }
  }

  getAllStocks(): Stock[] {
    return this.stocks;
  }

  getStockBySymbol(symbol: string): Stock | undefined {
    return this.stocks.find((stock) => stock.symbol === symbol);
  }

  toggleStockStatus(symbol: string): Stock | undefined {
    const stock = this.stocks.find((s) => s.symbol === symbol);
    if (stock) {
      stock.isActive = !stock.isActive;
      this.saveStocks();
      return stock;
    }
    return undefined;
  }

  getActiveStocks(): Stock[] {
    return this.stocks.filter((stock) => stock.isActive);
  }
}
