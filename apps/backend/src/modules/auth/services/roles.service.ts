// ==============================================================================
// ROLES SERVICE (SRP: Custom Role Management with Result Pattern & Cache Invalidation)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { RolesRepository } from '../repositories/roles.repository';
import { PermissionsRepository } from '../repositories/permissions.repository';
import { AccountsRepository } from '../repositories/accounts.repository';
import { RbacCacheService } from './rbac-cache.service';
import { AuditLogsService } from '../../audit-logs/services/audit-logs.service';
import { CreateRoleDto, UpdateRoleDto, AssignPermissionsDto, AssignAccountRoleDto } from '../dto';
import { Result, AppError } from '../../../common/utils';

@Injectable()
export class RolesService {
  constructor(
    private readonly rolesRepository: RolesRepository,
    private readonly permissionsRepository: PermissionsRepository,
    private readonly accountsRepository: AccountsRepository,
    private readonly rbacCacheService: RbacCacheService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  /**
   * Lấy danh sách toàn bộ các vai trò trong hệ thống kèm số lượng quyền
   */
  async findAllRoles(): Promise<Result<any[]>> {
    const roles = await this.rolesRepository.findAll();

    const formatted = roles.map((role) => ({
      id: role.id,
      code: role.code,
      name: role.name,
      description: role.description,
      isSystem: role.isSystem,
      isActive: role.isActive,
      assignedUsersCount: role._count.accountRoles,
      permissions: role.rolePermissions.map((rp) => ({
        id: rp.permission.id,
        code: rp.permission.code,
        name: rp.permission.name,
        module: rp.permission.module,
      })),
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    }));

    return Result.ok(formatted);
  }

  /**
   * Xem chi tiết một vai trò
   */
  async findRoleById(id: string): Promise<Result<any>> {
    const role = await this.rolesRepository.findById(id);

    if (!role) {
      return Result.fail(AppError.notFound('Không tìm thấy vai trò tương ứng.'));
    }

    return Result.ok({
      id: role.id,
      code: role.code,
      name: role.name,
      description: role.description,
      isSystem: role.isSystem,
      isActive: role.isActive,
      permissions: role.rolePermissions.map((rp) => rp.permission),
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    });
  }

  /**
   * Tạo mới một vai trò tùy chỉnh
   */
  async createRole(dto: CreateRoleDto, actorAccountId?: string): Promise<Result<any>> {
    const existing = await this.rolesRepository.findByCode(dto.code);

    if (existing) {
      return Result.fail(
        AppError.conflict(`Mã vai trò '${dto.code}' đã tồn tại.`),
      );
    }

    const created = await this.rolesRepository.create({
      code: dto.code,
      name: dto.name,
      description: dto.description,
    });

    // Cập nhật lại RBAC cache
    await this.rbacCacheService.reloadCache();

    this.auditLogsService.logEvent({
      accountId: actorAccountId,
      action: 'ROLES_CREATE',
      endpoint: '/api/v1/roles',
      httpMethod: 'POST',
      payload: dto,
      responseStatus: 201,
    });

    return Result.ok(created);
  }

  /**
   * Cập nhật thông tin vai trò
   */
  async updateRole(id: string, dto: UpdateRoleDto, actorAccountId?: string): Promise<Result<any>> {
    const role = await this.rolesRepository.findById(id);
    if (!role) {
      return Result.fail(AppError.notFound('Không tìm thấy vai trò cần cập nhật.'));
    }

    const updated = await this.rolesRepository.update(id, {
      name: dto.name ?? role.name,
      description: dto.description ?? role.description,
    });

    // Cập nhật lại RBAC cache
    await this.rbacCacheService.reloadCache();

    this.auditLogsService.logEvent({
      accountId: actorAccountId,
      action: 'ROLES_UPDATE',
      endpoint: `/api/v1/roles/${id}`,
      httpMethod: 'PUT',
      payload: dto,
      responseStatus: 200,
    });

    return Result.ok(updated);
  }

  /**
   * Gán danh sách quyền cho vai trò (có khử trùng lặp ID & Invalidate Cache)
   */
  async assignPermissionsToRole(
    roleId: string,
    dto: AssignPermissionsDto,
    actorAccountId?: string,
  ): Promise<Result<{ message: string }>> {
    const role = await this.rolesRepository.findById(roleId);
    if (!role) {
      return Result.fail(AppError.notFound('Không tìm thấy vai trò cần gán quyền.'));
    }

    // Khử trùng lặp ID trước khi kiểm tra và gán
    const uniqueIds = Array.from(new Set(dto.permissionIds));

    // Kiểm tra tất cả unique permissionIds có tồn tại trong CSDL không
    const permissions = await this.permissionsRepository.findByIds(uniqueIds);

    if (permissions.length !== uniqueIds.length) {
      return Result.fail(
        AppError.badRequest('Một hoặc nhiều ID quyền không tồn tại trong hệ thống.'),
      );
    }

    await this.rolesRepository.assignPermissions(roleId, uniqueIds);

    // Tự động làm mới Redis Sets ngay lập tức để quyền mới có hiệu lực ngay
    await this.rbacCacheService.reloadCache();

    this.auditLogsService.logEvent({
      accountId: actorAccountId,
      action: 'ROLES_ASSIGN_PERMISSIONS',
      endpoint: `/api/v1/roles/${roleId}/permissions`,
      httpMethod: 'POST',
      payload: { roleId, permissionsCount: uniqueIds.length },
      responseStatus: 200,
    });

    return Result.ok({
      message: `Đã cập nhật ${uniqueIds.length} quyền cho vai trò ${role.name}.`,
    });
  }

  /**
   * Gán vai trò / chức vụ cho tài khoản người dùng kèm phạm vi Scope và thời hạn
   */
  async assignRoleToAccount(
    accountId: string,
    dto: AssignAccountRoleDto,
    actorAccountId?: string,
  ): Promise<Result<{ message: string }>> {
    const account = await this.accountsRepository.findById(accountId);
    if (!account) {
      return Result.fail(AppError.notFound('Không tìm thấy tài khoản người dùng.'));
    }

    const role = await this.rolesRepository.findById(dto.roleId);
    if (!role) {
      return Result.fail(AppError.notFound('Không tìm thấy vai trò tương ứng.'));
    }

    await this.accountsRepository.assignRoleToAccount({
      accountId,
      roleId: dto.roleId,
      scopeType: dto.scopeType,
      scopeId: dto.scopeId,
      validFrom: dto.validFrom ? new Date(dto.validFrom) : undefined,
      validTo: dto.validTo ? new Date(dto.validTo) : undefined,
    });

    // Invalidate cache tài khoản để nạp lại vai trò mới
    await this.rbacCacheService.invalidateAccount(accountId);

    this.auditLogsService.logEvent({
      accountId: actorAccountId,
      action: 'ROLES_ASSIGN_ACCOUNT',
      endpoint: `/api/v1/roles/accounts/${accountId}/assign`,
      httpMethod: 'POST',
      payload: { targetAccountId: accountId, roleCode: role.code, scope: dto.scopeType },
      responseStatus: 200,
    });

    return Result.ok({
      message: `Đã gán vai trò ${role.name} cho tài khoản ${account.username} thành công.`,
    });
  }
}
