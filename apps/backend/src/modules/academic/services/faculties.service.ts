// ==============================================================================
// FACULTIES SERVICE (SRP: Faculty Management with Result Pattern)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { FacultiesRepository } from '../repositories/faculties.repository';
import { CreateFacultyDto, UpdateFacultyDto } from '../dto/faculty.dto';
import { Result, AppError } from '../../../common/utils';
import { AuditLogsService } from '../../audit-logs/services/audit-logs.service';

@Injectable()
export class FacultiesService {
  constructor(
    private readonly facultiesRepository: FacultiesRepository,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async findAllFaculties(): Promise<Result<any[]>> {
    const faculties = await this.facultiesRepository.findAll();
    return Result.ok(faculties);
  }

  async findFacultyById(id: string): Promise<Result<any>> {
    const faculty = await this.facultiesRepository.findById(id);
    if (!faculty) {
      return Result.fail(AppError.notFound('Không tìm thấy khoa đào tạo tương ứng.'));
    }
    return Result.ok(faculty);
  }

  async createFaculty(dto: CreateFacultyDto, actorAccountId?: string): Promise<Result<any>> {
    const existing = await this.facultiesRepository.findByCode(dto.code.trim().toUpperCase());
    if (existing) {
      return Result.fail(AppError.conflict(`Mã khoa '${dto.code}' đã tồn tại trong hệ thống.`));
    }

    const created = await this.facultiesRepository.create({
      code: dto.code.trim().toUpperCase(),
      name: dto.name.trim(),
      description: dto.description?.trim(),
    });

    this.auditLogsService.record({
      accountId: actorAccountId,
      action: 'FACULTY_CREATE',
      endpoint: '/academic/faculties',
      httpMethod: 'POST',
      payload: { facultyId: created.id, code: created.code },
    });

    return Result.ok(created);
  }

  async updateFaculty(id: string, dto: UpdateFacultyDto, actorAccountId?: string): Promise<Result<any>> {
    const faculty = await this.facultiesRepository.findById(id);
    if (!faculty) {
      return Result.fail(AppError.notFound('Không tìm thấy khoa đào tạo cần cập nhật.'));
    }

    const updated = await this.facultiesRepository.update(id, {
      name: dto.name?.trim(),
      description: dto.description?.trim(),
    });

    this.auditLogsService.record({
      accountId: actorAccountId,
      action: 'FACULTY_UPDATE',
      endpoint: `/academic/faculties/${id}`,
      httpMethod: 'PUT',
      payload: { facultyId: id, changes: dto },
    });

    return Result.ok(updated);
  }

  async deleteFaculty(id: string, actorAccountId?: string): Promise<Result<boolean>> {
    const faculty = await this.facultiesRepository.findById(id);
    if (!faculty) {
      return Result.fail(AppError.notFound('Không tìm thấy khoa đào tạo cần xóa.'));
    }

    const { majorsCount, departmentsCount } = await this.facultiesRepository.countRelations(id);
    if (majorsCount > 0 || departmentsCount > 0) {
      return Result.fail(
        AppError.conflict(
          `Không thể xóa khoa vì vẫn còn ${majorsCount} ngành và ${departmentsCount} bộ môn trực thuộc. Vui lòng di chuyển hoặc xóa các dữ liệu con trước.`,
        ),
      );
    }

    await this.facultiesRepository.delete(id);

    this.auditLogsService.record({
      accountId: actorAccountId,
      action: 'FACULTY_DELETE',
      endpoint: `/academic/faculties/${id}`,
      httpMethod: 'DELETE',
      payload: { facultyId: id, code: faculty.code },
    });

    return Result.ok(true);
  }
}
