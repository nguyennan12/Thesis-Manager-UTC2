import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { EvaluationCriterion, Prisma } from '@prisma/client';

@Injectable()
export class EvaluationCriteriaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByRubricSetId(rubricSetId: string): Promise<EvaluationCriterion[]> {
    return this.prisma.evaluationCriterion.findMany({
      where: { rubricSetId },
      orderBy: { orderIndex: 'asc' },
    });
  }

  async deleteByRubricSetId(rubricSetId: string, tx?: Prisma.TransactionClient): Promise<Prisma.BatchPayload> {
    const client = tx || this.prisma;
    return client.evaluationCriterion.deleteMany({
      where: { rubricSetId },
    });
  }

  async createMany(
    data: Prisma.EvaluationCriterionCreateManyInput[],
    tx?: Prisma.TransactionClient,
  ): Promise<Prisma.BatchPayload> {
    const client = tx || this.prisma;
    return client.evaluationCriterion.createMany({
      data,
    });
  }

  async countScoresByCriterionId(criterionId: string): Promise<number> {
    return this.prisma.detailedScore.count({
      where: { criterionId },
    });
  }
}
