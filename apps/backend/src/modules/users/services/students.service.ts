// ==============================================================================
// STUDENTS SERVICE (SRP: Student Profile Management with Auto Account Creation)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { StudentsRepository } from '../repositories/students.repository';
import { ClassesRepository } from '../../academic/repositories/classes.repository';
import { CreateStudentDto, UpdateStudentDto, QueryStudentDto } from '../dto/student.dto';
import { Result, AppError } from '../../../common/utils';
import { ScopeFilter, DataScopeHelper } from '../../../common/helpers/data-scope.helper';
import { PaginationHelper } from '../../../common/helpers/pagination.helper';
import { AccountFactoryHelper } from '../helpers/account-factory.helper';
import { TransactionManager } from '../../../database/transaction-manager';
import { AuditLogsService } from '../../audit-logs/services/audit-logs.service';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class StudentsService {
  constructor(
    private readonly studentsRepository: StudentsRepository,
    private readonly classesRepository: ClassesRepository,
    private readonly transactionManager: TransactionManager,
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async findAllStudents(query: QueryStudentDto, scope?: ScopeFilter): Promise<Result<any>> {
    const { page, limit, skip } = PaginationHelper.normalize(query.page, query.limit);

    const { items, total } = await this.studentsRepository.findAll(
      { classId: query.classId, status: query.status, search: query.search },
      scope,
      { skip, take: limit },
    );

    return Result.ok(PaginationHelper.paginate(items, total, page, limit));
  }

  async findStudentById(
    id: string,
    scope?: ScopeFilter,
    callerStudentId?: string,
  ): Promise<Result<any>> {
    const student = await this.studentsRepository.findById(id);
    if (!student) {
      return Result.fail(AppError.notFound('Không tìm thấy hồ sơ sinh viên tương ứng.'));
    }

    // Nếu người gọi là sinh viên: chỉ được xem hồ sơ của chính mình
    if (callerStudentId && callerStudentId !== id) {
      return Result.fail(AppError.forbidden('Sinh viên chỉ được phép xem hồ sơ của chính mình.'));
    }

    // Nếu người gọi là Giáo vụ: phải thuộc cùng Khoa
    if (scope && !scope.isGlobal && !DataScopeHelper.canAccessFaculty(scope, student.class.major.facultyId)) {
      return Result.fail(AppError.forbidden('Bạn không có quyền truy cập hồ sơ sinh viên thuộc khoa khác.'));
    }

    return Result.ok(student);
  }

  async createStudent(
    dto: CreateStudentDto,
    scope?: ScopeFilter,
    actorAccountId?: string,
  ): Promise<Result<any>> {
    const cls = await this.classesRepository.findById(dto.classId);
    if (!cls) {
      return Result.fail(AppError.notFound('Lớp sinh viên chỉ định không tồn tại.'));
    }

    if (scope && !scope.isGlobal && !DataScopeHelper.canAccessFaculty(scope, cls.major.facultyId)) {
      return Result.fail(AppError.forbidden('Bạn không thể tạo sinh viên cho lớp thuộc khoa bạn không quản lý.'));
    }

    const existingCode = await this.studentsRepository.findByCode(dto.code.trim().toUpperCase());
    if (existingCode) {
      return Result.fail(AppError.conflict(`Mã sinh viên '${dto.code}' đã tồn tại trong hệ thống.`));
    }

    const existingEmail = await this.studentsRepository.findByEmail(dto.email.trim().toLowerCase());
    if (existingEmail) {
      return Result.fail(AppError.conflict(`Email sinh viên '${dto.email}' đã được đăng ký.`));
    }

    const studentRole = await this.prisma.role.findUnique({ where: { code: 'STUDENT' } });
    if (!studentRole) {
      return Result.fail(AppError.notFound('Vai trò STUDENT chưa được khởi tạo.'));
    }

    const accountData = await AccountFactoryHelper.createInitialAccount(dto.code, dto.email);

    const created = await this.transactionManager.run(async (tx) => {
      const student = await tx.student.create({
        data: {
          code: dto.code.trim().toUpperCase(),
          fullName: dto.fullName.trim(),
          gender: (dto.gender as any) || 'OTHER',
          dob: dto.dob ? new Date(dto.dob) : null,
          email: dto.email.trim().toLowerCase(),
          phone: dto.phone?.trim(),
          classId: dto.classId,
          gpaCumulative: dto.gpaCumulative !== undefined ? dto.gpaCumulative : 0.0,
          creditsAccumulated: dto.creditsAccumulated !== undefined ? dto.creditsAccumulated : 0,
        },
      });

      const account = await tx.account.create({
        data: {
          username: accountData.username,
          email: accountData.email,
          passwordHash: accountData.passwordHash,
          mustChangePassword: accountData.mustChangePassword,
          isActive: accountData.isActive,
          studentId: student.id,
        },
      });

      await tx.accountRole.create({
        data: {
          accountId: account.id,
          roleId: studentRole.id,
          scopeType: 'GLOBAL',
          isActive: true,
        },
      });

      return student;
    });

    this.auditLogsService.record({
      accountId: actorAccountId,
      action: 'STUDENT_CREATE',
      endpoint: '/students',
      httpMethod: 'POST',
      payload: { studentId: created.id, code: created.code, classId: dto.classId },
    });

    return Result.ok(created);
  }

  async updateStudent(
    id: string,
    dto: UpdateStudentDto,
    scope?: ScopeFilter,
    actorAccountId?: string,
  ): Promise<Result<any>> {
    const student = await this.studentsRepository.findById(id);
    if (!student) {
      return Result.fail(AppError.notFound('Không tìm thấy sinh viên cần cập nhật.'));
    }

    if (scope && !scope.isGlobal && !DataScopeHelper.canAccessFaculty(scope, student.class.major.facultyId)) {
      return Result.fail(AppError.forbidden('Bạn không có quyền chỉnh sửa hồ sơ sinh viên thuộc khoa khác.'));
    }

    if (dto.classId && dto.classId !== student.classId) {
      const newClass = await this.classesRepository.findById(dto.classId);
      if (!newClass) {
        return Result.fail(AppError.notFound('Lớp sinh viên mới chỉ định không tồn tại.'));
      }
      if (scope && !scope.isGlobal && !DataScopeHelper.canAccessFaculty(scope, newClass.major.facultyId)) {
        return Result.fail(AppError.forbidden('Không thể chuyển sinh viên sang lớp của khoa khác.'));
      }
    }

    const updated = await this.studentsRepository.update(id, {
      fullName: dto.fullName?.trim(),
      gender: dto.gender as any,
      dob: dto.dob ? new Date(dto.dob) : undefined,
      email: dto.email?.trim().toLowerCase(),
      phone: dto.phone?.trim(),
      ...(dto.classId ? { class: { connect: { id: dto.classId } } } : {}),
      gpaCumulative: dto.gpaCumulative,
      creditsAccumulated: dto.creditsAccumulated,
      status: dto.status as any,
    });

    this.auditLogsService.record({
      accountId: actorAccountId,
      action: 'STUDENT_UPDATE',
      endpoint: `/students/${id}`,
      httpMethod: 'PUT',
      payload: { studentId: id, changes: dto },
    });

    return Result.ok(updated);
  }
}
