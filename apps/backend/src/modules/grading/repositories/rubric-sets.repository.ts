import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma, RubricSet, TopicType } from '@prisma/client';
import { QueryRubricSetDto } from '../dto/query-rubric-set.dto';
import { PaginationHelper, PaginatedResult } from '../../../common/helpers/pagination.helper';

@Injectable()
export class RubricSetsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.RubricSetCreateInput, tx?: Prisma.TransactionClient): Promise<RubricSet> {
    const client = tx || this.prisma;
    return client.rubricSet.create({ data });
  }

  async findById(id: string): Promise<(RubricSet & { criteria: any[] }) | null> {
    return this.prisma.rubricSet.findUnique({
      where: { id },
      include: {
        criteria: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });
  }

  async findByCode(code: string): Promise<RubricSet | null> {
    return this.prisma.rubricSet.findUnique({
      where: { code },
    });
  }

  async findActive(topicType: TopicType, academicYear: string): Promise<(RubricSet & { criteria: any[] }) | null> {
    return this.prisma.rubricSet.findFirst({
      where: {
        topicType,
        academicYear,
        isActive: true,
      },
      include: {
        criteria: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });
  }

  async findAll(query: QueryRubricSetDto): Promise<PaginatedResult<RubricSet>> {
    const { page, limit, skip } = PaginationHelper.normalize(query.page, query.limit);

    const where: Prisma.RubricSetWhereInput = {};

    if (query.search) {
      where.OR = [
        { code: { contains: query.search, mode: 'insensitive' } },
        { name: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.topicType) {
      where.topicType = query.topicType;
    }
    if (query.academicYear) {
      where.academicYear = query.academicYear;
    }
    if (typeof query.isActive === 'boolean') {
      where.isActive = query.isActive;
    }

    const [items, total] = await Promise.all([
      this.prisma.rubricSet.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ academicYear: 'desc' }, { createdAt: 'desc' }],
        include: {
          _count: {
            select: { criteria: true },
          },
        },
      }),
      this.prisma.rubricSet.count({ where }),
    ]);

    return PaginationHelper.paginate(items, total, page, limit);
  }

  async update(id: string, data: Prisma.RubricSetUpdateInput, tx?: Prisma.TransactionClient): Promise<RubricSet> {
    const client = tx || this.prisma;
    return client.rubricSet.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, tx?: Prisma.TransactionClient): Promise<RubricSet> {
    const client = tx || this.prisma;
    return client.rubricSet.delete({
      where: { id },
    });
  }

  async deactivateOthers(
    topicType: TopicType,
    academicYear: string,
    excludeId: string,
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    await tx.rubricSet.updateMany({
      where: {
        topicType,
        academicYear,
        id: { not: excludeId },
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });
  }

  async hasDetailedScores(rubricSetId: string): Promise<boolean> {
    const count = await this.prisma.detailedScore.count({
      where: {
        criterion: {
          rubricSetId,
        },
      },
    });
    return count > 0;
  }
}
