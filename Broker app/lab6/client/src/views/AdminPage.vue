<template>
  <v-container class="pa-6" style="max-width: 1400px;">
  <div class="d-flex justify-space-between align-center mb-6">
    <h1 class="text-h4 font-weight-bold" style="color: #2d3748;">
      Панель администратора
    </h1>

    <v-btn
      variant="tonal"
      color="primary"
      prepend-icon="mdi-chart-line"
      to="/stocks"
      class="text-h6"
    >
      Управление торгами
    </v-btn>
  </div>
    <v-card v-for="broker in enrichedBrokers" :key="broker.id" class="mb-10" elevation="1">
      <v-card-title class="pa-6" style="background: rgba(90, 103, 216, 0.08);">
        <div class="d-flex justify-space-between align-center w-100">
          <span class="text-h5 font-weight-bold">{{ broker.name }}</span>
          <v-chip size="large" color="primary" variant="flat">
            Акций: {{ broker.totalShares }}
          </v-chip>
        </div>
      </v-card-title>

      <v-card-text class="pa-6">
        <v-row class="mb-6">
          <v-col cols="12" md="4">
            <v-card elevation="0" style="border: 2px solid #e2e8f0;">
              <v-card-text>
                <div class="text-medium-emphasis mb-1">Текущие средства</div>
                <div class="text-h5 font-weight-bold" style="color:#5a67d8;">
                  ${{ broker.currentFunds.toFixed(2) }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card elevation="0" style="border: 2px solid #e2e8f0;">
              <v-card-text>
                <div class="text-medium-emphasis mb-1">Общий баланс</div>
                <div class="text-h5 font-weight-bold" style="color:#48bb78;">
                  ${{ broker.totalBalance.toFixed(2) }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card elevation="0" style="border: 2px solid #e2e8f0;">
              <v-card-text>
                <div class="text-medium-emphasis mb-1">Общая прибыль/убыток</div>
                <div
                  class="text-h5 font-weight-bold"
                  :style="{ color: broker.totalProfitLoss >= 0 ? '#48bb78' : '#e53e3e' }"
                >
                  {{ broker.totalProfitLoss >= 0 ? '+' : '' }}${{ broker.totalProfitLoss.toFixed(2) }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Таблица акций брокера -->
        <div v-if="broker.stocks.length > 0">
          <v-table>
            <thead>
              <tr>
                <th>Акция</th>
                <th>Количество</th>
                <th>Цена покупки</th>
                <th>Текущая цена</th>
                <th>Стоимость</th>
                <th>Прибыль/Убыток</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="stock in broker.stocks" :key="stock.symbol">
                <td class="font-weight-bold">{{ stock.symbol }}</td>
                <td>{{ stock.quantity }}</td>
                <td>${{ stock.purchasePrice.toFixed(2) }}</td>
                <td>${{ stock.currentPrice.toFixed(2) }}</td>
                <td class="font-weight-bold">${{ stock.totalValue.toFixed(2) }}</td>

                <td
                  class="font-weight-bold"
                  :style="{ color: stock.profitLoss >= 0 ? '#48bb78' : '#e53e3e' }"
                >
                  {{ stock.profitLoss >= 0 ? '+' : '' }}${{ stock.profitLoss.toFixed(2) }}
                </td>

                <td
                  class="font-weight-bold"
                  :style="{ color: stock.profitLossPercent >= 0 ? '#48bb78' : '#e53e3e' }"
                >
                  {{ stock.profitLossPercent >= 0 ? '+' : '' }}{{ stock.profitLossPercent.toFixed(2) }}%
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>

        <v-alert v-else type="info" variant="tonal" class="mt-4">
          Портфель пуст.
        </v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useAppStore } from '@/store';

const store = useAppStore();

/** Загружаем брокеров и актуальные цены */
onMounted(async () => {
  await store.loadBrokers();
  await store.loadStocks();          // подгружает текущие цены
  store.setupWebSocket();            // как на странице брокера
});

/** Собираем данные для админки */
const enrichedBrokers = computed(() => {
  const prices = store.currentPrices;

  return store.allBrokers.map(broker => {
    let totalShares = 0;
    let stocks: any[] = [];
    let portfolioValue = 0;
    let totalProfitLoss = 0;

    for (const symbol in broker.portfolio) {
      const item = broker.portfolio[symbol];
      const quantity = typeof item === 'number' ? item : item.quantity;
      const purchasePrice = typeof item === 'number' ? 0 : item.purchasePrice;

      const currentPrice = parseFloat(
        (prices[symbol] || '0').toString().replace('$', '')
      );

      const totalValue = currentPrice * quantity;
      const profitLoss = (currentPrice - purchasePrice) * quantity;
      const profitLossPercent =
        purchasePrice > 0 ? ((currentPrice - purchasePrice) / purchasePrice) * 100 : 0;

      totalShares += quantity;
      portfolioValue += totalValue;
      totalProfitLoss += profitLoss;

      stocks.push({
        symbol,
        quantity,
        purchasePrice,
        currentPrice,
        totalValue,
        profitLoss,
        profitLossPercent
      });
    }

    const totalBalance = broker.currentFunds + portfolioValue;

    return {
      ...broker,
      totalShares,
      stocks,
      portfolioValue,
      totalBalance,
      totalProfitLoss
    };
  });
});
</script>

<style scoped>
</style>