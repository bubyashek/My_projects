const fs = require('fs');
const path = require('path');

// Helper function to format date as DD.MM.YYYY
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// Helper function to check if date is a weekday (no weekends)
function isWeekday(date) {
  const day = date.getDay();
  return day !== 0 && day !== 6; // 0 = Sunday, 6 = Saturday
}

// Generate realistic price movement
function generatePrice(basePrice, volatility, trend, index, totalDays) {
  // Add long-term trend
  const trendFactor = 1 + (trend * index / totalDays);
  
  // Add random volatility
  const randomFactor = 1 + (Math.random() - 0.5) * volatility;
  
  // Add some cyclical pattern (simulates market cycles)
  const cycleFactor = 1 + Math.sin(index / 30) * 0.02;
  
  const price = basePrice * trendFactor * randomFactor * cycleFactor;
  return `$${price.toFixed(2)}`;
}

// Generate historical data for a stock
function generateStockData(symbol, config) {
  const data = [];
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2025-11-10'); // Current date
  
  let currentDate = new Date(startDate);
  let dayIndex = 0;
  
  while (currentDate <= endDate) {
    // Only add weekdays (trading days)
    if (isWeekday(currentDate)) {
      const price = generatePrice(
        config.basePrice,
        config.volatility,
        config.trend,
        dayIndex,
        500 // approximate trading days
      );
      
      data.push({
        date: formatDate(currentDate),
        open: price
      });
      
      dayIndex++;
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
}

const stockConfigs = {
  AAPL: {
    basePrice: 170,      
    volatility: 0.02,    
    trend: 0.25,         
  },
  SBUX: {
    basePrice: 92,
    volatility: 0.025,
    trend: 0.05,
  },
  MSFT: {
    basePrice: 370,
    volatility: 0.02,
    trend: 0.15,
  },
  CSCO: {
    basePrice: 49,
    volatility: 0.02,
    trend: 0.10,
  },
  QCOM: {
    basePrice: 140,
    volatility: 0.03,
    trend: 0.08,
  },
  AMZN: {
    basePrice: 150,
    volatility: 0.025,
    trend: 0.20,
  },
  TSLA: {
    basePrice: 180,
    volatility: 0.04,    
    trend: -0.05,        
  },
  AMD: {
    basePrice: 140,
    volatility: 0.035,
    trend: 0.12,
  },
};

// Generate data for all stocks
const stocks = [
  {
    symbol: 'AAPL',
    name: 'Apple, Inc.',
    isActive: true,
    historicalData: generateStockData('AAPL', stockConfigs.AAPL),
  },
  {
    symbol: 'SBUX',
    name: 'Starbucks, Inc.',
    isActive: false,
    historicalData: generateStockData('SBUX', stockConfigs.SBUX),
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft, Inc.',
    isActive: false,
    historicalData: generateStockData('MSFT', stockConfigs.MSFT),
  },
  {
    symbol: 'CSCO',
    name: 'Cisco Systems, Inc.',
    isActive: false,
    historicalData: generateStockData('CSCO', stockConfigs.CSCO),
  },
  {
    symbol: 'QCOM',
    name: 'QUALCOMM Inc.',
    isActive: false,
    historicalData: generateStockData('QCOM', stockConfigs.QCOM),
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    isActive: false,
    historicalData: generateStockData('AMZN', stockConfigs.AMZN),
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    isActive: false,
    historicalData: generateStockData('TSLA', stockConfigs.TSLA),
  },
  {
    symbol: 'AMD',
    name: 'Advanced Micro Devices, Inc.',
    isActive: false,
    historicalData: generateStockData('AMD', stockConfigs.AMD),
  },
];

const outputPath = path.join(__dirname, '../server/data/stocks.json');
const outputDir = path.dirname(outputPath);

// Create directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(stocks, null, 2));

console.log('Historical data generated successfully!');
console.log(`Total stocks: ${stocks.length}`);
stocks.forEach(stock => {
  console.log(`   ${stock.symbol}: ${stock.historicalData.length} trading days`);
});
console.log(`Data saved to: ${outputPath}`);
console.log('\nNote: This data is generated based on realistic patterns.');

