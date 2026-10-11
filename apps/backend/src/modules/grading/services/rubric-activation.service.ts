// ==============================================================================
// RUBRIC ACTIVATION & CLONING SERVICE (Version Management & Safe Activation)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { RubricSetsRepository } from '../repositories/rubric-sets.repository';
import { EvaluationCriteriaRepository } from '../repositories/evaluation-criteria.repository';
import { TransactionManager } from '../../../database/transaction-manager';
import { AuditLogsService } from '../../audit-logs/services/audit-logs.service';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { Result, AppError } from '../../../common/utils';
import { RubricWeightHelper } from '../helpers/rubric-weight.helper';
import { RubricSet, Prisma } from '@prisma/client';

@Injectable()
export class RubricActivationService {
  constructor(
    private readonly rubricSetsRepo: RubricSetsRepository,
    private readonly criteriaRepo: EvaluationCriteriaRepository,
    private readonly txManager: TransactionManager,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async activate(id: string, user?: AuthenticatedUser): Promise<Result<RubricSet>> {
    const rubric = await this.rubricSetsRepo.findById(id);
    if (!rubric) {
      return Result.err(AppError.notFound(`Không tìm thấy bộ tiêu chí với ID '${id}'.`));
    }

    if (rubric.isActive) {
      return Result.ok(rubric);
    }

    // Tiêu chí phải có và tổng trọng số phải đạt đúng 100.00% (BR-08)
    const criteria = await this.criteriaRepo.findByRubricSetId(id);
    const validationErrors = RubricWeightHelper.validate(criteria, true);
    if (validationErrors.length > 0) {
      return Result.err(AppError.badRequest(validationErrors.join('; ')));
    }

    const activatedRubric = await this.txManager.run(async (tx) => {
      // 1. Hạ trạng thái Active của các bộ cùng (topicType, academicYear)
      await this.rubricSetsRepo.deactivateOthers(rubric.topicType, rubric.academicYear, id, tx);

      // 2. Kích hoạt bộ tiêu chí hiện tại
      return this.rubricSetsRepo.update(id, { isActive: true }, tx);
    });

    // 3. Ghi vết Audit Log bất đồng bộ (BR-13)
    this.auditLogsService.record({
      action: 'RUBRIC_ACTIVATED',
      endpoint: `/api/v1/grading/rubrics/${id}/activate`,
      httpMethod: 'POST',
      accountId: user?.sub,
      payload: {
        rubricId: id,
        rubricCode: rubric.code,
        topicType: rubric.topicType,
        academicYear: rubric.academicYear,
      },
    });

    return Result.ok(activatedRubric);
  }

  async clone(id: string, user?: AuthenticatedUser): Promise<Result<RubricSet & { criteria: any[] }>> {
    const sourceRubric = await this.rubricSetsRepo.findById(id);
    if (!sourceRubric) {
      return Result.err(AppError.notFound(`Không tìm thấy bộ tiêu chí nguồn với ID '${id}'.`));
    }

    const nextVersion = sourceRubric.version + 1;
    let newCode = `${sourceRubric.code}_V${nextVersion}`;

    // Đảm bảo mã không trùng
    let count = 1;
    while (await this.rubricSetsRepo.findByCode(newCode)) {
      newCode = `${sourceRubric.code}_V${nextVersion}_${count}`;
      count++;
    }

    const newRubric = await this.txManager.run(async (tx) => {
      // 1. Tạo bản sao RubricSet
      const createdSet = await this.rubricSetsRepo.create(
        {
          code: newCode,
          name: `${sourceRubric.name} (v${nextVersion})`,
          topicType: sourceRubric.topicType,
          academicYear: sourceRubric.academicYear,
          totalWeight: sourceRubric.totalWeight,
          isActive: false,
          version: nextVersion,
          parent: { connect: { id: sourceRubric.id } },
        },
        tx,
      );

      // 2. Sao chép danh sách tiêu chí con
      const sourceCriteria = await this.criteriaRepo.findByRubricSetId(id);
      if (sourceCriteria.length > 0) {
        const clonedCriteria: Prisma.EvaluationCriterionCreateManyInput[] = sourceCriteria.map((c) => ({
          rubricSetId: createdSet.id,
          code: c.code,
          name: c.name,
          description: c.description,
          weight: c.weight,
          topicType: c.topicType,
          orderIndex: c.orderIndex,
        }));

        await this.criteriaRepo.createMany(clonedCriteria, tx);
      }

      return createdSet;
    });

    // 3. Ghi vết Audit Log
    this.auditLogsService.record({
      action: 'RUBRIC_CLONED',
      endpoint: `/api/v1/grading/rubrics/${id}/clone`,
      httpMethod: 'POST',
      accountId: user?.sub,
      payload: {
        sourceId: id,
        sourceCode: sourceRubric.code,
        clonedId: newRubric.id,
        clonedCode: newRubric.code,
        version: nextVersion,
      },
    });

    const fullResult = await this.rubricSetsRepo.findById(newRubric.id);
    return Result.ok(fullResult!);
  }
}
