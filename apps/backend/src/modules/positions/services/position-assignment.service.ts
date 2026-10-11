// ==============================================================================
// POSITION ASSIGNMENT SERVICE (SRP: Position & Scope Assignment with Single Truth)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { PositionsRepository } from '../repositories/positions.repository';
import { AssignPositionDto, PositionType } from '../dto/position.dto';
import { Result, AppError } from '../../../common/utils';
import { TransactionManager } from '../../../database/transaction-manager';
import { AuditLogsService } from '../../audit-logs/services/audit-logs.service';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class PositionAssignmentService {
  constructor(
    private readonly positionsRepository: PositionsRepository,
    private readonly transactionManager: TransactionManager,
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  /**
   * Gán chức danh kèm phạm vi cho một tài khoản
   */
  async assignPosition(
    accountId: string,
    dto: AssignPositionDto,
    actorAccountId?: string,
  ): Promise<Result<any>> {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      include: {
        lecturer: {
          include: { department: true },
        },
      },
    });

    if (!account) {
      return Result.fail(AppError.notFound('Không tìm thấy tài khoản người dùng tương ứng.'));
    }

    if (dto.position === PositionType.HEAD_OF_DEPARTMENT) {
      if (!dto.scopeId) {
        return Result.fail(AppError.badRequest('Chức danh Trưởng bộ môn bắt buộc phải cung cấp scopeId là mã bộ môn.'));
      }
      if (!account.lecturerId) {
        return Result.fail(AppError.badRequest('Tài khoản này không liên kết với hồ sơ giảng viên, không thể làm Trưởng bộ môn.'));
      }

      const department = await this.prisma.department.findUnique({
        where: { id: dto.scopeId },
      });
      if (!department) {
        return Result.fail(AppError.notFound('Bộ môn chỉ định không tồn tại.'));
      }

      if (account.lecturer?.departmentId !== dto.scopeId) {
        return Result.fail(
          AppError.badRequest('Giảng viên phải thuộc đúng bộ môn mới có thể được bổ nhiệm làm Trưởng bộ môn này.'),
        );
      }

      const lecturerRole = await this.positionsRepository.findRoleByCode('LECTURER');
      if (!lecturerRole) {
        return Result.fail(AppError.notFound('Vai trò LECTURER chưa được khởi tạo trong hệ thống.'));
      }

      const createdAssignment = await this.transactionManager.run(async (tx) => {
        // Thu hồi HOD cũ nếu có
        if (department.headLecturerId && department.headLecturerId !== account.lecturerId) {
          const prevHeadAccount = await tx.account.findUnique({
            where: { lecturerId: department.headLecturerId },
          });
          if (prevHeadAccount) {
            await tx.accountRole.deleteMany({
              where: {
                accountId: prevHeadAccount.id,
                roleId: lecturerRole.id,
                scopeType: 'DEPARTMENT',
                scopeId: department.id,
              },
            });
          }
        }

        // Tạo assignment mới
        const assignment = await tx.accountRole.create({
          data: {
            accountId: account.id,
            roleId: lecturerRole.id,
            scopeType: 'DEPARTMENT',
            scopeId: department.id,
            isActive: true,
          },
        });

        // Đồng bộ headLecturerId trong department
        await tx.department.update({
          where: { id: department.id },
          data: { headLecturerId: account.lecturerId },
        });

        return assignment;
      });

      this.auditLogsService.record({
        accountId: actorAccountId,
        action: 'POSITION_ASSIGN',
        endpoint: `/users/${accountId}/positions`,
        httpMethod: 'POST',
        payload: { accountId, position: dto.position, scopeId: dto.scopeId },
      });

      return Result.ok(createdAssignment);
    }

    if (dto.position === PositionType.FACULTY_DEAN) {
      if (!dto.scopeId) {
        return Result.fail(AppError.badRequest('Chức danh Ban chủ nhiệm Khoa bắt buộc cung cấp scopeId là mã khoa.'));
      }
      if (!account.lecturerId) {
        return Result.fail(AppError.badRequest('Tài khoản phải là giảng viên mới có thể gán Ban chủ nhiệm Khoa.'));
      }

      const faculty = await this.prisma.faculty.findUnique({ where: { id: dto.scopeId } });
      if (!faculty) {
        return Result.fail(AppError.notFound('Khoa đào tạo chỉ định không tồn tại.'));
      }

      const lecturerRole = await this.positionsRepository.findRoleByCode('LECTURER');
      if (!lecturerRole) {
        return Result.fail(AppError.notFound('Vai trò LECTURER chưa tồn tại.'));
      }

      const assignment = await this.positionsRepository.createAssignment({
        accountId: account.id,
        roleId: lecturerRole.id,
        scopeType: 'FACULTY',
        scopeId: dto.scopeId,
        isActive: true,
      });

      this.auditLogsService.record({
        accountId: actorAccountId,
        action: 'POSITION_ASSIGN',
        endpoint: `/users/${accountId}/positions`,
        httpMethod: 'POST',
        payload: { accountId, position: dto.position, scopeId: dto.scopeId },
      });

      return Result.ok(assignment);
    }

    if (dto.position === PositionType.ACADEMIC_AFFAIRS) {
      if (!dto.scopeId) {
        return Result.fail(AppError.badRequest('Chức danh Giáo vụ Khoa bắt buộc cung cấp scopeId là mã khoa.'));
      }

      const staffRole = await this.positionsRepository.findRoleByCode('STAFF');
      if (!staffRole) {
        return Result.fail(AppError.notFound('Vai trò STAFF chưa tồn tại.'));
      }

      const assignment = await this.positionsRepository.createAssignment({
        accountId: account.id,
        roleId: staffRole.id,
        scopeType: 'FACULTY',
        scopeId: dto.scopeId,
        isActive: true,
      });

      this.auditLogsService.record({
        accountId: actorAccountId,
        action: 'POSITION_ASSIGN',
        endpoint: `/users/${accountId}/positions`,
        httpMethod: 'POST',
        payload: { accountId, position: dto.position, scopeId: dto.scopeId },
      });

      return Result.ok(assignment);
    }

    if (dto.position === PositionType.TRAINING_DEPT) {
      const staffRole = await this.positionsRepository.findRoleByCode('STAFF');
      if (!staffRole) {
        return Result.fail(AppError.notFound('Vai trò STAFF chưa tồn tại.'));
      }

      const assignment = await this.positionsRepository.createAssignment({
        accountId: account.id,
        roleId: staffRole.id,
        scopeType: 'GLOBAL',
        isActive: true,
      });

      this.auditLogsService.record({
        accountId: actorAccountId,
        action: 'POSITION_ASSIGN',
        endpoint: `/users/${accountId}/positions`,
        httpMethod: 'POST',
        payload: { accountId, position: dto.position },
      });

      return Result.ok(assignment);
    }

    return Result.fail(AppError.badRequest('Loại chức danh không được hỗ trợ.'));
  }

  /**
   * Thu hồi chức danh
   */
  async revokePosition(
    accountId: string,
    assignmentId: string,
    actorAccountId?: string,
  ): Promise<Result<boolean>> {
    const assignment = await this.positionsRepository.findAssignmentById(assignmentId);
    if (!assignment || assignment.accountId !== accountId) {
      return Result.fail(AppError.notFound('Không tìm thấy bản ghi chức danh tương ứng.'));
    }

    await this.transactionManager.run(async (tx) => {
      // Nếu là TBM, hủy headLecturerId trong department
      if (assignment.scopeType === 'DEPARTMENT' && assignment.scopeId) {
        await tx.department.updateMany({
          where: {
            id: assignment.scopeId,
            headLecturerId: assignment.account.lecturerId,
          },
          data: { headLecturerId: null },
        });
      }

      await tx.accountRole.delete({ where: { id: assignmentId } });
    });

    this.auditLogsService.record({
      accountId: actorAccountId,
      action: 'POSITION_REVOKE',
      endpoint: `/users/${accountId}/positions/${assignmentId}`,
      httpMethod: 'DELETE',
      payload: { accountId, assignmentId },
    });

    return Result.ok(true);
  }

  /**
   * Bổ nhiệm Trưởng bộ môn trực tiếp từ phía Bộ môn (Đồng bộ headLecturerId và AccountRole)
   */
  async assignDepartmentHead(
    departmentId: string,
    lecturerId: string,
    actorAccountId?: string,
  ): Promise<Result<any>> {
    const department = await this.prisma.department.findUnique({ where: { id: departmentId } });
    if (!department) {
      return Result.fail(AppError.notFound('Bộ môn chỉ định không tồn tại.'));
    }

    const lecturerAccount = await this.positionsRepository.findAccountByLecturerId(lecturerId);
    if (!lecturerAccount || !lecturerAccount.lecturer) {
      return Result.fail(AppError.notFound('Không tìm thấy tài khoản gắn liền với giảng viên này.'));
    }

    if (lecturerAccount.lecturer.departmentId !== departmentId) {
      return Result.fail(AppError.badRequest('Giảng viên không thuộc bộ môn này, không thể bổ nhiệm làm Trưởng bộ môn.'));
    }

    return this.assignPosition(
      lecturerAccount.id,
      {
        position: PositionType.HEAD_OF_DEPARTMENT,
        scopeType: 'DEPARTMENT',
        scopeId: departmentId,
      },
      actorAccountId,
    );
  }
}
