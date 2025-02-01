import express from 'express';
import { KrakenService } from './services/krakenService';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

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
    return {...tickerData}; // Return the ticker data
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error testing Kraken API:', error.message);
    } else {
      console.error('Error testing Kraken API:', error);
    }
    throw error; // Re-throw the error to handle it in the route handler
  }
};

// Make the route handler async
app.get('/ticker', async (req, res) => {
  try {
    const tickerData = await testKrakenAPI(); // Await the result
    res.send({ message: 'Hello Kraken api test', tickerData }); // Send the response
  } catch (error) {
    res.status(500).send({ message: 'Failed to fetch Kraken API data', error: error.message });
  }
});

app.get('/balance', (req, res) => {
  KrakenService.privateRequest('/private/Balance')
    .then((balanceData) => {
      res.send({ message: 'Hello Kraken api test', balanceData });
    })
    .catch((error) => {
      res.status(500).send({ message: 'Failed to fetch Kraken API data', error: error.message });
    });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});