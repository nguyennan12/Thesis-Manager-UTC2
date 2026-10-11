// ==============================================================================
// MAJORS SERVICE (SRP: Major Management with Result Pattern)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { MajorsRepository } from '../repositories/majors.repository';
import { FacultiesRepository } from '../repositories/faculties.repository';
import { CreateMajorDto, UpdateMajorDto, QueryMajorDto } from '../dto/major.dto';
import { Result, AppError } from '../../../common/utils';
import { AuditLogsService } from '../../audit-logs/services/audit-logs.service';

@Injectable()
export class MajorsService {
  constructor(
    private readonly majorsRepository: MajorsRepository,
    private readonly facultiesRepository: FacultiesRepository,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async findAllMajors(query: QueryMajorDto): Promise<Result<any[]>> {
    const majors = await this.majorsRepository.findAll(query.facultyId, query.search);
    return Result.ok(majors);
  }

  async findMajorById(id: string): Promise<Result<any>> {
    const major = await this.majorsRepository.findById(id);
    if (!major) {
      return Result.fail(AppError.notFound('Không tìm thấy ngành đào tạo tương ứng.'));
    }
    return Result.ok(major);
  }

  async createMajor(dto: CreateMajorDto, actorAccountId?: string): Promise<Result<any>> {
    const faculty = await this.facultiesRepository.findById(dto.facultyId);
    if (!faculty) {
      return Result.fail(AppError.notFound('Khoa đào tạo chỉ định không tồn tại.'));
    }

    const existing = await this.majorsRepository.findByCode(dto.code.trim().toUpperCase());
    if (existing) {
      return Result.fail(AppError.conflict(`Mã ngành '${dto.code}' đã tồn tại trong hệ thống.`));
    }

    const created = await this.majorsRepository.create({
      code: dto.code.trim().toUpperCase(),
      name: dto.name.trim(),
      faculty: { connect: { id: dto.facultyId } },
    });

    this.auditLogsService.record({
      accountId: actorAccountId,
      action: 'MAJOR_CREATE',
      endpoint: '/academic/majors',
      httpMethod: 'POST',
      payload: { majorId: created.id, code: created.code, facultyId: dto.facultyId },
    });

    return Result.ok(created);
  }

  async updateMajor(id: string, dto: UpdateMajorDto, actorAccountId?: string): Promise<Result<any>> {
    const major = await this.majorsRepository.findById(id);
    if (!major) {
      return Result.fail(AppError.notFound('Không tìm thấy ngành đào tạo cần cập nhật.'));
    }

    if (dto.facultyId) {
      const faculty = await this.facultiesRepository.findById(dto.facultyId);
      if (!faculty) {
        return Result.fail(AppError.notFound('Khoa đào tạo mới chỉ định không tồn tại.'));
      }
    }

    const updated = await this.majorsRepository.update(id, {
      name: dto.name?.trim(),
      ...(dto.facultyId ? { faculty: { connect: { id: dto.facultyId } } } : {}),
    });

    this.auditLogsService.record({
      accountId: actorAccountId,
      action: 'MAJOR_UPDATE',
      endpoint: `/academic/majors/${id}`,
      httpMethod: 'PUT',
      payload: { majorId: id, changes: dto },
    });

    return Result.ok(updated);
  }

  async deleteMajor(id: string, actorAccountId?: string): Promise<Result<boolean>> {
    const major = await this.majorsRepository.findById(id);
    if (!major) {
      return Result.fail(AppError.notFound('Không tìm thấy ngành đào tạo cần xóa.'));
    }

    const { classesCount, topicsCount } = await this.majorsRepository.countRelations(id);
    if (classesCount > 0 || topicsCount > 0) {
      return Result.fail(
        AppError.conflict(
          `Không thể xóa ngành vì vẫn còn ${classesCount} lớp và ${topicsCount} đề tài liên kết. Vui lòng di chuyển hoặc xóa các dữ liệu con trước.`,
        ),
      );
    }

    await this.majorsRepository.delete(id);

    this.auditLogsService.record({
      accountId: actorAccountId,
      action: 'MAJOR_DELETE',
      endpoint: `/academic/majors/${id}`,
      httpMethod: 'DELETE',
      payload: { majorId: id, code: major.code },
    });

    return Result.ok(true);
  }
}
