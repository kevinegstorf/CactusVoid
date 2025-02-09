import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import { drizzle } from 'drizzle-orm/neon-http';
import { tickerDataTable } from './schema';
import dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL as string);

export const db = drizzle(sql, { schema });

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

// Run the scraper
fetchAndSaveTickerData();
