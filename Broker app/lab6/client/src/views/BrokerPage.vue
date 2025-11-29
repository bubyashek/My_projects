v-if<template>
  <v-container class="pa-6" style="max-width: 1200px;">
    <v-card v-if="store.currentBroker" elevation="1" class="mb-6">
      <v-card-text class="pa-6">
        <!-- Header with Broker Name and Date -->
        <div class="d-flex justify-space-between align-items-center mb-6">
          <div>
            <h1 class="text-h4 font-weight-bold" style="color: #2d3748;">
              {{ store.currentBroker.name }}
            </h1>
          </div>
          <div class="text-right">
            <div class="text-caption text-medium-emphasis">Текущая дата</div>
            <div class="text-h6 font-weight-medium">{{ store.currentDate }}</div>
          </div>
        </div>

        <!-- Balance Cards -->
        <v-row class="mb-6">
          <v-col cols="12" md="4">
            <v-card elevation="0" style="border: 2px solid #e2e8f0; background: #ffffff;">
              <v-card-text class="pa-4">
                <div class="text-subtitle-2 text-medium-emphasis mb-2">Доступные средства</div>
                <div class="text-h5 font-weight-bold" style="color: #5a67d8;">
                  ${{ store.currentBroker.currentFunds.toFixed(2) }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card elevation="0" style="border: 2px solid #e2e8f0; background: #ffffff;">
              <v-card-text class="pa-4">
                <div class="text-subtitle-2 text-medium-emphasis mb-2">Общий баланс</div>
                <div class="text-h5 font-weight-bold" style="color: #48bb78;">
                  ${{ store.totalBalance.toFixed(2) }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card elevation="0" style="border: 2px solid #e2e8f0; background: #ffffff;">
              <v-card-text class="pa-4">
                <div class="text-subtitle-2 text-medium-emphasis mb-2">Прибыль/Убыток</div>
                <div 
                  class="text-h5 font-weight-bold"
                  :style="{ color: store.totalProfitLoss >= 0 ? '#48bb78' : '#e53e3e' }"
                >
                  {{ store.totalProfitLoss >= 0 ? '+' : '' }}${{ store.totalProfitLoss.toFixed(2) }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Current Stock Prices -->
        <div class="mb-6">
          <h2 class="text-h6 font-weight-bold mb-4" style="color: #2d3748;">
            Текущие котировки акций
          </h2>
          <v-row>
            <v-col
              v-for="(price, symbol) in store.currentPrices"
              :key="String(symbol)"
              cols="6"
              sm="4"
              md="3"
            >
              <v-card elevation="0" style="border: 2px solid #e2e8f0;" class="stock-card">
                <v-card-text class="pa-4 text-center">
                  <div class="text-subtitle-1 font-weight-bold mb-2" style="color: #5a67d8;">
                    {{ String(symbol) }}
                  </div>
                  <div class="text-h6 font-weight-bold mb-3">{{ price }}</div>
                  <v-btn
                    color="primary"
                    size="small"
                    block
                    class="mb-2"
                    @click="openTradeDialog(String(symbol))"
                  >
                    Торговать
                  </v-btn>
                  <v-btn
                    variant="outlined"
                    color="primary"
                    size="small"
                    block
                    @click="openChartDialog(String(symbol))"
                  >
                    График
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Portfolio -->
        <div v-if="store.portfolioWithPrices.length > 0">
          <h2 class="text-h6 font-weight-bold mb-4" style="color: #2d3748;">
            Портфель акций
          </h2>
          <div style="overflow-x: auto;">
            <v-table>
              <thead>
                <tr>
                  <th>Акция</th>
                  <th>Количество</th>
                  <th>Цена покупки</th>
                  <th>Дата покупки</th>
                  <th>Текущая цена</th>
                  <th>Общая стоимость</th>
                  <th>Прибыль/Убыток</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in store.portfolioWithPrices" :key="item.symbol">
                  <td class="font-weight-bold">{{ item.symbol }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>${{ item.purchasePrice.toFixed(2) }}</td>
                  <td>{{ item.purchaseDate }}</td>
                  <td class="font-weight-bold">${{ item.currentPrice.toFixed(2) }}</td>
                  <td class="font-weight-bold">${{ item.totalValue.toFixed(2) }}</td>
                  <td 
                    class="font-weight-bold"
                    :style="{ color: item.profitLoss >= 0 ? '#48bb78' : '#e53e3e' }"
                  >
                    {{ item.profitLoss >= 0 ? '+' : '' }}${{ item.profitLoss.toFixed(2) }}
                  </td>
                  <td 
                    class="font-weight-bold"
                    :style="{ color: item.profitLossPercent >= 0 ? '#48bb78' : '#e53e3e' }"
                  >
                    {{ item.profitLossPercent >= 0 ? '+' : '' }}{{ item.profitLossPercent.toFixed(2) }}%
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </div>
        <v-alert v-else type="info" variant="tonal" class="mt-4">
          Портфель пуст. Начните покупать акции!
        </v-alert>
      </v-card-text>
    </v-card>

    <!-- Trade Dialog -->
    <v-dialog v-model="showTradeDialog" max-width="500">
      <v-card v-if="selectedStock">
        <v-card-title class="pa-6" style="background: rgba(90, 103, 216, 0.08);">
          <span class="text-h6 font-weight-bold">Торговля {{ selectedStock }}</span>
        </v-card-title>
        <v-card-text class="pa-6">
          <div class="text-center mb-4">
            <div class="text-caption text-medium-emphasis">Текущая цена</div>
            <div class="text-h4 font-weight-bold text-primary">
              {{ store.currentPrices[selectedStock] }}
            </div>
          </div>

          <v-text-field
            v-model.number="tradeQuantity"
            label="Количество акций"
            type="number"
            variant="outlined"
            min="1"
            :rules="[(v: number) => v > 0 || 'Должно быть больше 0']"
            class="mb-4"
          ></v-text-field>

          <v-card elevation="0" class="pa-4 mb-4" style="background: #f5f7fa; border: 2px solid #e2e8f0;">
            <div class="d-flex justify-space-between align-center">
              <span class="text-subtitle-2">Общая стоимость:</span>
              <span class="text-h6 font-weight-bold">${{ calculateTotalCost() }}</span>
            </div>
          </v-card>

          <v-row>
            <v-col cols="6">
              <v-btn
                color="success"
                block
                :loading="store.loading"
                :disabled="tradeQuantity <= 0"
                @click="handleBuy"
              >
                Купить
              </v-btn>

            </v-col>
            <v-col cols="6">
              <v-btn
                color="error"
                block
                :loading="store.loading"
                :disabled="tradeQuantity <= 0 || !canSell"
                @click="handleSell"
              >
                Продать
              </v-btn>
            </v-col>
          </v-row>

          <div v-if="!canSell && tradeQuantity > 0" class="text-error text-center mt-3">
            Недостаточно акций для продажи
          </div>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showTradeDialog = false">Закрыть</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Chart Dialog -->
    <v-dialog v-model="showChartDialog" max-width="900">
      <v-card v-if="selectedStock">
        <v-card-title class="pa-6" style="background: rgba(90, 103, 216, 0.08);">
          <span class="text-h6 font-weight-bold">График цен {{ selectedStock }}</span>
        </v-card-title>
        <v-card-text class="pa-6">
          <StockChart :symbol="selectedStock" />
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showChartDialog = false">Закрыть</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAppStore } from '@/store';
import StockChart from '@/components/StockChart.vue';

const router = useRouter();
const route = useRoute();
const store = useAppStore();

const showTradeDialog = ref(false);
const showChartDialog = ref(false);
const selectedStock = ref<string | null>(null);
const tradeQuantity = ref(1);
const errorMessage = ref('');

const canSell = computed(() => {
  if (!selectedStock.value || !store.currentBroker) return false;
  const portfolio = store.currentBroker.portfolio[selectedStock.value];
  if (!portfolio) return false;
  const quantity = typeof portfolio === 'number' ? portfolio : portfolio.quantity;
  return quantity >= tradeQuantity.value;
});

onMounted(async () => {
  // Load broker from route parameter if not already loaded
  const brokerId = route.params.id as string;
  if (!store.currentBroker || store.currentBroker.id !== brokerId) {
    await store.selectBroker(brokerId);
  }
  
  if (!store.currentBroker) {
    router.push('/');
    return;
  }
  
  await store.loadStocks();
  await store.loadTradingSettings();
  store.setupWebSocket();
});

function openTradeDialog(symbol: string) {
  selectedStock.value = symbol;
  tradeQuantity.value = 1;
  showTradeDialog.value = true;
}

function openChartDialog(symbol: string) {
  selectedStock.value = symbol;
  showChartDialog.value = true;
}

function calculateTotalCost() {
  if (!selectedStock.value) return '0.00';
  const priceStr = store.currentPrices[selectedStock.value];
  if (!priceStr) return '0.00';
  const price = parseFloat(priceStr.replace('$', ''));
  return (price * tradeQuantity.value).toFixed(2);
}

async function handleBuy() {
  if (!selectedStock.value) return;
  try {
    await store.buyStock(selectedStock.value, tradeQuantity.value);
    showTradeDialog.value = false;
  } catch (e) {
    console.error('Buy failed:', e);
    if(e.response?.status === 500){
      errorMessage.value = 'Недостаточно средств';
    };
  }
}

async function handleSell() {
  if (!selectedStock.value) return;
  try {
    await store.sellStock(selectedStock.value, tradeQuantity.value);
    showTradeDialog.value = false;
  } catch (e) {
    console.error('Sell failed:', e);
  }
}
</script>

<style scoped>
.stock-card {
  transition: border-color 0.2s ease;
}

.stock-card:hover {
  border-color: #5a67d8 !important;
}
</style>
