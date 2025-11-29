import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Stock } from '../../types';

interface StocksState {
  stocks: Stock[];
  loading: boolean;
  error: string | null;
}

const initialState: StocksState = {
  stocks: [],
  loading: false,
  error: null,
};

const API_URL = 'http://localhost:3000';

export const fetchStocks = createAsyncThunk('stocks/fetchStocks', async () => {
  const response = await fetch(`${API_URL}/stocks`);
  return response.json();
});

export const toggleStockActive = createAsyncThunk(
  'stocks/toggleStockActive',
  async (symbol: string) => {
    const response = await fetch(`${API_URL}/stocks/${symbol}/toggle`, {
      method: 'POST',
    });
    return response.json();
  }
);

const stocksSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStocks.fulfilled, (state, action: PayloadAction<Stock[]>) => {
        state.loading = false;
        state.stocks = action.payload;
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch stocks';
      })
      .addCase(toggleStockActive.fulfilled, (state, action: PayloadAction<Stock>) => {
        const index = state.stocks.findIndex((s) => s.symbol === action.payload.symbol);
        if (index !== -1) {
          state.stocks[index] = action.payload;
        }
      });
  },
});

export default stocksSlice.reducer;

