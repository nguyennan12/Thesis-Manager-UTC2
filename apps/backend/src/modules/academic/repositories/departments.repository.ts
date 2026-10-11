// ==============================================================================
// DEPARTMENTS REPOSITORY (Data Access Layer for Departments)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class DepartmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(facultyId?: string, search?: string) {
    const where: Prisma.DepartmentWhereInput = {};
    if (facultyId) {
      where.facultyId = facultyId;
    }
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.department.findMany({
      where,
      include: {
        faculty: {
          select: { id: true, code: true, name: true },
        },
        headLecturer: {
          select: { id: true, code: true, fullName: true, email: true, degree: true },
        },
        _count: {
          select: {
            lecturers: true,
            topics: true,
            councils: true,
          },
        },
      },
      orderBy: { code: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.department.findUnique({
      where: { id },
      include: {
        faculty: {
          select: { id: true, code: true, name: true },
        },
        headLecturer: {
          select: { id: true, code: true, fullName: true, email: true, degree: true },
        },
        _count: {
          select: {
            lecturers: true,
            topics: true,
            councils: true,
          },
        },
      },
    });
  }

  async findByCode(code: string) {
    return this.prisma.department.findUnique({
      where: { code },
    });
  }

  async create(data: Prisma.DepartmentCreateInput, tx?: Prisma.TransactionClient) {
    const client = tx || this.prisma;
    return client.department.create({ data });
  }

  async update(id: string, data: Prisma.DepartmentUpdateInput, tx?: Prisma.TransactionClient) {
    const client = tx || this.prisma;
    return client.department.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, tx?: Prisma.TransactionClient) {
    const client = tx || this.prisma;
    return client.department.delete({
      where: { id },
    });
  }

  async countRelations(id: string) {
    const [lecturersCount, topicsCount, councilsCount] = await Promise.all([
      this.prisma.lecturer.count({ where: { departmentId: id } }),
      this.prisma.topic.count({ where: { departmentId: id } }),
      this.prisma.council.count({ where: { departmentId: id } }),
    ]);
    return { lecturersCount, topicsCount, councilsCount };
  }
}
