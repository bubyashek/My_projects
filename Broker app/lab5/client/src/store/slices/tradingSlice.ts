import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TradingSettings } from '../../types';

interface TradingState extends TradingSettings {
  loading: boolean;
  error: string | null;
}

const initialState: TradingState = {
  startDate: '1/4/2021',
  speedInSeconds: 1,
  isRunning: false,
  currentDate: '1/4/2021',
  currentPrices: {},
  loading: false,
  error: null,
};

const API_URL = 'http://localhost:3000';

export const fetchTradingSettings = createAsyncThunk(
  'trading/fetchSettings',
  async () => {
    const response = await fetch(`${API_URL}/trading/settings`);
    return response.json();
  }
);

export const updateTradingSettings = createAsyncThunk(
  'trading/updateSettings',
  async (settings: Partial<TradingSettings>) => {
    const response = await fetch(`${API_URL}/trading/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    return response.json();
  }
);

export const startTrading = createAsyncThunk('trading/start', async () => {
  const response = await fetch(`${API_URL}/trading/start`, { method: 'POST' });
  return response.json();
});

export const stopTrading = createAsyncThunk('trading/stop', async () => {
  const response = await fetch(`${API_URL}/trading/stop`, { method: 'POST' });
  return response.json();
});

export const resetTrading = createAsyncThunk('trading/reset', async () => {
  const response = await fetch(`${API_URL}/trading/reset`, { method: 'POST' });
  return response.json();
});

const tradingSlice = createSlice({
  name: 'trading',
  initialState,
  reducers: {
    updatePrices: (
      state,
      action: PayloadAction<{ currentDate: string; currentPrices: { [key: string]: string } }>
    ) => {
      state.currentDate = action.payload.currentDate;
      state.currentPrices = action.payload.currentPrices;
    },
    setTradingState: (state, action: PayloadAction<TradingSettings>) => {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTradingSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTradingSettings.fulfilled, (state, action: PayloadAction<TradingSettings>) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(fetchTradingSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch trading settings';
      })
      .addCase(updateTradingSettings.fulfilled, (state, action: PayloadAction<TradingSettings>) => {
        Object.assign(state, action.payload);
      })
      .addCase(startTrading.fulfilled, (state, action: PayloadAction<TradingSettings>) => {
        Object.assign(state, action.payload);
      })
      .addCase(stopTrading.fulfilled, (state, action: PayloadAction<TradingSettings>) => {
        Object.assign(state, action.payload);
      })
      .addCase(resetTrading.fulfilled, (state, action: PayloadAction<TradingSettings>) => {
        Object.assign(state, action.payload);
      });
  },
});

export const { updatePrices, setTradingState } = tradingSlice.actions;
export default tradingSlice.reducer;

