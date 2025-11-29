<template>
  <v-container class="fill-height" style="min-height: 100vh;">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="5">

        <!-- Header -->
        <div class="text-center mb-8">
          <v-avatar size="80" color="primary" class="mb-4">
            <v-icon size="50" color="white">mdi-chart-line</v-icon>
          </v-avatar>
          <h1 class="text-h3 font-weight-bold mb-2" style="color: #2d3748;">
            Торговая Платформа
          </h1>
          <p class="text-body-1 text-medium-emphasis">
            Вход в систему покупки и продажи акций
          </p>
        </div>

        <!-- Login Card -->
        <v-card elevation="2">
          <v-card-title class="pa-6" style="background: rgba(90, 103, 216, 0.08);">
            <div class="d-flex align-center">
              <v-icon size="28" color="primary" class="mr-3">mdi-account-circle</v-icon>
              <span class="text-h5 font-weight-bold" style="color: #2d3748;">
                Вход в систему
              </span>
            </div>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-6">

            <!-- Combobox для имени брокера -->
            <v-combobox
              v-model="inputName"
              :items="brokerNames"
              label="Имя брокера"
              variant="outlined"
              clearable
              prepend-inner-icon="mdi-account"
              :loading="store.loading"
              no-data-text="Такого брокера нет — будет создан новый"
            ></v-combobox>

            <!-- Поле стартового капитала для нового брокера -->
            <v-text-field
              v-if="!existingBroker"
              v-model.number="startCapital"
              type="number"
              min="1"
              label="Начальный капитал"
              variant="outlined"
              prepend-inner-icon="mdi-currency-usd"
              class="mt-4"
            ></v-text-field>

            <!-- Кнопка входа / создания -->
            <v-btn
              block
              class="mt-6"
              size="large"
              color="primary"
              :loading="store.loading"
              @click="enterOrCreate"
            >
              {{ existingBroker ? 'Войти' : 'Создать и войти' }}
            </v-btn>

          </v-card-text>
        </v-card>

        <!-- Ссылка на панель администратора -->
        <div class="text-center mt-6">
          <v-btn
            variant="text"
            color="primary"
            prepend-icon="mdi-shield-account"
            to="/admin"
          >
            Панель администратора
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/store";

const router = useRouter();
const store = useAppStore();

const inputName = ref("");
const startCapital = ref(10000);

// Список имён для автоподсказок
const brokerNames = computed(() => store.allBrokers.map(b => b.name));

// Существующий брокер (если введённое имя совпадает)
const existingBroker = computed(() =>
  store.allBrokers.find(b => b.name === inputName.value.trim())
);

async function enterOrCreate() {
  const name = inputName.value.trim();
  if (!name) return;

  if (existingBroker.value) {
    // Вход в существующего брокера
    await store.selectBroker(existingBroker.value.id);
    router.push(`/broker/${existingBroker.value.id}`);
    return;
  }

  // Создание нового брокера
  if (!startCapital.value || startCapital.value <= 0) return;

  try {
    const newBroker = await store.createBroker(name, startCapital.value);
    router.push(`/broker/${newBroker.id}`);
  } catch (error) {
    console.error("Ошибка создания брокера:", error);
  }
}

onMounted(async () => {
  await store.loadBrokers();
});
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
  display: flex;
  align-items: center;
}
</style>
