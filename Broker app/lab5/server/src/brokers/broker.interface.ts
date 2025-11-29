export interface Broker {
  id: string;
  name: string;
  initialFunds: number;
  currentFunds: number;
  portfolio: { [stockSymbol: string]: number };
}

