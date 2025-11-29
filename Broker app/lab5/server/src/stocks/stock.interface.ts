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

