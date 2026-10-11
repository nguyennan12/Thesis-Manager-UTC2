// ==============================================================================
// RUBRICS SERVICE (CRUD Rubric Sets and Criteria Management)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { RubricSetsRepository } from '../repositories/rubric-sets.repository';
import { EvaluationCriteriaRepository } from '../repositories/evaluation-criteria.repository';
import { TransactionManager } from '../../../database/transaction-manager';
import { CreateRubricSetDto, UpdateRubricSetDto } from '../dto/rubric-set.dto';
import { QueryRubricSetDto } from '../dto/query-rubric-set.dto';
import { UpsertCriteriaDto } from '../dto/criteria.dto';
import { Result, AppError } from '../../../common/utils';
import { RubricWeightHelper } from '../helpers/rubric-weight.helper';
import { RubricSet, TopicType, Prisma } from '@prisma/client';
import { PaginatedResult } from '../../../common/helpers/pagination.helper';

@Injectable()
export class RubricsService {
  constructor(
    private readonly rubricSetsRepo: RubricSetsRepository,
    private readonly criteriaRepo: EvaluationCriteriaRepository,
    private readonly txManager: TransactionManager,
  ) {}

  async create(dto: CreateRubricSetDto): Promise<Result<RubricSet>> {
    const existing = await this.rubricSetsRepo.findByCode(dto.code);
    if (existing) {
      return Result.err(AppError.conflict(`Mã bộ tiêu chí '${dto.code}' đã tồn tại.`));
    }

    const created = await this.rubricSetsRepo.create({
      code: dto.code,
      name: dto.name,
      topicType: dto.topicType,
      academicYear: dto.academicYear,
      totalWeight: 0.0,
      isActive: false,
      version: 1,
    });

    return Result.ok(created);
  }

  async findAll(query: QueryRubricSetDto): Promise<Result<PaginatedResult<RubricSet>>> {
    const result = await this.rubricSetsRepo.findAll(query);
    return Result.ok(result);
  }

  async findActive(topicType: TopicType, academicYear: string): Promise<Result<RubricSet & { criteria: any[] }>> {
    const active = await this.rubricSetsRepo.findActive(topicType, academicYear);
    if (!active) {
      return Result.err(
        AppError.notFound(`Không tìm thấy bộ tiêu chí đang áp dụng cho loại ${topicType} năm học ${academicYear}.`),
      );
    }
    return Result.ok(active);
  }

  async findById(id: string): Promise<Result<RubricSet & { criteria: any[] }>> {
    const rubric = await this.rubricSetsRepo.findById(id);
    if (!rubric) {
      return Result.err(AppError.notFound(`Không tìm thấy bộ tiêu chí với ID '${id}'.`));
    }
    return Result.ok(rubric);
  }

  async update(id: string, dto: UpdateRubricSetDto): Promise<Result<RubricSet>> {
    const rubric = await this.rubricSetsRepo.findById(id);
    if (!rubric) {
      return Result.err(AppError.notFound(`Không tìm thấy bộ tiêu chí với ID '${id}'.`));
    }

    if (rubric.isActive) {
      return Result.err(AppError.badRequest('Bộ tiêu chí đang kích hoạt không thể sửa thông tin trực tiếp. Vui lòng tạo bản sao (clone).'));
    }

    const updated = await this.rubricSetsRepo.update(id, {
      name: dto.name,
    });

    return Result.ok(updated);
  }

  async upsertCriteria(id: string, dto: UpsertCriteriaDto): Promise<Result<RubricSet & { criteria: any[] }>> {
    const rubric = await this.rubricSetsRepo.findById(id);
    if (!rubric) {
      return Result.err(AppError.notFound(`Không tìm thấy bộ tiêu chí với ID '${id}'.`));
    }

    if (rubric.isActive) {
      return Result.err(AppError.badRequest('Bộ tiêu chí đang kích hoạt không thể sửa tiêu chí con. Vui lòng clone phiên bản mới.'));
    }

    const hasScores = await this.rubricSetsRepo.hasDetailedScores(id);
    if (hasScores) {
      return Result.err(AppError.conflict('Không thể sửa đổi tiêu chí đánh giá vì đã có dữ liệu chấm điểm đồ án.'));
    }

    // Kiểm tra tính hợp lệ của trọng số tiêu chí (không vượt quá 100%)
    const weightErrors = RubricWeightHelper.validate(dto.criteria, false);
    if (weightErrors.length > 0) {
      return Result.err(AppError.badRequest(weightErrors.join('; ')));
    }

    // Kiểm tra trùng lặp mã code trong cùng payload
    const codeSet = new Set<string>();
    for (const c of dto.criteria) {
      if (codeSet.has(c.code)) {
        return Result.err(AppError.badRequest(`Mã tiêu chí '${c.code}' bị trùng lặp trong danh sách.`));
      }
      codeSet.add(c.code);
    }

    const totalWeight = RubricWeightHelper.calculateTotal(dto.criteria);

    await this.txManager.run(async (tx) => {
      await this.criteriaRepo.deleteByRubricSetId(id, tx);

      const criteriaData: Prisma.EvaluationCriterionCreateManyInput[] = dto.criteria.map((c, index) => ({
        rubricSetId: id,
        code: c.code,
        name: c.name,
        description: c.description || null,
        weight: new Prisma.Decimal(c.weight.toString()),
        topicType: c.topicType,
        orderIndex: c.orderIndex || index + 1,
      }));

      await this.criteriaRepo.createMany(criteriaData, tx);
      await this.rubricSetsRepo.update(id, { totalWeight }, tx);
    });

    const updatedRubric = await this.rubricSetsRepo.findById(id);
    return Result.ok(updatedRubric!);
  }

  async delete(id: string): Promise<Result<void>> {
    const rubric = await this.rubricSetsRepo.findById(id);
    if (!rubric) {
      return Result.err(AppError.notFound(`Không tìm thấy bộ tiêu chí với ID '${id}'.`));
    }

    if (rubric.isActive) {
      return Result.err(AppError.badRequest('Không thể xóa bộ tiêu chí đang ở trạng thái kích hoạt (Active).'));
    }

    const hasScores = await this.rubricSetsRepo.hasDetailedScores(id);
    if (hasScores) {
      return Result.err(AppError.conflict('Không thể xóa bộ tiêu chí vì đã phát sinh dữ liệu chấm điểm sinh viên.'));
    }

    await this.txManager.run(async (tx) => {
      await this.criteriaRepo.deleteByRubricSetId(id, tx);
      await this.rubricSetsRepo.delete(id, tx);
    });

    return Result.ok(undefined);
  }
}
