// ==============================================================================
// AUDIT LOGS REPOSITORY (Data Access Layer for Audit Trails - BR-13)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

export interface CreateAuditLogData {
  accountId?: string;
  action: string;
  endpoint: string;
  httpMethod: string;
  ipAddress?: string;
  userAgent?: string;
  payload?: any;
  responseStatus?: number;
}

@Injectable()
export class AuditLogsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Tạo mới một bản ghi nhật ký kiểm toán hệ thống
   */
  async create(data: CreateAuditLogData) {
    return this.prisma.auditLog.create({
      data: {
        accountId: data.accountId,
        action: data.action,
        endpoint: data.endpoint,
        httpMethod: data.httpMethod,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        payload: data.payload ? (data.payload as any) : undefined,
        responseStatus: data.responseStatus,
      },
    });
  }

  /**
   * Truy vấn danh sách Audit Logs có phân trang và lọc theo điều kiện
   */
  async findAll(params: {
    skip?: number;
    take?: number;
    accountId?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: any = {};

    if (params.accountId) {
      where.accountId = params.accountId;
    }

    if (params.action) {
      where.action = { contains: params.action, mode: 'insensitive' };
    }

    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) where.createdAt.gte = params.startDate;
      if (params.endDate) where.createdAt.lte = params.endDate;
    }

    const [items, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip: params.skip,
        take: params.take || 20,
        include: {
          account: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { items, total };
  }
}
