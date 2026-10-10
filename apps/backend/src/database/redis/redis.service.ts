// ==============================================================================
// GLOBAL REDIS SERVICE (Enterprise Redis Client with Auto-Reconnect & Failover)
// ==============================================================================

import {
  Injectable,
  OnModuleInit,
  OnApplicationShutdown,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger(RedisService.name);
  private client!: Redis;
  private isConnected = false;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const host = this.configService.getOrThrow<string>('redis.host');
    const port = this.configService.getOrThrow<number>('redis.port');
    const password = this.configService.get<string>('redis.password');

    this.client = new Redis({
      host,
      port,
      password: password || undefined,
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      retryStrategy: (times) => {
        const delay = Math.min(times * 200, 3000);
        return delay;
      },
      lazyConnect: true,
    });

    this.client.on('connect', () => {
      this.isConnected = true;
      this.logger.log(`Connected to Redis server at ${host}:${port}`);
    });

    this.client.on('ready', () => {
      this.isConnected = true;
    });

    this.client.on('error', (err) => {
      this.isConnected = false;
      this.logger.warn(`Redis connection error: ${err.message}`);
    });

    this.client.on('close', () => {
      this.isConnected = false;
    });

    // Kết nối đồng bộ khi khởi động để bảo đảm sẵn sàng cho các services khác
    try {
      await this.client.connect();
      this.isConnected = true;
    } catch (err: any) {
      this.isConnected = false;
      this.logger.warn(`Could not connect to Redis at startup: ${err.message}`);
    }
  }

  async onApplicationShutdown() {
    if (this.client) {
      await this.client.quit().catch(() => {});
      this.logger.log('Redis connection closed gracefully.');
    }
  }

  /**
   * Lấy instance ioredis gốc nếu cần thao tác cấp thấp
   */
  getClient(): Redis {
    return this.client;
  }

  /**
   * Kiểm tra trạng thái kết nối Redis
   */
  getIsConnected(): boolean {
    return this.isConnected;
  }

  // ==============================================================================
  // COMMON REDIS OPERATIONS
  // ==============================================================================

  async get<T = any>(key: string): Promise<T | null> {
    if (!this.isConnected) return null;
    try {
      const data = await this.client.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    if (!this.isConnected) return;
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await this.client.setex(key, ttlSeconds, serialized);
      } else {
        await this.client.set(key, serialized);
      }
    } catch (err: any) {
      this.logger.warn(`Redis set error for key ${key}: ${err.message}`);
    }
  }

  async del(key: string | string[]): Promise<void> {
    if (!this.isConnected) return;
    try {
      if (Array.isArray(key)) {
        if (key.length > 0) {
          await this.client.del(...key);
        }
      } else {
        await this.client.del(key);
      }
    } catch (err: any) {
      this.logger.warn(`Redis del error: ${err.message}`);
    }
  }

  async sadd(key: string, members: string[]): Promise<void> {
    if (!this.isConnected || members.length === 0) return;
    try {
      await this.client.sadd(key, ...members);
    } catch (err: any) {
      this.logger.warn(`Redis sadd error for key ${key}: ${err.message}`);
    }
  }

  async smembers(key: string): Promise<string[]> {
    if (!this.isConnected) return [];
    try {
      return await this.client.smembers(key);
    } catch {
      return [];
    }
  }

  async sismember(key: string, member: string): Promise<boolean> {
    if (!this.isConnected) return false;
    try {
      const result = await this.client.sismember(key, member);
      return result === 1;
    } catch {
      return false;
    }
  }
}
