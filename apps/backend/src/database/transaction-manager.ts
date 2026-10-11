// ==============================================================================
// TRANSACTION MANAGER (SRP: Encapsulated Database Transactions for Services)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class TransactionManager {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Thực thi một chuỗi tác vụ nghiệp vụ bên trong một Database Transaction độc lập
   * @param fn Hàm chứa các thao tác thông qua transaction client
   */
  async run<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(fn);
  }
}
