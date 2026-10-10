// ==============================================================================
// RBAC REDIS CACHE SERVICE (Self-Healing & Non-Blocking Distributed Cache)
// ==============================================================================

import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { RedisService } from '../../../database/redis/redis.service';
import { RolesRepository } from '../repositories/roles.repository';
import { AccountsRepository } from '../repositories/accounts.repository';

@Injectable()
export class RbacCacheService implements OnModuleInit {
  private readonly logger = new Logger(RbacCacheService.name);

  // Redis Key Prefixes
  private readonly PREFIX_ROLE_PERMS = 'rbac:role:';
  private readonly PREFIX_ACCOUNT_ACTIVE = 'rbac:account:';
  private readonly KEY_TRACKED_ROLES = 'rbac:roles:tracked_list';

  constructor(
    private readonly redisService: RedisService,
    private readonly rolesRepository: RolesRepository,
    private readonly accountsRepository: AccountsRepository,
  ) {}

  /**
   * Tự động đồng bộ toàn bộ ma trận Role - Permissions lên Redis khi khởi động server
   */
  async onModuleInit() {
    await this.reloadCache();
  }

  /**
   * Tải toàn bộ dữ liệu phân quyền từ CSDL và lưu trực tiếp vào Redis Sets (Non-blocking O(1))
   */
  async reloadCache(): Promise<void> {
    const startTime = Date.now();
    try {
      const roles = await this.rolesRepository.findAllActiveWithPermissions();

      // 1. Xóa các key role permissions cũ an toàn (Không dùng KEYS *)
      const trackedRoles = await this.redisService.smembers(this.KEY_TRACKED_ROLES);
      if (trackedRoles.length > 0) {
        const oldKeys = trackedRoles.map((r) => `${this.PREFIX_ROLE_PERMS}${r}:permissions`);
        await this.redisService.del(oldKeys);
        await this.redisService.del(this.KEY_TRACKED_ROLES);
      }

      // 2. Lưu từng Role và danh sách mã quyền vào Redis Set
      const roleCodes: string[] = [];
      for (const role of roles) {
        roleCodes.push(role.code);
        const permissionCodes = role.rolePermissions.map((rp) => rp.permission.code);
        if (permissionCodes.length > 0) {
          const redisKey = `${this.PREFIX_ROLE_PERMS}${role.code}:permissions`;
          await this.redisService.sadd(redisKey, permissionCodes);
        }
      }

      // 3. Cập nhật danh sách các Role đang được theo dõi
      if (roleCodes.length > 0) {
        await this.redisService.sadd(this.KEY_TRACKED_ROLES, roleCodes);
      }

      const elapsed = Date.now() - startTime;
      this.logger.log(
        `RBAC Redis Cache synced: ${roles.length} roles written to Redis in ${elapsed}ms`,
      );
    } catch (error) {
      this.logger.error('Failed to sync RBAC permissions to Redis', error);
    }
  }

  /**
   * Xóa và làm mới cache trên Redis khi có thay đổi vai trò hoặc quyền
   */
  async invalidateRole(roleIdOrCode: string): Promise<void> {
    await this.reloadCache();
  }

  /**
   * Kiểm tra quyền của danh sách roles trực tiếp từ Redis
   */
  async hasPermissions(userRoles: string[], requiredPermissions: string[]): Promise<boolean> {
    if (!userRoles || userRoles.length === 0) {
      return false;
    }

    if (userRoles.includes('ADMIN')) {
      return true;
    }

    const permissions = await this.getPermissionsForRoles(userRoles);
    const permSet = new Set(permissions);

    return requiredPermissions.every((perm) => permSet.has(perm));
  }

  /**
   * Lấy toàn bộ danh sách permissions của một mảng roles từ Redis (Kèm Self-Healing khi Cache Miss)
   */
  async getPermissionsForRoles(userRoles: string[]): Promise<string[]> {
    if (!userRoles || userRoles.length === 0) {
      return [];
    }

    const permissions = new Set<string>();

    for (const roleCode of userRoles) {
      const redisKey = `${this.PREFIX_ROLE_PERMS}${roleCode}:permissions`;
      let perms = await this.redisService.smembers(redisKey);

      // Self-Healing (Cache Miss Recovery): Nếu Redis bị mất dữ liệu giữa chừng -> Tự động nạp lại từ DB
      if (perms.length === 0 && roleCode !== 'ADMIN') {
        const roleFromDb = await this.rolesRepository.findByCode(roleCode);
        if (roleFromDb) {
          const roleWithPerms = await this.rolesRepository.findById(roleFromDb.id);
          if (roleWithPerms && roleWithPerms.rolePermissions.length > 0) {
            perms = roleWithPerms.rolePermissions.map((rp) => rp.permission.code);
            await this.redisService.sadd(redisKey, perms);
            await this.redisService.sadd(this.KEY_TRACKED_ROLES, [roleCode]);
          }
        }
      }

      for (const p of perms) {
        permissions.add(p);
      }
    }

    return Array.from(permissions);
  }

  /**
   * Kiểm tra trạng thái isActive của tài khoản thuần túy từ Redis (TTL 60s)
   */
  async isAccountActive(accountId: string): Promise<boolean> {
    const redisKey = `${this.PREFIX_ACCOUNT_ACTIVE}${accountId}:active`;

    // 1. Đọc từ Redis Cache
    const cached = await this.redisService.get<boolean>(redisKey);
    if (cached !== null) {
      return cached;
    }

    // 2. Cache miss: Truy vấn CSDL qua Repository
    const account = await this.accountsRepository.findAccountStatus(accountId);
    const isActive = account ? account.isActive : false;

    // 3. Ghi vào Redis với thời gian sống TTL 60 giây
    await this.redisService.set(redisKey, isActive, 60);

    return isActive;
  }

  /**
   * Xóa cache trạng thái tài khoản trên Redis khi bị khóa, đổi mật khẩu hoặc đăng xuất
   */
  async invalidateAccount(accountId: string): Promise<void> {
    const redisKey = `${this.PREFIX_ACCOUNT_ACTIVE}${accountId}:active`;
    await this.redisService.del(redisKey);
  }
}
