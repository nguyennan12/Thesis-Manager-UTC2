// ==============================================================================
// LECTURERS SERVICE (SRP: Lecturer Profile Management with Auto Account Creation)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { LecturersRepository } from '../repositories/lecturers.repository';
import { DepartmentsRepository } from '../../academic/repositories/departments.repository';
import { CreateLecturerDto, UpdateLecturerDto, QueryLecturerDto } from '../dto/lecturer.dto';
import { Result, AppError } from '../../../common/utils';
import { PaginationHelper } from '../../../common/helpers/pagination.helper';
import { AccountFactoryHelper } from '../helpers/account-factory.helper';
import { TransactionManager } from '../../../database/transaction-manager';
import { AuditLogsService } from '../../audit-logs/services/audit-logs.service';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class LecturersService {
  constructor(
    private readonly lecturersRepository: LecturersRepository,
    private readonly departmentsRepository: DepartmentsRepository,
    private readonly transactionManager: TransactionManager,
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async findAllLecturers(query: QueryLecturerDto): Promise<Result<any>> {
    const { page, limit, skip } = PaginationHelper.normalize(query.page, query.limit);

    const { items, total } = await this.lecturersRepository.findAll(
      { departmentId: query.departmentId, degree: query.degree, search: query.search },
      { skip, take: limit },
    );

    return Result.ok(PaginationHelper.paginate(items, total, page, limit));
  }

  async findLecturerById(id: string): Promise<Result<any>> {
    const lecturer = await this.lecturersRepository.findById(id);
    if (!lecturer) {
      return Result.fail(AppError.notFound('Không tìm thấy giảng viên tương ứng.'));
    }
    return Result.ok(lecturer);
  }

  async createLecturer(dto: CreateLecturerDto, actorAccountId?: string): Promise<Result<any>> {
    const dept = await this.departmentsRepository.findById(dto.departmentId);
    if (!dept) {
      return Result.fail(AppError.notFound('Bộ môn chỉ định không tồn tại.'));
    }

    const existingCode = await this.lecturersRepository.findByCode(dto.code.trim().toUpperCase());
    if (existingCode) {
      return Result.fail(AppError.conflict(`Mã giảng viên '${dto.code}' đã tồn tại trong hệ thống.`));
    }

    const existingEmail = await this.lecturersRepository.findByEmail(dto.email.trim().toLowerCase());
    if (existingEmail) {
      return Result.fail(AppError.conflict(`Email '${dto.email}' đã được sử dụng bởi giảng viên khác.`));
    }

    const lecturerRole = await this.prisma.role.findUnique({ where: { code: 'LECTURER' } });
    if (!lecturerRole) {
      return Result.fail(AppError.notFound('Vai trò LECTURER chưa được khởi tạo.'));
    }

    const accountData = await AccountFactoryHelper.createInitialAccount(dto.code, dto.email);

    const created = await this.transactionManager.run(async (tx) => {
      const lecturer = await tx.lecturer.create({
        data: {
          code: dto.code.trim().toUpperCase(),
          fullName: dto.fullName.trim(),
          email: dto.email.trim().toLowerCase(),
          phone: dto.phone?.trim(),
          degree: dto.degree?.trim(),
          departmentId: dto.departmentId,
          maxAdvisingQuota: dto.maxAdvisingQuota || 5,
          isActive: true,
        },
      });

      const account = await tx.account.create({
        data: {
          username: accountData.username,
          email: accountData.email,
          passwordHash: accountData.passwordHash,
          mustChangePassword: accountData.mustChangePassword,
          isActive: accountData.isActive,
          lecturerId: lecturer.id,
        },
      });

      await tx.accountRole.create({
        data: {
          accountId: account.id,
          roleId: lecturerRole.id,
          scopeType: 'DEPARTMENT',
          scopeId: dto.departmentId,
          isActive: true,
        },
      });

      return lecturer;
    });

    this.auditLogsService.record({
      accountId: actorAccountId,
      action: 'LECTURER_CREATE',
      endpoint: '/lecturers',
      httpMethod: 'POST',
      payload: { lecturerId: created.id, code: created.code, departmentId: dto.departmentId },
    });

    return Result.ok(created);
  }

  async updateLecturer(id: string, dto: UpdateLecturerDto, actorAccountId?: string): Promise<Result<any>> {
    const lecturer = await this.lecturersRepository.findById(id);
    if (!lecturer) {
      return Result.fail(AppError.notFound('Không tìm thấy giảng viên cần cập nhật.'));
    }

    if (dto.departmentId && dto.departmentId !== lecturer.departmentId) {
      const newDept = await this.departmentsRepository.findById(dto.departmentId);
      if (!newDept) {
        return Result.fail(AppError.notFound('Bộ môn mới chỉ định không tồn tại.'));
      }
    }

    const updated = await this.lecturersRepository.update(id, {
      fullName: dto.fullName?.trim(),
      email: dto.email?.trim().toLowerCase(),
      phone: dto.phone?.trim(),
      degree: dto.degree?.trim(),
      ...(dto.departmentId ? { department: { connect: { id: dto.departmentId } } } : {}),
      maxAdvisingQuota: dto.maxAdvisingQuota,
      isActive: dto.isActive,
    });

    this.auditLogsService.record({
      accountId: actorAccountId,
      action: 'LECTURER_UPDATE',
      endpoint: `/lecturers/${id}`,
      httpMethod: 'PUT',
      payload: { lecturerId: id, changes: dto },
    });

    return Result.ok(updated);
  }
}
