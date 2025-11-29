import { configureStore } from '@reduxjs/toolkit';
import brokersReducer from './slices/brokersSlice';
import stocksReducer from './slices/stocksSlice';
import tradingReducer from './slices/tradingSlice';

export const store = configureStore({
  reducer: {
    brokers: brokersReducer,
    stocks: stocksReducer,
    trading: tradingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

