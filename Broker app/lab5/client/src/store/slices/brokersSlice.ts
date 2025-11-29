import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Broker } from '../../types';

interface BrokersState {
  brokers: Broker[];
  loading: boolean;
  error: string | null;
}

const initialState: BrokersState = {
  brokers: [],
  loading: false,
  error: null,
};

const API_URL = 'http://localhost:3000';

export const fetchBrokers = createAsyncThunk('brokers/fetchBrokers', async () => {
  const response = await fetch(`${API_URL}/brokers`);
  return response.json();
});

export const createBroker = createAsyncThunk(
  'brokers/createBroker',
  async (broker: { name: string; initialFunds: number }) => {
    const response = await fetch(`${API_URL}/brokers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(broker),
    });
    return response.json();
  }
);

export const updateBroker = createAsyncThunk(
  'brokers/updateBroker',
  async ({ id, updates }: { id: string; updates: Partial<Broker> }) => {
    const response = await fetch(`${API_URL}/brokers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return response.json();
  }
);

export const deleteBroker = createAsyncThunk('brokers/deleteBroker', async (id: string) => {
  await fetch(`${API_URL}/brokers/${id}`, { method: 'DELETE' });
  return id;
});

const brokersSlice = createSlice({
  name: 'brokers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrokers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBrokers.fulfilled, (state, action: PayloadAction<Broker[]>) => {
        state.loading = false;
        state.brokers = action.payload;
      })
      .addCase(fetchBrokers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch brokers';
      })
      .addCase(createBroker.fulfilled, (state, action: PayloadAction<Broker>) => {
        state.brokers.push(action.payload);
      })
      .addCase(updateBroker.fulfilled, (state, action: PayloadAction<Broker>) => {
        const index = state.brokers.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.brokers[index] = action.payload;
        }
      })
      .addCase(deleteBroker.fulfilled, (state, action: PayloadAction<string>) => {
        state.brokers = state.brokers.filter((b) => b.id !== action.payload);
      });
  },
});

export default brokersSlice.reducer;

