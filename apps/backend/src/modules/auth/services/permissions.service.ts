// ==============================================================================
// PERMISSIONS SERVICE (SRP: Permissions Catalogue with Result Pattern)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { PermissionsRepository } from '../repositories/permissions.repository';
import { Result } from '../../../common/utils';

@Injectable()
export class PermissionsService {
  constructor(private readonly permissionsRepository: PermissionsRepository) {}

  /**
   * Lấy toàn bộ danh mục 50 quyền hệ thống được gom nhóm theo Module
   */
  async findAllPermissions(): Promise<Result<{ total: number; modules: Record<string, any[]> }>> {
    const permissions = await this.permissionsRepository.findAll();

    const grouped = permissions.reduce<Record<string, typeof permissions>>((acc, perm) => {
      if (!acc[perm.module]) {
        acc[perm.module] = [];
      }
      acc[perm.module].push(perm);
      return acc;
    }, {});

    return Result.ok({
      total: permissions.length,
      modules: grouped,
    });
  }
}
