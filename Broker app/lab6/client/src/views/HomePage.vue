<template>
  <v-container class="pa-6" style="max-width: 1200px;">
    <v-card elevation="1">
      <v-card-text class="pa-8">
        <!-- Hero Section -->
        <div class="text-center mb-8">
          <h1 class="text-h3 font-weight-bold mb-4" style="color: #2d3748;">
            Покупка и Продажа Акций
          </h1>
          <p class="text-body-1 text-medium-emphasis mx-auto" style="max-width: 700px;">
            Торговая платформа для брокеров. Покупайте и продавайте акции в реальном времени.
          </p>
        </div>

        <!-- Existing Brokers -->
        <v-card
          v-if="store.allBrokers.length > 0"
          class="mb-6"
          elevation="0"
          style="border: 2px solid #e2e8f0;"
        >
          <v-card-title class="pa-4" style="background: #f7fafc;">
            <span class="text-h6 font-weight-bold">Существующие брокеры</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-list>
            <v-list-item
              v-for="broker in store.allBrokers"
              :key="broker.id"
              @click="selectBroker(broker.id)"
              class="broker-item"
            >
              <template v-slot:prepend>
                <v-avatar color="primary" size="40">
                  <v-icon size="24">mdi-account</v-icon>
                </v-avatar>
              </template>

              <v-list-item-title class="font-weight-bold">
                {{ broker.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                Баланс: ${{ broker.currentFunds.toFixed(2) }}
              </v-list-item-subtitle>

              <template v-slot:append>
                <v-icon>mdi-chevron-right</v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-card>

        <v-alert v-else type="info" variant="tonal" class="mb-6">
          Брокеры не найдены. Создайте нового брокера, чтобы начать.
        </v-alert>

        <!-- Create New Broker -->
        <v-card elevation="0" style="border: 2px solid #e2e8f0;">
          <v-card-title class="pa-4" style="background: #f7fafc;">
            <span class="text-h6 font-weight-bold">Создать нового брокера</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-6">
            <v-form @submit.prevent="handleCreateBroker">
              <v-text-field
                v-model="newBrokerName"
                label="Имя брокера"
                :rules="[(v: string) => !!v || 'Имя обязательно']"
                variant="outlined"
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model.number="initialFunds"
                label="Начальный капитал"
                type="number"
                :rules="[(v: number) => !!v || 'Капитал обязателен', (v: number) => v > 0 || 'Должен быть больше 0']"
                variant="outlined"
                class="mb-4"
              ></v-text-field>
              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="store.loading"
                :disabled="!canCreate"
              >
                Создать брокера
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/store';

const store = useAppStore();
const router = useRouter();

const newBrokerName = ref('');
const initialFunds = ref(10000);

const canCreate = computed(() => newBrokerName.value.trim() !== '' && initialFunds.value > 0);

onMounted(async () => {
  await store.loadBrokers();
  await store.loadStocks();
  await store.loadTradingSettings();
});

async function selectBroker(id: string) {
  await store.selectBroker(id);
  router.push(`/broker/${id}`);
}

async function handleCreateBroker() {
  if (!canCreate.value) return;
  
  try {
    const broker = await store.createBroker(newBrokerName.value, initialFunds.value);
    newBrokerName.value = '';
    initialFunds.value = 10000;
    await store.selectBroker(broker.id);
    router.push(`/broker/${broker.id}`);
  } catch (e) {
    console.error('Failed to create broker:', e);
  }
}
</script>

<style scoped>
.broker-item {
  cursor: pointer;
  border-bottom: 1px solid #e2e8f0;
}

.broker-item:hover {
  background: #f7fafc !important;
}

.broker-item:last-child {
  border-bottom: none;
}
</style>
