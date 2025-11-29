<template>
  <div>
    <div v-if="loading" class="text-center pa-8">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p class="mt-4">Загрузка данных...</p>
    </div>
    
    <div v-else-if="error" class="text-center pa-8 text-error">
      <v-icon size="48" color="error">mdi-alert-circle</v-icon>
      <p class="mt-4">{{ error }}</p>
    </div>

    <div v-else>
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { stocksApi } from '@/api';
import { useAppStore } from '@/store';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const props = defineProps<{
  symbol: string;
}>();

const store = useAppStore();
const loading = ref(false);
const error = ref<string | null>(null);
const priceData = ref<{ date: string; price: number }[]>([]);

const chartData = computed(() => {
  return {
    labels: priceData.value.map(d => d.date),
    datasets: [
      {
        label: `${props.symbol} Price`,
        data: priceData.value.map(d => d.price),
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 5,
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 2,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: '#f7fafc',
      },
    },
    title: {
      display: true,
      text: `График изменения цены ${props.symbol}`,
      color: '#f7fafc',
      font: {
        size: 16,
      },
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
      callbacks: {
        label: function(context: any) {
          return `Цена: $${context.parsed.y.toFixed(2)}`;
        }
      }
    },
  },
  scales: {
    x: {
      ticks: {
        color: '#a0aec0',
        maxTicksLimit: 15,
      },
      grid: {
        color: 'rgba(160, 174, 192, 0.1)',
      },
    },
    y: {
      ticks: {
        color: '#a0aec0',
        callback: function(value: any) {
          return '$' + value.toFixed(2);
        }
      },
      grid: {
        color: 'rgba(160, 174, 192, 0.1)',
      },
    },
  },
  interaction: {
    mode: 'nearest' as const,
    axis: 'x' as const,
    intersect: false,
  },
};

onMounted(async () => {
  await loadChartData();
});

async function loadChartData() {
  try {
    loading.value = true;
    error.value = null;

    const startDate = store.tradingSettings.startDate;
    const endDate = store.tradingSettings.currentDate;

    if (!startDate || !endDate) {
      error.value = 'Даты не установлены';
      return;
    }

    const response = await stocksApi.getPriceRange(props.symbol, startDate, endDate);
    priceData.value = response.data;

    if (priceData.value.length === 0) {
      error.value = 'Нет данных для отображения';
    }
  } catch (e: any) {
    error.value = e.message || 'Ошибка загрузки данных';
    console.error('Error loading chart data:', e);
  } finally {
    loading.value = false;
  }
}
</script>


