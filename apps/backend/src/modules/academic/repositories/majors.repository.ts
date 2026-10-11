// ==============================================================================
// MAJORS REPOSITORY (Data Access Layer for Majors)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class MajorsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(facultyId?: string, search?: string) {
    const where: Prisma.MajorWhereInput = {};
    if (facultyId) {
      where.facultyId = facultyId;
    }
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.major.findMany({
      where,
      include: {
        faculty: {
          select: { id: true, code: true, name: true },
        },
        _count: {
          select: {
            classes: true,
            topics: true,
          },
        },
      },
      orderBy: { code: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.major.findUnique({
      where: { id },
      include: {
        faculty: {
          select: { id: true, code: true, name: true },
        },
        classes: true,
        _count: {
          select: {
            classes: true,
            topics: true,
          },
        },
      },
    });
  }

  async findByCode(code: string) {
    return this.prisma.major.findUnique({
      where: { code },
    });
  }

  async create(data: Prisma.MajorCreateInput, tx?: Prisma.TransactionClient) {
    const client = tx || this.prisma;
    return client.major.create({ data });
  }

  async update(id: string, data: Prisma.MajorUpdateInput, tx?: Prisma.TransactionClient) {
    const client = tx || this.prisma;
    return client.major.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, tx?: Prisma.TransactionClient) {
    const client = tx || this.prisma;
    return client.major.delete({
      where: { id },
    });
  }

  async countRelations(id: string) {
    const [classesCount, topicsCount] = await Promise.all([
      this.prisma.class.count({ where: { majorId: id } }),
      this.prisma.topic.count({ where: { majorId: id } }),
    ]);
    return { classesCount, topicsCount };
  }
}
