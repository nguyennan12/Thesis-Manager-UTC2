// ==============================================================================
// SEMESTERS SERVICE (SRP: Semester & Defense Timeline Management)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { SemestersRepository } from '../repositories/semesters.repository';
import { CreateSemesterDto, UpdateSemesterDto } from '../dto/semester.dto';
import { Result, AppError } from '../../../common/utils';
import { SemesterTimelineHelper } from '../helpers/semester-timeline.helper';
import { TransactionManager } from '../../../database/transaction-manager';
import { RedisService } from '../../../database/redis/redis.service';
import { AuditLogsService } from '../../audit-logs/services/audit-logs.service';

const CURRENT_SEMESTER_CACHE_KEY = 'utc2:cache:current_semester';
const CACHE_TTL_SECONDS = 3600; // 1 giờ

@Injectable()
export class SemestersService {
  constructor(
    private readonly semestersRepository: SemestersRepository,
    private readonly transactionManager: TransactionManager,
    private readonly redisService: RedisService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async findAllSemesters(): Promise<Result<any[]>> {
    const semesters = await this.semestersRepository.findAll();
    return Result.ok(semesters);
  }

  async findCurrentSemester(): Promise<Result<any>> {
    // 1. Kiểm tra Cache-Aside trên Redis
    const cached = await this.redisService.get(CURRENT_SEMESTER_CACHE_KEY);
    if (cached) {
      return Result.ok(cached);
    }

    // 2. Cache Miss: Truy vấn từ PostgreSQL
    const current = await this.semestersRepository.findCurrent();
    if (!current) {
      return Result.fail(AppError.notFound('Hiện chưa có học kỳ nào được thiết lập làm học kỳ hiện tại.'));
    }

    // 3. Tự động nạp lại cache
    await this.redisService.set(CURRENT_SEMESTER_CACHE_KEY, current, CACHE_TTL_SECONDS);
    return Result.ok(current);
  }

  async findSemesterById(id: string): Promise<Result<any>> {
    const semester = await this.semestersRepository.findById(id);
    if (!semester) {
      return Result.fail(AppError.notFound('Không tìm thấy học kỳ tương ứng.'));
    }
    return Result.ok(semester);
  }

  async createSemester(dto: CreateSemesterDto, actorAccountId?: string): Promise<Result<any>> {
    // 1. Kiểm tra tính hợp lệ của chuỗi timeline
    const timelineErrors = SemesterTimelineHelper.validate({
      startDate: dto.startDate,
      endDate: dto.endDate,
      topicRegistrationStart: dto.topicRegistrationStart,
      topicRegistrationEnd: dto.topicRegistrationEnd,
      executionStart: dto.executionStart,
      executionEnd: dto.executionEnd,
      thesisSubmissionEnd: dto.thesisSubmissionEnd,
      defenseStart: dto.defenseStart,
      defenseEnd: dto.defenseEnd,
    });

    if (timelineErrors.length > 0) {
      return Result.fail(AppError.badRequest(timelineErrors.join(' ')));
    }

    // 2. Kiểm tra trùng mã học kỳ
    const existing = await this.semestersRepository.findByCode(dto.code.trim().toUpperCase());
    if (existing) {
      return Result.fail(AppError.conflict(`Mã học kỳ '${dto.code}' đã tồn tại trong hệ thống.`));
    }

    const dataInput = {
      code: dto.code.trim().toUpperCase(),
      name: dto.name.trim(),
      academicYear: dto.academicYear.trim(),
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      topicRegistrationStart: dto.topicRegistrationStart ? new Date(dto.topicRegistrationStart) : null,
      topicRegistrationEnd: dto.topicRegistrationEnd ? new Date(dto.topicRegistrationEnd) : null,
      executionStart: dto.executionStart ? new Date(dto.executionStart) : null,
      executionEnd: dto.executionEnd ? new Date(dto.executionEnd) : null,
      thesisSubmissionEnd: dto.thesisSubmissionEnd ? new Date(dto.thesisSubmissionEnd) : null,
      defenseStart: dto.defenseStart ? new Date(dto.defenseStart) : null,
      defenseEnd: dto.defenseEnd ? new Date(dto.defenseEnd) : null,
      isCurrent: !!dto.isCurrent,
    };

    let created: any;
    if (dto.isCurrent) {
      created = await this.transactionManager.run(async (tx) => {
        await tx.semester.updateMany({ where: { isCurrent: true }, data: { isCurrent: false } });
        return tx.semester.create({ data: dataInput });
      });
      await this.redisService.del(CURRENT_SEMESTER_CACHE_KEY);
    } else {
      created = await this.semestersRepository.create(dataInput);
    }

    this.auditLogsService.record({
      accountId: actorAccountId,
      action: 'SEMESTER_CREATE',
      endpoint: '/academic/semesters',
      httpMethod: 'POST',
      payload: { semesterId: created.id, code: created.code },
    });

    return Result.ok(created);
  }

  async updateSemester(id: string, dto: UpdateSemesterDto, actorAccountId?: string): Promise<Result<any>> {
    const semester = await this.semestersRepository.findById(id);
    if (!semester) {
      return Result.fail(AppError.notFound('Không tìm thấy học kỳ cần cập nhật.'));
    }

    const isClosed = await this.semestersRepository.isClosed(id);
    if (isClosed) {
      return Result.fail(AppError.badRequest('Học kỳ này đã kết thúc, không được phép điều chỉnh mốc thời gian.'));
    }

    // Merge các mốc ngày tháng để kiểm tra tính tuần tự
    const timelineErrors = SemesterTimelineHelper.validate({
      startDate: dto.startDate || semester.startDate,
      endDate: dto.endDate || semester.endDate,
      topicRegistrationStart: dto.topicRegistrationStart !== undefined ? dto.topicRegistrationStart : semester.topicRegistrationStart,
      topicRegistrationEnd: dto.topicRegistrationEnd !== undefined ? dto.topicRegistrationEnd : semester.topicRegistrationEnd,
      executionStart: dto.executionStart !== undefined ? dto.executionStart : semester.executionStart,
      executionEnd: dto.executionEnd !== undefined ? dto.executionEnd : semester.executionEnd,
      thesisSubmissionEnd: dto.thesisSubmissionEnd !== undefined ? dto.thesisSubmissionEnd : semester.thesisSubmissionEnd,
      defenseStart: dto.defenseStart !== undefined ? dto.defenseStart : semester.defenseStart,
      defenseEnd: dto.defenseEnd !== undefined ? dto.defenseEnd : semester.defenseEnd,
    });

    if (timelineErrors.length > 0) {
      return Result.fail(AppError.badRequest(timelineErrors.join(' ')));
    }

    const updated = await this.semestersRepository.update(id, {
      name: dto.name?.trim(),
      academicYear: dto.academicYear?.trim(),
      ...(dto.startDate ? { startDate: new Date(dto.startDate) } : {}),
      ...(dto.endDate ? { endDate: new Date(dto.endDate) } : {}),
      ...(dto.topicRegistrationStart !== undefined ? { topicRegistrationStart: dto.topicRegistrationStart ? new Date(dto.topicRegistrationStart) : null } : {}),
      ...(dto.topicRegistrationEnd !== undefined ? { topicRegistrationEnd: dto.topicRegistrationEnd ? new Date(dto.topicRegistrationEnd) : null } : {}),
      ...(dto.executionStart !== undefined ? { executionStart: dto.executionStart ? new Date(dto.executionStart) : null } : {}),
      ...(dto.executionEnd !== undefined ? { executionEnd: dto.executionEnd ? new Date(dto.executionEnd) : null } : {}),
      ...(dto.thesisSubmissionEnd !== undefined ? { thesisSubmissionEnd: dto.thesisSubmissionEnd ? new Date(dto.thesisSubmissionEnd) : null } : {}),
      ...(dto.defenseStart !== undefined ? { defenseStart: dto.defenseStart ? new Date(dto.defenseStart) : null } : {}),
      ...(dto.defenseEnd !== undefined ? { defenseEnd: dto.defenseEnd ? new Date(dto.defenseEnd) : null } : {}),
    });

    if (semester.isCurrent) {
      await this.redisService.del(CURRENT_SEMESTER_CACHE_KEY);
    }

    this.auditLogsService.record({
      accountId: actorAccountId,
      action: 'SEMESTER_UPDATE',
      endpoint: `/academic/semesters/${id}`,
      httpMethod: 'PUT',
      payload: { semesterId: id, changes: dto },
    });

    return Result.ok(updated);
  }

  async setCurrentSemester(id: string, actorAccountId?: string): Promise<Result<any>> {
    const semester = await this.semestersRepository.findById(id);
    if (!semester) {
      return Result.fail(AppError.notFound('Không tìm thấy học kỳ để kích hoạt.'));
    }

    const updated = await this.transactionManager.run(async (tx) => {
      return this.semestersRepository.setCurrent(id, tx);
    });

    // Invalidate Redis Cache sau khi commit
    await this.redisService.del(CURRENT_SEMESTER_CACHE_KEY);

    this.auditLogsService.record({
      accountId: actorAccountId,
      action: 'SEMESTER_SET_CURRENT',
      endpoint: `/academic/semesters/${id}/set-current`,
      httpMethod: 'PATCH',
      payload: { semesterId: id, code: semester.code },
    });

    return Result.ok(updated);
  }
}
