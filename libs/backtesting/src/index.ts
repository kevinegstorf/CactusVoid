import { runBacktest } from './lib/tests/backtesting';
import { runSMACrosshairBacktest } from './lib/tests/SMA_crosshair';

runBacktest('BTC/USD').then((result) => {
  console.log('Backtest Results:', result);
});

// runSMACrosshairBacktest('BTC/USD', 5, 10, 'SMA_Crosshair_5_20').then(
//   (result) => {
//     console.log('Backtest Results:', result);
//   },
// );
