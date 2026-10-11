// ==============================================================================
// PROGRESS REPOSITORY (Data Access Layer for Progress Reports & Plagiarism)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma, ProgressReport, PlagiarismResult, RegistrationStatus } from '@prisma/client';

@Injectable()
export class ProgressRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createReport(
    data: Prisma.ProgressReportCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<ProgressReport> {
    const client = tx || this.prisma;
    return client.progressReport.create({ data });
  }

  async findReportById(id: string) {
    return this.prisma.progressReport.findUnique({
      where: { id },
      include: {
        registration: {
          include: {
            student: true,
            topic: true,
            advisorLecturer: true,
          },
        },
        reviewerLecturer: {
          select: { id: true, code: true, fullName: true, email: true },
        },
      },
    });
  }

  async findReportsByRegistrationId(registrationId: string): Promise<ProgressReport[]> {
    return this.prisma.progressReport.findMany({
      where: { registrationId },
      orderBy: { weekNumber: 'asc' },
      include: {
        reviewerLecturer: {
          select: { id: true, code: true, fullName: true },
        },
      },
    });
  }

  async findReportByWeek(registrationId: string, weekNumber: number): Promise<ProgressReport | null> {
    return this.prisma.progressReport.findUnique({
      where: {
        registrationId_weekNumber: {
          registrationId,
          weekNumber,
        },
      },
    });
  }

  async updateReport(
    id: string,
    data: Prisma.ProgressReportUpdateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<ProgressReport> {
    const client = tx || this.prisma;
    return client.progressReport.update({
      where: { id },
      data,
    });
  }

  async findWarningStudents(semesterId?: string) {
    const where: Prisma.RegistrationWhereInput = {
      status: { in: [RegistrationStatus.REGISTERED, RegistrationStatus.IN_PROGRESS] },
    };

    if (semesterId) {
      where.semesterId = semesterId;
    }

    return this.prisma.registration.findMany({
      where,
      include: {
        student: {
          select: { id: true, code: true, fullName: true, email: true, phone: true },
        },
        topic: {
          select: { id: true, code: true, titleVi: true },
        },
        advisorLecturer: {
          select: { id: true, code: true, fullName: true, email: true },
        },
        _count: {
          select: { progressReports: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPlagiarismByRegistrationId(registrationId: string): Promise<PlagiarismResult | null> {
    return this.prisma.plagiarismResult.findFirst({
      where: { registrationId },
      orderBy: { analyzedAt: 'desc' },
    });
  }

  async upsertPlagiarismResult(
    registrationId: string,
    similarityPercentage: number,
    matchingDetails?: any,
  ): Promise<PlagiarismResult> {
    const existing = await this.findPlagiarismByRegistrationId(registrationId);
    if (existing) {
      return this.prisma.plagiarismResult.update({
        where: { id: existing.id },
        data: {
          similarityPercentage: new Prisma.Decimal(similarityPercentage.toString()),
          matchingDetails: matchingDetails || undefined,
          analyzedAt: new Date(),
        },
      });
    }

    return this.prisma.plagiarismResult.create({
      data: {
        registrationId,
        similarityPercentage: new Prisma.Decimal(similarityPercentage.toString()),
        matchingDetails: matchingDetails || undefined,
      },
    });
  }
}
