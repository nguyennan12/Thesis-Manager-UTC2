// ==============================================================================
// CLASSES SERVICE (SRP: Class Management with Scope Filtering & Result Pattern)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { ClassesRepository } from '../repositories/classes.repository';
import { MajorsRepository } from '../repositories/majors.repository';
import { CreateClassDto, UpdateClassDto, QueryClassDto } from '../dto/class.dto';
import { Result, AppError } from '../../../common/utils';
import { ScopeFilter, DataScopeHelper } from '../../../common/helpers/data-scope.helper';
import { AuditLogsService } from '../../audit-logs/services/audit-logs.service';

@Injectable()
export class ClassesService {
  constructor(
    private readonly classesRepository: ClassesRepository,
    private readonly majorsRepository: MajorsRepository,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async findAllClasses(query: QueryClassDto, scope?: ScopeFilter): Promise<Result<any[]>> {
    const classes = await this.classesRepository.findAll(
      { majorId: query.majorId, academicYear: query.academicYear, search: query.search },
      scope,
    );
    return Result.ok(classes);
  }

  async findClassById(id: string, scope?: ScopeFilter): Promise<Result<any>> {
    const cls = await this.classesRepository.findById(id);
    if (!cls) {
      return Result.fail(AppError.notFound('Không tìm thấy lớp sinh viên tương ứng.'));
    }

    if (scope && !scope.isGlobal && !DataScopeHelper.canAccessFaculty(scope, cls.major.facultyId)) {
      return Result.fail(AppError.forbidden('Bạn không có quyền truy cập lớp sinh viên thuộc khoa khác.'));
    }

    return Result.ok(cls);
  }

  async createClass(dto: CreateClassDto, scope?: ScopeFilter, actorAccountId?: string): Promise<Result<any>> {
    const major = await this.majorsRepository.findById(dto.majorId);
    if (!major) {
      return Result.fail(AppError.notFound('Ngành đào tạo chỉ định không tồn tại.'));
    }

    // Kiểm tra phạm vi phân quyền của Giáo vụ
    if (scope && !scope.isGlobal && !DataScopeHelper.canAccessFaculty(scope, major.facultyId)) {
      return Result.fail(AppError.forbidden('Bạn chỉ được phép tạo lớp sinh viên cho các ngành thuộc Khoa của mình.'));
    }

    const existing = await this.classesRepository.findByCode(dto.code.trim().toUpperCase());
    if (existing) {
      return Result.fail(AppError.conflict(`Mã lớp '${dto.code}' đã tồn tại trong hệ thống.`));
    }

    const created = await this.classesRepository.create({
      code: dto.code.trim().toUpperCase(),
      name: dto.name.trim(),
      academicYear: dto.academicYear.trim(),
      major: { connect: { id: dto.majorId } },
      ...(dto.homeroomAdvisorId ? { homeroomAdvisor: { connect: { id: dto.homeroomAdvisorId } } } : {}),
    });

    this.auditLogsService.record({
      accountId: actorAccountId,
      action: 'CLASS_CREATE',
      endpoint: '/academic/classes',
      httpMethod: 'POST',
      payload: { classId: created.id, code: created.code, majorId: dto.majorId },
    });

    return Result.ok(created);
  }

  async updateClass(id: string, dto: UpdateClassDto, scope?: ScopeFilter, actorAccountId?: string): Promise<Result<any>> {
    const cls = await this.classesRepository.findById(id);
    if (!cls) {
      return Result.fail(AppError.notFound('Không tìm thấy lớp sinh viên cần cập nhật.'));
    }

    if (scope && !scope.isGlobal && !DataScopeHelper.canAccessFaculty(scope, cls.major.facultyId)) {
      return Result.fail(AppError.forbidden('Bạn không có quyền chỉnh sửa lớp sinh viên của khoa khác.'));
    }

    if (dto.majorId && dto.majorId !== cls.majorId) {
      const newMajor = await this.majorsRepository.findById(dto.majorId);
      if (!newMajor) {
        return Result.fail(AppError.notFound('Ngành đào tạo mới chỉ định không tồn tại.'));
      }
      if (scope && !scope.isGlobal && !DataScopeHelper.canAccessFaculty(scope, newMajor.facultyId)) {
        return Result.fail(AppError.forbidden('Không thể chuyển lớp sang ngành thuộc khoa bạn không quản lý.'));
      }
    }

    const updated = await this.classesRepository.update(id, {
      name: dto.name?.trim(),
      academicYear: dto.academicYear?.trim(),
      ...(dto.majorId ? { major: { connect: { id: dto.majorId } } } : {}),
      ...(dto.homeroomAdvisorId
        ? { homeroomAdvisor: { connect: { id: dto.homeroomAdvisorId } } }
        : dto.homeroomAdvisorId === null
          ? { homeroomAdvisor: { disconnect: true } }
          : {}),
    });

    this.auditLogsService.record({
      accountId: actorAccountId,
      action: 'CLASS_UPDATE',
      endpoint: `/academic/classes/${id}`,
      httpMethod: 'PUT',
      payload: { classId: id, changes: dto },
    });

    return Result.ok(updated);
  }

  async deleteClass(id: string, scope?: ScopeFilter, actorAccountId?: string): Promise<Result<boolean>> {
    const cls = await this.classesRepository.findById(id);
    if (!cls) {
      return Result.fail(AppError.notFound('Không tìm thấy lớp sinh viên cần xóa.'));
    }

    if (scope && !scope.isGlobal && !DataScopeHelper.canAccessFaculty(scope, cls.major.facultyId)) {
      return Result.fail(AppError.forbidden('Bạn không có quyền xóa lớp sinh viên của khoa khác.'));
    }

    const studentsCount = await this.classesRepository.countStudents(id);
    if (studentsCount > 0) {
      return Result.fail(
        AppError.conflict(
          `Không thể xóa lớp '${cls.name}' vì vẫn còn ${studentsCount} sinh viên trong lớp. Vui lòng chuyển hoặc xóa sinh viên trước.`,
        ),
      );
    }

    await this.classesRepository.delete(id);

    this.auditLogsService.record({
      accountId: actorAccountId,
      action: 'CLASS_DELETE',
      endpoint: `/academic/classes/${id}`,
      httpMethod: 'DELETE',
      payload: { classId: id, code: cls.code },
    });

    return Result.ok(true);
  }
}
