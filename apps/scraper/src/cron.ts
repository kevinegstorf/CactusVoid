import cron from 'node-cron';
import { tickerDataTable } from './db/schema';
import { db } from './db/db';

async function fetchAndSaveTickerData() {
  const response = await fetch(
    'https://api.kraken.com/0/public/Ticker?pair=XXBTZUSD',
  );
  const rawData = await response.json();

  if (rawData.error.length) {
    console.error('Error fetching data:', rawData.error);
    return;
  }

  const ticker = rawData.result.XXBTZUSD;
  const dataToInsert = {
    id: `kraken-${Date.now()}`,
    pair: 'BTC/USD',
    timestamp: new Date(),
    close: Number(ticker.c[0]),
    open: Number(ticker.o),
    high: Number(ticker.h[0]),
    low: Number(ticker.l[0]),
    volume: Number(ticker.v[0]),
  };

  await db.insert(tickerDataTable).values(dataToInsert);
  console.log('Inserted data:', dataToInsert);
}

// Schedule the cron job to run every minute for testing
cron.schedule('* * * * *', async () => {
  console.log('Cron job triggered at', new Date().toISOString());
  try {
    await fetchAndSaveTickerData();
  } catch (error) {
    console.error('Error fetching or saving ticker data:', error);
  }
});

console.log('Cron job scheduled');
