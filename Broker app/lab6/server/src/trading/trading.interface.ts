export interface TradingSettings {
  startDate: string;
  speedInSeconds: number;
  isRunning: boolean;
  currentDate: string;
  currentPrices: {
    [symbol: string]: string;
  };
}


