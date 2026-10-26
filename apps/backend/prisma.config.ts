import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from root workspace and local directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined in .env');
}

// Prisma Migrate needs a session-capable connection. Neon pooled URLs use
// transaction pooling, so derive the direct endpoint when no explicit URL is
// configured. Runtime Prisma Client continues to use DATABASE_URL (pooled).
const migrationUrl =
  process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL.replace('-pooler.', '.');

export default defineConfig({
  schema: 'prisma/schema',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: migrationUrl,
  },
});
