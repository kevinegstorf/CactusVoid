import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_5VC2rwKhvbGo@ep-little-butterfly-a9x0iay9-pooler.gwc.azure.neon.tech/neondb?sslmode=require',
  },
});