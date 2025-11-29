import axios from 'axios';

const API_BASE_URL = 'http://localhost:3003';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const brokersApi = {
  getAll: () => api.get('/brokers'),
  getById: (id: string) => api.get(`/brokers/${id}`),
  create: (name: string, initialFunds?: number) => 
    api.post('/brokers', { name, initialFunds }),
  delete: (id: string) => api.delete(`/brokers/${id}`),
  buyStock: (id: string, symbol: string, quantity: number, price: number, date: string) =>
    api.post(`/brokers/${id}/buy`, { symbol, quantity, price, date }),
  sellStock: (id: string, symbol: string, quantity: number, price: number) =>
    api.post(`/brokers/${id}/sell`, { symbol, quantity, price }),
};

export const stocksApi = {
  getAll: (activeOnly = false) => 
    api.get('/stocks', { params: { active: activeOnly } }),
  getBySymbol: (symbol: string) => api.get(`/stocks/${symbol}`),
  getPrice: (symbol: string, date: string) => 
    api.get(`/stocks/${symbol}/price/${date}`),
  getPriceRange: (symbol: string, start: string, end: string) =>
    api.get(`/stocks/${symbol}/range`, { params: { start, end } }),
};

export const tradingApi = {
  getSettings: () => api.get('/trading/settings'),
  getCurrentPrices: () => api.get('/trading/prices'),
};


