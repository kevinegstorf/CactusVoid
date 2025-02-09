import { eq } from 'drizzle-orm';
import { tickerDataTable } from './db/schema';
import { db } from './db/db';

// Function to fetch historical data and map it to a usable format
export async function getHistoricalData(pair: string, limit = 100) {
  const rawData = await db
    .select()
    .from(tickerDataTable)
    .where(eq(tickerDataTable.pair, pair))
    .orderBy(tickerDataTable.timestamp)
    .limit(limit);

  return rawData.map((row) => ({
    id: row.id,
    timestamp: row.timestamp,
    data: {
      close: row.close,
      open: row.open,
      high: row.high,
      low: row.low,
      volume: row.volume,
    },
  }));
}
