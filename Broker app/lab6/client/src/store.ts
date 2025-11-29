import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Broker, Stock, TradingSettings } from '@/types';
import { brokersApi, stocksApi, tradingApi } from '@/api';
import { socketService } from '@/socket';

export const useAppStore = defineStore('app', () => {
  // State
  const currentBroker = ref<Broker | null>(null);
  const allBrokers = ref<Broker[]>([]);
  const stocks = ref<Stock[]>([]);
  const tradingSettings = ref<TradingSettings>({
    startDate: '',
    speedInSeconds: 1,
    isRunning: false,
    currentDate: '',
    currentPrices: {},
  });
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const currentPrices = computed(() => tradingSettings.value.currentPrices);
  const currentDate = computed(() => tradingSettings.value.currentDate);
  const isRunning = computed(() => tradingSettings.value.isRunning);
  const isTrading = computed(() => tradingSettings.value.isRunning);
  
  const portfolioWithPrices = computed(() => {
    if (!currentBroker.value) return [];
    
    return Object.entries(currentBroker.value.portfolio).map(([symbol, data]) => {
      const currentPriceStr = currentPrices.value[symbol] || '$0';
      const currentPrice = parseFloat(currentPriceStr.replace('$', ''));
      const totalValue = currentPrice * data.quantity;
      const totalCost = data.purchasePrice * data.quantity;
      const profitLoss = totalValue - totalCost;
      const profitLossPercent = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

      return {
        symbol,
        quantity: data.quantity,
        purchasePrice: data.purchasePrice,
        purchaseDate: data.purchaseDate,
        currentPrice,
        totalValue,
        profitLoss,
        profitLossPercent,
      };
    });
  });

  const totalBalance = computed(() => {
    if (!currentBroker.value) return 0;
    
    const cash = currentBroker.value.currentFunds;
    const stocksValue = portfolioWithPrices.value.reduce(
      (sum, item) => sum + item.totalValue,
      0
    );
    
    return cash + stocksValue;
  });

  const totalProfitLoss = computed(() => {
    if (!currentBroker.value) return 0;
    return totalBalance.value - currentBroker.value.initialFunds;
  });

  // Actions
  async function loadBrokers() {
    try {
      loading.value = true;
      const response = await brokersApi.getAll();
      allBrokers.value = response.data;
    } catch (e: any) {
      error.value = e.message;
      console.error('Error loading brokers:', e);
    } finally {
      loading.value = false;
    }
  }

  async function loadStocks() {
    try {
      loading.value = true;
      const response = await stocksApi.getAll(true);
      stocks.value = response.data;
    } catch (e: any) {
      error.value = e.message;
      console.error('Error loading stocks:', e);
    } finally {
      loading.value = false;
    }
  }

  async function loadTradingSettings() {
    try {
      const response = await tradingApi.getSettings();
      tradingSettings.value = response.data;
    } catch (e: any) {
      error.value = e.message;
      console.error('Error loading trading settings:', e);
    }
  }

  async function createBroker(name: string, initialFunds = 10000) {
    try {
      loading.value = true;
      const response = await brokersApi.create(name, initialFunds);
      currentBroker.value = response.data;
      await loadBrokers();
      return response.data;
    } catch (e: any) {
      error.value = e.message;
      console.error('Error creating broker:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function selectBroker(brokerId: string) {
    try {
      loading.value = true;
      const response = await brokersApi.getById(brokerId);
      currentBroker.value = response.data;
    } catch (e: any) {
      error.value = e.message;
      console.error('Error selecting broker:', e);
    } finally {
      loading.value = false;
    }
  }

  async function refreshCurrentBroker() {
    if (currentBroker.value) {
      await selectBroker(currentBroker.value.id);
    }
  }

  async function buyStock(symbol: string, quantity: number) {
    if (!currentBroker.value) return;

    try {
      loading.value = true;
      const priceStr = currentPrices.value[symbol];
      if (!priceStr) throw new Error('Price not available');
      
      const price = parseFloat(priceStr.replace('$', ''));
      const date = currentDate.value;

      const response = await brokersApi.buyStock(
        currentBroker.value.id,
        symbol,
        quantity,
        price,
        date
      );
      
      currentBroker.value = response.data;
      await loadBrokers();
    } catch (e: any) {
      error.value = e.response?.data?.message || e.message;
      console.error('Error buying stock:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function sellStock(symbol: string, quantity: number) {
    if (!currentBroker.value) return;

    try {
      loading.value = true;
      const priceStr = currentPrices.value[symbol];
      if (!priceStr) throw new Error('Price not available');
      
      const price = parseFloat(priceStr.replace('$', ''));

      const response = await brokersApi.sellStock(
        currentBroker.value.id,
        symbol,
        quantity,
        price
      );
      
      currentBroker.value = response.data;
      await loadBrokers();
    } catch (e: any) {
      error.value = e.response?.data?.message || e.message;
      console.error('Error selling stock:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  function setupWebSocket() {
    socketService.connect();

    socketService.onTradingUpdate((data: TradingSettings) => {
      tradingSettings.value = data;
      refreshCurrentBroker();
    });

    socketService.onPriceUpdate((prices: any) => {
      if (tradingSettings.value) {
        tradingSettings.value.currentPrices = prices;
      }
    });
  }

  function disconnectWebSocket() {
    socketService.disconnect();
  }

  return {
    // State
    currentBroker,
    allBrokers,
    stocks,
    tradingSettings,
    loading,
    error,
    // Getters
    currentPrices,
    currentDate,
    isRunning,
    isTrading,
    portfolioWithPrices,
    totalBalance,
    totalProfitLoss,
    // Actions
    loadBrokers,
    loadStocks,
    loadTradingSettings,
    createBroker,
    selectBroker,
    refreshCurrentBroker,
    buyStock,
    sellStock,
    setupWebSocket,
    disconnectWebSocket,
  };
});

