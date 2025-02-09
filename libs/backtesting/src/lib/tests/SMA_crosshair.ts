import { SMA } from 'technicalindicators';
import { getHistoricalData } from '../data';

export async function runSMACrosshairBacktest(
  pair: string,
  shortPeriod = 5,
  longPeriod = 20,
  strategyName = 'SMA_Crosshair',
) {
  console.log(`Running Backtest: ${strategyName} for ${pair}`);
  console.log(`Short MA Period: ${shortPeriod}, Long MA Period: ${longPeriod}`);

  // Fetch historical data
  const data = await getHistoricalData(pair);
  console.log(`Fetched ${data.length} data points`);

  if (data.length < longPeriod) {
    console.warn(
      `Not enough data: ${data.length} available, but need at least ${longPeriod}`,
    );
    return { strategyName, trades: [], profit: 0, balance: 0 };
  }

  // Extract close prices
  const closePrices = data.map((entry, index) => {
    console.log(`Data ${index}:`, entry);
    return Number(entry.data?.close?.[0] ?? 0); // Default to 0 if missing
  });

  console.log('Sample Close Prices:', closePrices.slice(0, 10));

  // Calculate moving averages
  const shortMA = SMA.calculate({ period: shortPeriod, values: closePrices });
  const longMA = SMA.calculate({ period: longPeriod, values: closePrices });

  console.log('Short MA:', shortMA.slice(0, 10));
  console.log('Long MA:', longMA.slice(0, 10));

  let position: 'long' | null = null;
  let profit = 0;
  let balance = 10000; // Starting balance
  const trades: { type: string; price: number; timestamp: string }[] = [];

  for (let i = longPeriod; i < closePrices.length; i++) {
    console.log(
      `Index: ${i}, Close: ${closePrices[i]}, ShortMA: ${shortMA[i]}, LongMA: ${longMA[i]}`,
    );

    if (shortMA[i] > longMA[i] && position !== 'long') {
      console.log(`BUY at ${closePrices[i]}`);
      position = 'long';
      trades.push({
        type: 'BUY',
        price: closePrices[i],
        timestamp: data[i].timestamp?.toISOString() ?? 'N/A',
      });
    } else if (shortMA[i] < longMA[i] && position === 'long') {
      console.log(`SELL at ${closePrices[i]}`);
      position = null;
      trades.push({
        type: 'SELL',
        price: closePrices[i],
        timestamp: data[i].timestamp?.toISOString() ?? 'N/A',
      });

      // Calculate profit and update balance
      const buyPrice = trades[trades.length - 2]?.price ?? 0;
      profit += closePrices[i] - buyPrice;
      balance += closePrices[i] - buyPrice;
    }
  }

  console.log(`Final Profit: ${profit}, Final Balance: ${balance}`);
  return { strategyName, trades, profit, balance };
}
