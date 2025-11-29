export interface BrokerPortfolioItem {
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
}

export interface Broker {
  id: string;
  name: string;
  initialFunds: number;
  currentFunds: number;
  portfolio: {
    [symbol: string]: number | BrokerPortfolioItem;
  };
}

