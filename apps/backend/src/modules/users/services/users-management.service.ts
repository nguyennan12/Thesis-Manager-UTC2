// ==============================================================================
// USERS MANAGEMENT SERVICE (SRP: User Account Lifecycle, Status & Password Reset)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { AccountsManagementRepository } from '../repositories/accounts-management.repository';
import { CreateUserDto, QueryUserDto } from '../dto/user.dto';
import { Result, AppError } from '../../../common/utils';
import { PaginationHelper } from '../../../common/helpers/pagination.helper';
import { AccountFactoryHelper } from '../helpers/account-factory.helper';
import { TransactionManager } from '../../../database/transaction-manager';
import { RedisService } from '../../../database/redis/redis.service';
import { AuditLogsService } from '../../audit-logs/services/audit-logs.service';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class UsersManagementService {
  constructor(
    private readonly accountsRepository: AccountsManagementRepository,
    private readonly transactionManager: TransactionManager,
    private readonly redisService: RedisService,
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async findAllUsers(query: QueryUserDto): Promise<Result<any>> {
    const { page, limit, skip } = PaginationHelper.normalize(query.page, query.limit);

    const { items, total } = await this.accountsRepository.findAll(
      { role: query.role, isActive: query.isActive, search: query.search },
      { skip, take: limit },
    );

    const formatted = items.map((acc) => ({
      id: acc.id,
      username: acc.username,
      email: acc.email,
      isActive: acc.isActive,
      mustChangePassword: acc.mustChangePassword,
      lastLoginAt: acc.lastLoginAt,
      roles: acc.accountRoles.map((ar) => ({
        code: ar.role.code,
        name: ar.role.name,
        scopeType: ar.scopeType,
        scopeId: ar.scopeId,
      })),
      linkedProfile: acc.student
        ? { type: 'STUDENT', code: acc.student.code, fullName: acc.student.fullName }
        : acc.lecturer
          ? { type: 'LECTURER', code: acc.lecturer.code, fullName: acc.lecturer.fullName }
          : null,
      createdAt: acc.createdAt,
    }));

    return Result.ok(PaginationHelper.paginate(formatted, total, page, limit));
  }

  async findUserById(id: string): Promise<Result<any>> {
    const acc = await this.accountsRepository.findById(id);
    if (!acc) {
      return Result.fail(AppError.notFound('Không tìm thấy tài khoản người dùng tương ứng.'));
    }

    return Result.ok({
      id: acc.id,
      username: acc.username,
      email: acc.email,
      isActive: acc.isActive,
      mustChangePassword: acc.mustChangePassword,
      lastLoginAt: acc.lastLoginAt,
      roles: acc.accountRoles.map((ar) => ({
        id: ar.id,
        code: ar.role.code,
        name: ar.role.name,
        scopeType: ar.scopeType,
        scopeId: ar.scopeId,
      })),
      student: acc.student,
      lecturer: acc.lecturer,
      createdAt: acc.createdAt,
    });
  }

  async createUser(dto: CreateUserDto, actorAccountId?: string): Promise<Result<any>> {
    const existingUsername = await this.accountsRepository.findByUsername(dto.username.trim().toLowerCase());
    if (existingUsername) {
      return Result.fail(AppError.conflict(`Tên đăng nhập '${dto.username}' đã tồn tại.`));
    }

    const existingEmail = await this.accountsRepository.findByEmail(dto.email.trim().toLowerCase());
    if (existingEmail) {
      return Result.fail(AppError.conflict(`Email '${dto.email}' đã được sử dụng bởi tài khoản khác.`));
    }

    const role = await this.prisma.role.findUnique({ where: { code: dto.role } });
    if (!role) {
      return Result.fail(AppError.notFound(`Vai trò '${dto.role}' không tồn tại.`));
    }

    const rawPassword = dto.password || AccountFactoryHelper.getDefaultInitialPassword();
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    const created = await this.transactionManager.run(async (tx) => {
      const account = await tx.account.create({
        data: {
          username: dto.username.trim().toLowerCase(),
          email: dto.email.trim().toLowerCase(),
          passwordHash,
          mustChangePassword: !dto.password,
          isActive: true,
          studentId: dto.studentId,
          lecturerId: dto.lecturerId,
        },
      });

      await tx.accountRole.create({
        data: {
          accountId: account.id,
          roleId: role.id,
          scopeType: 'GLOBAL',
          isActive: true,
        },
      });

      return account;
    });

    this.auditLogsService.record({
      accountId: actorAccountId,
      action: 'USER_CREATE',
      endpoint: '/users',
      httpMethod: 'POST',
      payload: { accountId: created.id, username: created.username, role: dto.role },
    });

    return Result.ok(created);
  }

  async updateUserStatus(id: string, isActive: boolean, actorAccountId?: string): Promise<Result<any>> {
    const account = await this.accountsRepository.findById(id);
    if (!account) {
      return Result.fail(AppError.notFound('Không tìm thấy tài khoản cần cập nhật trạng thái.'));
    }

    const updated = await this.accountsRepository.updateStatus(id, isActive);

    // Nếu khóa tài khoản: Xóa phiên trên Redis
    if (!isActive) {
      await this.redisService.del(`session:${id}`);
      await this.redisService.del(`refresh_token:${id}`);
    }

    this.auditLogsService.record({
      accountId: actorAccountId,
      action: 'USER_STATUS_CHANGE',
      endpoint: `/users/${id}/status`,
      httpMethod: 'PATCH',
      payload: { accountId: id, isActive },
    });

    return Result.ok(updated);
  }

  async resetPassword(id: string, actorAccountId?: string): Promise<Result<any>> {
    const account = await this.accountsRepository.findById(id);
    if (!account) {
      return Result.fail(AppError.notFound('Không tìm thấy tài khoản cần đặt lại mật khẩu.'));
    }

    const defaultPassword = AccountFactoryHelper.getDefaultInitialPassword();
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    const updated = await this.accountsRepository.updatePassword(id, passwordHash, true);

    // Thu hồi phiên cũ trên Redis
    await this.redisService.del(`session:${id}`);
    await this.redisService.del(`refresh_token:${id}`);

    this.auditLogsService.record({
      accountId: actorAccountId,
      action: 'USER_PASSWORD_RESET',
      endpoint: `/users/${id}/reset-password`,
      httpMethod: 'POST',
      payload: { accountId: id, username: account.username },
    });

    return Result.ok({
      message: 'Đặt lại mật khẩu thành công về mật khẩu khởi tạo mặc định.',
      mustChangePassword: true,
    });
  }
}
