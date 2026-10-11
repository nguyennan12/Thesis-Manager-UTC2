// ==============================================================================
// CLASSES REPOSITORY (Data Access Layer for Classes with Scope Filtering)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { ScopeFilter } from '../../../common/helpers/data-scope.helper';

@Injectable()
export class ClassesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    filter: { majorId?: string; academicYear?: string; search?: string },
    scope?: ScopeFilter,
  ) {
    const where: Prisma.ClassWhereInput = {};

    if (filter.majorId) {
      where.majorId = filter.majorId;
    }
    if (filter.academicYear) {
      where.academicYear = filter.academicYear;
    }
    if (filter.search) {
      where.OR = [
        { code: { contains: filter.search, mode: 'insensitive' } },
        { name: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    // Áp dụng Data Scoping (Khoa của Giáo vụ)
    if (scope && !scope.isGlobal && scope.facultyIds.length > 0) {
      where.major = {
        facultyId: { in: scope.facultyIds },
      };
    }

    return this.prisma.class.findMany({
      where,
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
        homeroomAdvisor: {
          select: { id: true, code: true, fullName: true, email: true },
        },
        _count: {
          select: { students: true },
        },
      },
      orderBy: { code: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.class.findUnique({
      where: { id },
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
        homeroomAdvisor: {
          select: { id: true, code: true, fullName: true, email: true },
        },
        _count: {
          select: { students: true },
        },
      },
    });
  }

  async findByCode(code: string) {
    return this.prisma.class.findUnique({
      where: { code },
    });
  }

  async create(data: Prisma.ClassCreateInput, tx?: Prisma.TransactionClient) {
    const client = tx || this.prisma;
    return client.class.create({ data });
  }

  async update(id: string, data: Prisma.ClassUpdateInput, tx?: Prisma.TransactionClient) {
    const client = tx || this.prisma;
    return client.class.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, tx?: Prisma.TransactionClient) {
    const client = tx || this.prisma;
    return client.class.delete({
      where: { id },
    });
  }

  async countStudents(id: string) {
    return this.prisma.student.count({
      where: { classId: id },
    });
  }
}
