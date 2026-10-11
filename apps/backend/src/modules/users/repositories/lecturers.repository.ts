// ==============================================================================
// LECTURERS REPOSITORY (Data Access Layer for Lecturers)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class LecturersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    filter: { departmentId?: string; degree?: string; search?: string },
    pagination?: { skip: number; take: number },
  ) {
    const where: Prisma.LecturerWhereInput = {};

    if (filter.departmentId) {
      where.departmentId = filter.departmentId;
    }
    if (filter.degree) {
      where.degree = { contains: filter.degree, mode: 'insensitive' };
    }
    if (filter.search) {
      where.OR = [
        { code: { contains: filter.search, mode: 'insensitive' } },
        { fullName: { contains: filter.search, mode: 'insensitive' } },
        { email: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.lecturer.findMany({
        where,
        include: {
          department: {
            include: {
              faculty: { select: { id: true, code: true, name: true } },
            },
          },
          account: {
            select: {
              id: true,
              username: true,
              isActive: true,
              lastLoginAt: true,
            },
          },
        },
        orderBy: { code: 'asc' },
        skip: pagination?.skip,
        take: pagination?.take,
      }),
      this.prisma.lecturer.count({ where }),
    ]);

    return { items, total };
  }

  async findById(id: string) {
    return this.prisma.lecturer.findUnique({
      where: { id },
      include: {
        department: {
          include: {
            faculty: { select: { id: true, code: true, name: true } },
          },
        },
        account: {
          select: {
            id: true,
            username: true,
            email: true,
            isActive: true,
            mustChangePassword: true,
            lastLoginAt: true,
          },
        },
        _count: {
          select: {
            advisedRegistrations: true,
            proposedTopics: true,
          },
        },
      },
    });
  }

  async findByCode(code: string) {
    return this.prisma.lecturer.findUnique({
      where: { code },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.lecturer.findUnique({
      where: { email },
    });
  }

  async create(data: Prisma.LecturerCreateInput, tx?: Prisma.TransactionClient) {
    const client = tx || this.prisma;
    return client.lecturer.create({ data });
  }

  async update(id: string, data: Prisma.LecturerUpdateInput, tx?: Prisma.TransactionClient) {
    const client = tx || this.prisma;
    return client.lecturer.update({
      where: { id },
      data,
    });
  }
}
