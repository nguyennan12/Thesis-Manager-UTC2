// ==============================================================================
// STUDENTS REPOSITORY (Data Access Layer for Students with Scope Filtering)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { ScopeFilter } from '../../../common/helpers/data-scope.helper';

@Injectable()
export class StudentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    filter: { classId?: string; status?: string; search?: string },
    scope?: ScopeFilter,
    pagination?: { skip: number; take: number },
  ) {
    const where: Prisma.StudentWhereInput = {};

    if (filter.classId) {
      where.classId = filter.classId;
    }
    if (filter.status) {
      where.status = filter.status as any;
    }
    if (filter.search) {
      where.OR = [
        { code: { contains: filter.search, mode: 'insensitive' } },
        { fullName: { contains: filter.search, mode: 'insensitive' } },
        { email: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    // Áp dụng Data Scoping (Khoa của Giáo vụ)
    if (scope && !scope.isGlobal && scope.facultyIds.length > 0) {
      where.class = {
        major: {
          facultyId: { in: scope.facultyIds },
        },
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        include: {
          class: {
            include: {
              major: {
                select: {
                  id: true,
                  code: true,
                  name: true,
                  facultyId: true,
                  faculty: { select: { id: true, code: true, name: true } },
                },
              },
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
      this.prisma.student.count({ where }),
    ]);

    return { items, total };
  }

  async findById(id: string) {
    return this.prisma.student.findUnique({
      where: { id },
      include: {
        class: {
          include: {
            major: {
              include: {
                faculty: true,
              },
            },
            homeroomAdvisor: {
              select: { id: true, code: true, fullName: true, email: true },
            },
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
      },
    });
  }

  async findByCode(code: string) {
    return this.prisma.student.findUnique({
      where: { code },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.student.findUnique({
      where: { email },
    });
  }

  async create(data: Prisma.StudentCreateInput, tx?: Prisma.TransactionClient) {
    const client = tx || this.prisma;
    return client.student.create({ data });
  }

  async update(id: string, data: Prisma.StudentUpdateInput, tx?: Prisma.TransactionClient) {
    const client = tx || this.prisma;
    return client.student.update({
      where: { id },
      data,
    });
  }
}
