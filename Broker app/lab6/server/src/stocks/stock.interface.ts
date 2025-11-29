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


