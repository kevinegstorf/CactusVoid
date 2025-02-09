import { SMA } from 'technicalindicators';
import { getHistoricalData } from '../data';

// Define strategy parameters
const STRATEGY_PARAMS = {
  SHORT_PERIOD: 5,
  LONG_PERIOD: 20,
};

// Types for better clarity
type Trade = {
  type: 'BUY' | 'SELL';
  price: number;
};

type BacktestResult = {
  trades: Trade[];
  profit: number;
};

export async function runBacktest(pair: string): Promise<BacktestResult> {
  // Fetch historical data
  const data = await getHistoricalData(pair);

  // Extract close prices and validate structure
  const closePrices = extractClosePrices(data);

  // Calculate moving averages
  const shortMA = calculateSMA(closePrices, STRATEGY_PARAMS.SHORT_PERIOD);
  const longMA = calculateSMA(closePrices, STRATEGY_PARAMS.LONG_PERIOD);

  // Execute the strategy
  return executeStrategy(closePrices, shortMA, longMA);
}

// Helper to extract close prices from the historical data
function extractClosePrices(data: any[]): number[] {
  return data.map((entry) => {
    // Ensure `entry.data` exists and contains the expected structure
    const ticker = entry.data;
    if (!ticker || !ticker.close) {
      throw new Error('Invalid data structure: Missing close price.');
    }

    // Convert the close price to a number
    return Number(ticker.close);
  });
}

// Helper to calculate SMA
function calculateSMA(prices: number[], period: number): number[] {
  return SMA.calculate({ period, values: prices });
}

// Core strategy execution
function executeStrategy(
  closePrices: number[],
  shortMA: number[],
  longMA: number[],
): BacktestResult {
  let position: 'long' | null = null;
  let profit = 0;
  const trades: Trade[] = [];

  for (let i = STRATEGY_PARAMS.LONG_PERIOD; i < closePrices.length; i++) {
    const shortValue = shortMA[i];
    const longValue = longMA[i];
    const currentPrice = closePrices[i];

    if (shortValue > longValue && position !== 'long') {
      // Enter a long position
      position = 'long';
      trades.push({ type: 'BUY', price: currentPrice });
    } else if (shortValue < longValue && position === 'long') {
      // Exit the long position
      position = null;
      trades.push({ type: 'SELL', price: currentPrice });

      // Calculate profit
      const buyTrade = trades[trades.length - 2]; // Previous trade must be the buy
      if (buyTrade?.type === 'BUY') {
        profit += currentPrice - buyTrade.price;
      }
    }
  }

  return { trades, profit };
}
