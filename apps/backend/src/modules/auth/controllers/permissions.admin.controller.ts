// ==============================================================================
// PERMISSIONS ADMIN CONTROLLER (Tra cứu Danh mục Quyền hệ thống - Dành cho Admin)
// ==============================================================================

import { Controller, Get } from '@nestjs/common';
import { PermissionsService } from '../services/permissions.service';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { ROLES } from '../../../common/constants/roles.constant';
import { PERMISSIONS } from '../../../common/constants/permissions.constant';

@Roles(ROLES.ADMIN)
@RequirePermissions(PERMISSIONS.ROLES_MANAGE)
@Controller('permissions')
export class PermissionsAdminController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  async findAllPermissions() {
    const result = await this.permissionsService.findAllPermissions();
    return result.unwrap();
  }
}
