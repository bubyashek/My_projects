export interface Broker {
  id: string;
  name: string;
  initialFunds: number;
  currentFunds: number;
  portfolio: { [stockSymbol: string]: number };
}

export interface StockDataPoint {
  date: string;
  open: string;
}

export interface Stock {
  symbol: string;
  name: string;
  historicalData: StockDataPoint[];
  isActive: boolean;
}

export interface TradingSettings {
  startDate: string;
  speedInSeconds: number;
  isRunning: boolean;
  currentDate: string;
  currentPrices: { [symbol: string]: string };
}

