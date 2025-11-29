export interface Broker {
  id: string;
  name: string;
  initialFunds: number;
  currentFunds: number;
  portfolio: {
    [symbol: string]: {
      quantity: number;
      purchasePrice: number;
      purchaseDate: string;
    };
  };
}

export interface HistoricalDataPoint {
  date: string;
  open: string;
}

export interface Stock {
  symbol: string;
  name: string;
  isActive: boolean;
  historicalData: HistoricalDataPoint[];
}

export interface TradingSettings {
  startDate: string;
  speedInSeconds: number;
  isRunning: boolean;
  currentDate: string;
  currentPrices: {
    [symbol: string]: string;
  };
}


