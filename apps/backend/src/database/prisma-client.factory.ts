// ==============================================================================
// PRISMA CLIENT FACTORY & CONNECTION MANAGER
// Quản lý tập trung khởi tạo kết nối PostgreSQL Driver Adapter (Prisma 7 + pg Pool)
// ==============================================================================

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

export interface PrismaConfigResult {
  pool: Pool;
  adapter: PrismaPg;
  prismaOptions: {
    adapter: PrismaPg;
    log: Array<{ emit: 'stdout' | 'event'; level: 'query' | 'info' | 'warn' | 'error' }>;
  };
}

/**
 * Tạo cấu hình chuẩn (Pool + Adapter + Logging) dùng chung cho toàn bộ dự án
 */
export function getPrismaClientConfig(
  connectionString: string,
  isDev: boolean = false,
): PrismaConfigResult {
  const pool = new Pool({
    connectionString,
    max: isDev ? 10 : 20, // Tối ưu connection pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  const adapter = new PrismaPg(pool);

  const prismaOptions = {
    adapter,
    log: isDev
      ? [
          { emit: 'stdout' as const, level: 'warn' as const },
          { emit: 'stdout' as const, level: 'error' as const },
        ]
      : [{ emit: 'stdout' as const, level: 'error' as const }],
  };

  return { pool, adapter, prismaOptions };
}

/**
 * Khởi tạo Prisma Client hoàn chỉnh cho standalone scripts (Seed, CLI, Tests)
 */
export function createPrismaClient(
  connectionString: string,
  isDev: boolean = false,
): { prisma: PrismaClient; pool: Pool } {
  const { pool, prismaOptions } = getPrismaClientConfig(connectionString, isDev);
  const prisma = new PrismaClient(prismaOptions);
  return { prisma, pool };
}
