// ==============================================================================
// ACCOUNTS MANAGEMENT REPOSITORY (Data Access Layer for User Accounts)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class AccountsManagementRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    filter: { role?: string; isActive?: boolean; search?: string },
    pagination?: { skip: number; take: number },
  ) {
    const where: Prisma.AccountWhereInput = {};

    if (filter.isActive !== undefined) {
      where.isActive = filter.isActive;
    }
    if (filter.role) {
      where.accountRoles = {
        some: {
          role: { code: filter.role },
        },
      };
    }
    if (filter.search) {
      where.OR = [
        { username: { contains: filter.search, mode: 'insensitive' } },
        { email: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.account.findMany({
        where,
        include: {
          accountRoles: {
            include: { role: true },
          },
          student: {
            select: { id: true, code: true, fullName: true },
          },
          lecturer: {
            select: { id: true, code: true, fullName: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: pagination?.skip,
        take: pagination?.take,
      }),
      this.prisma.account.count({ where }),
    ]);

    return { items, total };
  }

  async findById(id: string) {
    return this.prisma.account.findUnique({
      where: { id },
      include: {
        accountRoles: {
          include: { role: true },
        },
        student: {
          include: {
            class: {
              include: {
                major: {
                  include: { faculty: true },
                },
              },
            },
          },
        },
        lecturer: {
          include: {
            department: {
              include: { faculty: true },
            },
          },
        },
      },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.account.findUnique({
      where: { username },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.account.findUnique({
      where: { email },
    });
  }

  async create(data: Prisma.AccountCreateInput, tx?: Prisma.TransactionClient) {
    const client = tx || this.prisma;
    return client.account.create({ data });
  }

  async updateStatus(id: string, isActive: boolean, tx?: Prisma.TransactionClient) {
    const client = tx || this.prisma;
    return client.account.update({
      where: { id },
      data: { isActive },
    });
  }

  async updatePassword(
    id: string,
    passwordHash: string,
    mustChangePassword = true,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || this.prisma;
    return client.account.update({
      where: { id },
      data: {
        passwordHash,
        mustChangePassword,
        refreshTokenHash: null, // Thu hồi token cũ
      },
    });
  }
}
