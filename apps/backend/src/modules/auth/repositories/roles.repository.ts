// ==============================================================================
// ROLES REPOSITORY (Data Access Layer for Roles & Role Permissions)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class RolesRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lấy danh sách toàn bộ roles cùng phân quyền và số lượng tài khoản được gán
   */
  async findAll() {
    return this.prisma.role.findMany({
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: { accountRoles: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Lấy toàn bộ roles đang active kèm mã permission phục vụ RbacCacheService
   */
  async findAllActiveWithPermissions() {
    return this.prisma.role.findMany({
      where: { isActive: true },
      include: {
        rolePermissions: {
          include: {
            permission: {
              select: { code: true },
            },
          },
        },
      },
    });
  }

  /**
   * Tìm role theo ID kèm danh sách quyền
   */
  async findById(id: string) {
    return this.prisma.role.findUnique({
      where: { id },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  /**
   * Tìm role theo mã code
   */
  async findByCode(code: string) {
    return this.prisma.role.findUnique({
      where: { code },
    });
  }

  /**
   * Tạo mới role tùy chỉnh
   */
  async create(data: { code: string; name: string; description?: string }) {
    return this.prisma.role.create({
      data: {
        code: data.code,
        name: data.name,
        description: data.description,
        isSystem: false,
        isActive: true,
      },
    });
  }

  /**
   * Cập nhật thông tin role
   */
  async update(id: string, data: { name?: string; description?: string; isActive?: boolean }) {
    return this.prisma.role.update({
      where: { id },
      data,
    });
  }

  /**
   * Gán danh sách quyền cho vai trò trong một transaction
   */
  async assignPermissions(roleId: string, permissionIds: string[]) {
    return this.prisma.$transaction([
      this.prisma.rolePermission.deleteMany({
        where: { roleId },
      }),
      this.prisma.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({
          roleId,
          permissionId,
        })),
      }),
    ]);
  }
}
