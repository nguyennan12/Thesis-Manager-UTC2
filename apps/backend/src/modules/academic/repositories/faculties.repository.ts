// ==============================================================================
// FACULTIES REPOSITORY (Data Access Layer for Faculties)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class FacultiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.faculty.findMany({
      include: {
        _count: {
          select: {
            majors: true,
            departments: true,
          },
        },
      },
      orderBy: { code: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.faculty.findUnique({
      where: { id },
      include: {
        majors: true,
        departments: {
          include: {
            headLecturer: {
              select: { id: true, code: true, fullName: true, email: true },
            },
          },
        },
        _count: {
          select: {
            majors: true,
            departments: true,
          },
        },
      },
    });
  }

  async findByCode(code: string) {
    return this.prisma.faculty.findUnique({
      where: { code },
    });
  }

  async create(data: Prisma.FacultyCreateInput, tx?: Prisma.TransactionClient) {
    const client = tx || this.prisma;
    return client.faculty.create({ data });
  }

  async update(id: string, data: Prisma.FacultyUpdateInput, tx?: Prisma.TransactionClient) {
    const client = tx || this.prisma;
    return client.faculty.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, tx?: Prisma.TransactionClient) {
    const client = tx || this.prisma;
    return client.faculty.delete({
      where: { id },
    });
  }

  async countRelations(id: string) {
    const [majorsCount, departmentsCount] = await Promise.all([
      this.prisma.major.count({ where: { facultyId: id } }),
      this.prisma.department.count({ where: { facultyId: id } }),
    ]);
    return { majorsCount, departmentsCount };
  }
}
