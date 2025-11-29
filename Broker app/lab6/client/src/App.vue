<template>
  <v-app style="background: #f5f7fa;">
    <v-app-bar 
      color="white" 
      elevation="0" 
      height="64"
      style="border-bottom: 2px solid #e2e8f0;"
    >
      <v-container class="d-flex align-center" style="max-width: 1200px;">
        <v-icon size="24" color="primary" class="mr-2">mdi-finance</v-icon>
        <span class="text-h6 font-weight-bold" style="color: #2d3748;">Покупка и Продажа Акций</span>
        
        <v-spacer></v-spacer>
        
        <v-btn 
          to="/" 
          :variant="$route.path === '/' ? 'flat' : 'text'"
          :color="$route.path === '/' ? 'primary' : ''"
          class="mr-2"
        >
          Вход
        </v-btn>
       
      </v-container>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-snackbar
      v-model="showError"
      color="error"
      timeout="5000"
      location="top"
    >
      {{ store.error }}
      <template v-slot:actions>
        <v-btn variant="text" @click="showError = false">
          Закрыть
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useAppStore } from '@/store';

const store = useAppStore();
const showError = ref(false);

watch(() => store.error, (newError) => {
  if (newError) {
    showError.value = true;
  }
});

onMounted(() => {
  store.setupWebSocket();
});

onUnmounted(() => {
  store.disconnectWebSocket();
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #f5f7fa;
  color: #2d3748;
  line-height: 1.6;
}

/* Card styling matching lab5 */
.v-card {
  border-radius: 20px !important;
  border: 2px solid #e2e8f0 !important;
  transition: border-color 0.2s ease !important;
}

/* Button styling matching lab5 */
.v-btn {
  border-radius: 16px !important;
  text-transform: uppercase !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
  font-size: 14px !important;
}

/* Table styling matching lab5 */
.v-table {
  border-radius: 0 !important;
}

.v-table thead th {
  background: #f7fafc !important;
  font-weight: 700 !important;
  color: #4a5568 !important;
  text-transform: uppercase !important;
  font-size: 12px !important;
  letter-spacing: 0.5px !important;
  padding: 16px !important;
}

.v-table tbody td {
  padding: 16px !important;
  border-bottom: 1px solid #e2e8f0 !important;
}

.v-table tbody tr {
  transition: background 0.15s ease;
}

.v-table tbody tr:hover {
  background: #f7fafc !important;
}

/* Text field styling */
.v-text-field {
  font-size: 14px !important;
}
</style>
