import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const tickerDataTable = pgTable('ticker_data', {
  id: varchar('id').primaryKey(), // Unique ID for each entry
  timestamp: timestamp('timestamp').defaultNow(), // Timestamp of the data
  pair: varchar('pair'), // Currency pair
  close: varchar('close'), // Closing price
  open: varchar('open'), // Opening price
  high: varchar('high'), // Highest price
  low: varchar('low'), // Lowest price
  volume: varchar('volume'), // Volume
});
