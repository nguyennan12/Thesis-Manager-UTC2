// ==============================================================================
// LECTURER QUOTAS REPOSITORY (Data Access Layer for Advisor Quotas per Semester)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class LecturerQuotasRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findBySemester(semesterId: string, departmentId?: string) {
    const whereLecturer: Prisma.LecturerWhereInput = {
      isActive: true,
      ...(departmentId ? { departmentId } : {}),
    };

    return this.prisma.lecturer.findMany({
      where: whereLecturer,
      include: {
        department: {
          select: { id: true, code: true, name: true, facultyId: true },
        },
        semesterQuotas: {
          where: { semesterId },
        },
        _count: {
          select: {
            advisedRegistrations: {
              where: { semesterId },
            },
          },
        },
      },
      orderBy: { fullName: 'asc' },
    });
  }

  async findByLecturerAndSemester(lecturerId: string, semesterId: string) {
    return this.prisma.lecturerSemesterQuota.findUnique({
      where: {
        lecturerId_semesterId: { lecturerId, semesterId },
      },
    });
  }

  async upsert(
    lecturerId: string,
    semesterId: string,
    maxQuota: number,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || this.prisma;
    return client.lecturerSemesterQuota.upsert({
      where: {
        lecturerId_semesterId: { lecturerId, semesterId },
      },
      update: { maxQuota },
      create: { lecturerId, semesterId, maxQuota },
    });
  }

  async countAssignedTopics(lecturerId: string, semesterId: string): Promise<number> {
    return this.prisma.registration.count({
      where: {
        advisorLecturerId: lecturerId,
        semesterId,
      },
    });
  }
}
