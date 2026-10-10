// ==============================================================================
// PRISMA SERVICE: SINGLETON DATABASE SERVICE FOR NESTJS
// ==============================================================================

import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { getPrismaClientConfig } from './prisma-client.factory';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private pool: Pool;

  constructor(private readonly configService: ConfigService) {
    const connectionString = configService.getOrThrow<string>('database.url');
    const isDev = configService.getOrThrow<string>('nodeEnv') === 'development';

    // Sử dụng cấu hình tập trung từ factory
    const { pool, prismaOptions } = getPrismaClientConfig(connectionString, isDev);
    super(prismaOptions);

    this.pool = pool;
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Successfully connected to PostgreSQL database (utc2_thesis_db)');
    } catch (error) {
      this.logger.error('Failed to connect to PostgreSQL database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
    this.logger.log('Disconnected from PostgreSQL database');
  }
}
