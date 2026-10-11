// ==============================================================================
// SEMESTERS REPOSITORY (Data Access Layer for Semesters)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class SemestersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.semester.findMany({
      orderBy: [
        { academicYear: 'desc' },
        { startDate: 'desc' },
      ],
      include: {
        _count: {
          select: {
            topics: true,
            registrations: true,
            councils: true,
          },
        },
      },
    });
  }

  async findCurrent() {
    return this.prisma.semester.findFirst({
      where: { isCurrent: true },
      include: {
        _count: {
          select: {
            topics: true,
            registrations: true,
            councils: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.semester.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            topics: true,
            registrations: true,
            councils: true,
          },
        },
      },
    });
  }

  async findByCode(code: string) {
    return this.prisma.semester.findUnique({
      where: { code },
    });
  }

  async create(data: Prisma.SemesterCreateInput, tx?: Prisma.TransactionClient) {
    const client = tx || this.prisma;
    return client.semester.create({ data });
  }

  async update(id: string, data: Prisma.SemesterUpdateInput, tx?: Prisma.TransactionClient) {
    const client = tx || this.prisma;
    return client.semester.update({
      where: { id },
      data,
    });
  }

  async setCurrent(id: string, tx: Prisma.TransactionClient) {
    // 1. Chuyển toàn bộ các học kỳ khác về isCurrent = false
    await tx.semester.updateMany({
      where: { isCurrent: true },
      data: { isCurrent: false },
    });

    // 2. Kích hoạt học kỳ được chọn
    return tx.semester.update({
      where: { id },
      data: { isCurrent: true },
    });
  }

  async isClosed(id: string): Promise<boolean> {
    const semester = await this.prisma.semester.findUnique({
      where: { id },
      select: { endDate: true },
    });
    if (!semester) return false;
    return new Date(semester.endDate) < new Date();
  }
}
