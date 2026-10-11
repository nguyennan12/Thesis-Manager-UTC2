// ==============================================================================
// DEPARTMENTS SERVICE (SRP: Department Management with Result Pattern)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { DepartmentsRepository } from '../repositories/departments.repository';
import { FacultiesRepository } from '../repositories/faculties.repository';
import { CreateDepartmentDto, UpdateDepartmentDto, QueryDepartmentDto } from '../dto/department.dto';
import { Result, AppError } from '../../../common/utils';
import { AuditLogsService } from '../../audit-logs/services/audit-logs.service';

@Injectable()
export class DepartmentsService {
  constructor(
    private readonly departmentsRepository: DepartmentsRepository,
    private readonly facultiesRepository: FacultiesRepository,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async findAllDepartments(query: QueryDepartmentDto): Promise<Result<any[]>> {
    const departments = await this.departmentsRepository.findAll(query.facultyId, query.search);
    return Result.ok(departments);
  }

  async findDepartmentById(id: string): Promise<Result<any>> {
    const department = await this.departmentsRepository.findById(id);
    if (!department) {
      return Result.fail(AppError.notFound('Không tìm thấy bộ môn tương ứng.'));
    }
    return Result.ok(department);
  }

  async createDepartment(dto: CreateDepartmentDto, actorAccountId?: string): Promise<Result<any>> {
    const faculty = await this.facultiesRepository.findById(dto.facultyId);
    if (!faculty) {
      return Result.fail(AppError.notFound('Khoa đào tạo chỉ định không tồn tại.'));
    }

    const existing = await this.departmentsRepository.findByCode(dto.code.trim().toUpperCase());
    if (existing) {
      return Result.fail(AppError.conflict(`Mã bộ môn '${dto.code}' đã tồn tại trong hệ thống.`));
    }

    const created = await this.departmentsRepository.create({
      code: dto.code.trim().toUpperCase(),
      name: dto.name.trim(),
      faculty: { connect: { id: dto.facultyId } },
    });

    this.auditLogsService.record({
      accountId: actorAccountId,
      action: 'DEPARTMENT_CREATE',
      endpoint: '/academic/departments',
      httpMethod: 'POST',
      payload: { departmentId: created.id, code: created.code, facultyId: dto.facultyId },
    });

    return Result.ok(created);
  }

  async updateDepartment(id: string, dto: UpdateDepartmentDto, actorAccountId?: string): Promise<Result<any>> {
    const department = await this.departmentsRepository.findById(id);
    if (!department) {
      return Result.fail(AppError.notFound('Không tìm thấy bộ môn cần cập nhật.'));
    }

    if (dto.facultyId) {
      const faculty = await this.facultiesRepository.findById(dto.facultyId);
      if (!faculty) {
        return Result.fail(AppError.notFound('Khoa đào tạo mới chỉ định không tồn tại.'));
      }
    }

    const updated = await this.departmentsRepository.update(id, {
      name: dto.name?.trim(),
      ...(dto.facultyId ? { faculty: { connect: { id: dto.facultyId } } } : {}),
    });

    this.auditLogsService.record({
      accountId: actorAccountId,
      action: 'DEPARTMENT_UPDATE',
      endpoint: `/academic/departments/${id}`,
      httpMethod: 'PUT',
      payload: { departmentId: id, changes: dto },
    });

    return Result.ok(updated);
  }

  async deleteDepartment(id: string, actorAccountId?: string): Promise<Result<boolean>> {
    const department = await this.departmentsRepository.findById(id);
    if (!department) {
      return Result.fail(AppError.notFound('Không tìm thấy bộ môn cần xóa.'));
    }

    const { lecturersCount, topicsCount, councilsCount } = await this.departmentsRepository.countRelations(id);
    if (lecturersCount > 0 || topicsCount > 0 || councilsCount > 0) {
      return Result.fail(
        AppError.conflict(
          `Không thể xóa bộ môn vì vẫn còn ${lecturersCount} giảng viên, ${topicsCount} đề tài hoặc ${councilsCount} hội đồng liên kết. Vui lòng di chuyển hoặc xóa dữ liệu con trước.`,
        ),
      );
    }

    await this.departmentsRepository.delete(id);

    this.auditLogsService.record({
      accountId: actorAccountId,
      action: 'DEPARTMENT_DELETE',
      endpoint: `/academic/departments/${id}`,
      httpMethod: 'DELETE',
      payload: { departmentId: id, code: department.code },
    });

    return Result.ok(true);
  }
}
