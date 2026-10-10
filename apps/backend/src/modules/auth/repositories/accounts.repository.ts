// ==============================================================================
// ACCOUNTS REPOSITORY (Data Access Layer for Accounts)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class AccountsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Tìm kiếm tài khoản qua username, email, mã sinh viên hoặc mã giảng viên
   * Có lọc thời hạn hiệu lực của Role (validTo >= NOW() hoặc validTo IS NULL)
   */
  async findByIdentifier(identifier: string) {
    const now = new Date();
    return this.prisma.account.findFirst({
      where: {
        OR: [
          { username: identifier },
          { email: identifier },
          { student: { code: identifier } },
          { lecturer: { code: identifier } },
        ],
      },
      include: {
        accountRoles: {
          where: {
            isActive: true,
            OR: [
              { validTo: null },
              { validTo: { gte: now } },
            ],
          },
          include: { role: true },
        },
        student: { include: { class: { include: { major: true } } } },
        lecturer: { include: { department: { include: { faculty: true } } } },
      },
    });
  }

  /**
   * Tìm kiếm tài khoản qua Account ID đầy đủ quan hệ có lọc hạn Role
   */
  async findById(id: string) {
    const now = new Date();
    return this.prisma.account.findUnique({
      where: { id },
      include: {
        accountRoles: {
          where: {
            isActive: true,
            OR: [
              { validTo: null },
              { validTo: { gte: now } },
            ],
          },
          include: { role: true },
        },
        student: { include: { class: { include: { major: true } } } },
        lecturer: { include: { department: { include: { faculty: true } } } },
      },
    });
  }

  /**
   * Lấy danh sách Roles của tài khoản có lọc thời hạn hiệu lực (phục vụ Dynamic RBAC)
   */
  async findActiveRolesByAccountId(id: string) {
    const now = new Date();
    const account = await this.prisma.account.findUnique({
      where: { id },
      select: {
        accountRoles: {
          where: {
            isActive: true,
            OR: [
              { validTo: null },
              { validTo: { gte: now } },
            ],
          },
          select: {
            role: {
              select: { code: true },
            },
          },
        },
      },
    });

    return account?.accountRoles.map((ar) => ar.role.code) || [];
  }

  /**
   * Kiểm tra nhanh trạng thái isActive của tài khoản (phục vụ RbacCacheService)
   */
  async findAccountStatus(id: string) {
    return this.prisma.account.findUnique({
      where: { id },
      select: {
        id: true,
        isActive: true,
      },
    });
  }

  /**
   * Tìm kiếm tài khoản qua email
   */
  async findByEmail(email: string) {
    return this.prisma.account.findUnique({
      where: { email },
    });
  }

  /**
   * Cập nhật thông tin đăng nhập thành công (refresh token + lastLoginAt)
   */
  async updateLoginSession(id: string, refreshTokenHash: string) {
    return this.prisma.account.update({
      where: { id },
      data: {
        refreshTokenHash,
        lastLoginAt: new Date(),
      },
    });
  }

  /**
   * Cập nhật Refresh Token Hash (dùng cho Token Rotation hoặc Thu hồi)
   */
  async updateRefreshTokenHash(id: string, refreshTokenHash: string | null) {
    return this.prisma.account.update({
      where: { id },
      data: {
        refreshTokenHash,
        lastLoginAt: new Date(),
      },
    });
  }

  /**
   * Cập nhật mật khẩu mới và thu hồi token phiên cũ
   */
  async updatePassword(id: string, passwordHash: string) {
    return this.prisma.account.update({
      where: { id },
      data: {
        passwordHash,
        refreshTokenHash: null,
      },
    });
  }

  /**
   * Gán vai trò hoặc chức vụ mới cho tài khoản kèm phạm vi và thời hạn
   */
  async assignRoleToAccount(data: {
    accountId: string;
    roleId: string;
    scopeType?: string;
    scopeId?: string;
    validFrom?: Date;
    validTo?: Date;
  }) {
    return this.prisma.accountRole.create({
      data: {
        accountId: data.accountId,
        roleId: data.roleId,
        scopeType: data.scopeType,
        scopeId: data.scopeId,
        validFrom: data.validFrom,
        validTo: data.validTo,
        isActive: true,
      },
    });
  }
}
