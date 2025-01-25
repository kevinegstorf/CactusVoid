import 'dotenv/config';

import { KrakenService } from './services/krakenService';

const testKrakenAPI = async () => {
  try {
    // Test public endpoint
    console.log('Fetching asset prices...');
    const tickerData = await KrakenService.publicRequest('/public/Ticker', {
      pair: 'BTCUSD', // Example: Bitcoin to USD
    });
    console.log('Ticker Data:', tickerData);

    // Test private endpoint
    console.log('Fetching account balance...');
    const balanceData = await KrakenService.privateRequest('/private/Balance');
    console.log('Account Balance:', balanceData);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error testing Kraken API:', error.message);
    } else {
      console.error('Error testing Kraken API:', error);
    }
  }
};

testKrakenAPI();
