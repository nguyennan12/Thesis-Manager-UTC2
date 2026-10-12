// ==============================================================================
// COUNCILS REPOSITORY (Data Access Layer for Councils, Reviewers & Evaluation)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma, Council, DetailedScore } from '@prisma/client';
import { QueryCouncilDto } from '../dto/council.dto';
import { PaginationHelper, PaginatedResult } from '../../../common/helpers/pagination.helper';

@Injectable()
export class CouncilsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createCouncil(data: Prisma.CouncilCreateInput, tx?: Prisma.TransactionClient): Promise<Council> {
    const client = tx || this.prisma;
    return client.council.create({ data });
  }

  async findCouncilById(id: string) {
    return this.prisma.council.findUnique({
      where: { id },
      include: {
        department: {
          select: { id: true, code: true, name: true },
        },
        semester: {
          select: { id: true, code: true, name: true, isCurrent: true },
        },
        members: {
          include: {
            lecturer: {
              select: { id: true, code: true, fullName: true, degree: true, email: true },
            },
          },
        },
        registrations: {
          include: {
            student: {
              select: { id: true, code: true, fullName: true, class: { select: { code: true } } },
            },
            topic: {
              select: { id: true, code: true, titleVi: true },
            },
            advisorLecturer: {
              select: { id: true, code: true, fullName: true },
            },
          },
        },
      },
    });
  }

  async findCouncilByCode(code: string): Promise<Council | null> {
    return this.prisma.council.findUnique({
      where: { code },
    });
  }

  async findAllCouncils(
    query: QueryCouncilDto,
    extraWhere: Prisma.CouncilWhereInput = {},
  ): Promise<PaginatedResult<any>> {
    const { page, limit, skip } = PaginationHelper.normalize(query.page, query.limit);

    const where: Prisma.CouncilWhereInput = {
      ...extraWhere,
    };

    if (query.search) {
      where.OR = [
        { code: { contains: query.search, mode: 'insensitive' } },
        { name: { contains: query.search, mode: 'insensitive' } },
        { defenseRoom: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.semesterId) {
      where.semesterId = query.semesterId;
    }
    if (query.departmentId) {
      where.departmentId = query.departmentId;
    }

    const [items, total] = await Promise.all([
      this.prisma.council.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ defenseDate: 'desc' }, { startTime: 'asc' }],
        include: {
          department: { select: { id: true, code: true, name: true } },
          members: {
            include: {
              lecturer: {
                select: { id: true, code: true, fullName: true, degree: true, email: true },
              },
            },
          },
          registrations: {
            include: {
              student: {
                select: { id: true, code: true, fullName: true, class: { select: { code: true } } },
              },
              topic: {
                select: { id: true, code: true, titleVi: true },
              },
              advisorLecturer: {
                select: { id: true, code: true, fullName: true },
              },
            },
          },
          _count: {
            select: { members: true, registrations: true },
          },
        },
      }),
      this.prisma.council.count({ where }),
    ]);

    return PaginationHelper.paginate(items, total, page, limit);
  }

  async findConflictingCouncil(
    defenseDate: Date,
    defenseRoom: string,
    startTime: string,
    endTime: string,
    excludeId?: string,
  ): Promise<Council | null> {
    return this.prisma.council.findFirst({
      where: {
        defenseDate,
        defenseRoom,
        startTime,
        endTime,
        id: excludeId ? { not: excludeId } : undefined,
      },
    });
  }

  async assignStudents(
    councilId: string,
    registrationIds: string[],
    tx?: Prisma.TransactionClient,
  ): Promise<Prisma.BatchPayload> {
    const client = tx || this.prisma;
    return client.registration.updateMany({
      where: { id: { in: registrationIds } },
      data: { councilId },
    });
  }

  async upsertDetailedScore(
    registrationId: string,
    criterionId: string,
    lecturerId: string,
    score: number,
    notes?: string,
    tx?: Prisma.TransactionClient,
  ): Promise<DetailedScore> {
    const client = tx || this.prisma;
    return client.detailedScore.upsert({
      where: {
        registrationId_criterionId_lecturerId: {
          registrationId,
          criterionId,
          lecturerId,
        },
      },
      create: {
        registrationId,
        criterionId,
        lecturerId,
        score: new Prisma.Decimal(score.toString()),
        notes,
      },
      update: {
        score: new Prisma.Decimal(score.toString()),
        notes,
        scoredAt: new Date(),
      },
    });
  }

  async getScoresByRegistration(registrationId: string): Promise<DetailedScore[]> {
    return this.prisma.detailedScore.findMany({
      where: { registrationId },
      include: {
        criterion: true,
        lecturer: {
          select: { id: true, code: true, fullName: true },
        },
      },
    });
  }
}
