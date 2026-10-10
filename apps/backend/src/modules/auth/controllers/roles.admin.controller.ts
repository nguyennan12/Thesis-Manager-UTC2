// ==============================================================================
// ROLES ADMIN CONTROLLER (Quản trị Vai trò & Gán quyền - Dành cho Admin)
// ==============================================================================

import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { RolesService } from '../services/roles.service';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { ROLES } from '../../../common/constants/roles.constant';
import { PERMISSIONS } from '../../../common/constants/permissions.constant';
import {
  CreateRoleDto,
  UpdateRoleDto,
  AssignPermissionsDto,
  AssignAccountRoleDto,
} from '../dto';

@Roles(ROLES.ADMIN)
@RequirePermissions(PERMISSIONS.ROLES_MANAGE)
@Controller('roles')
export class RolesAdminController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async findAllRoles() {
    const result = await this.rolesService.findAllRoles();
    return result.unwrap();
  }

  @Get(':id')
  async findRoleById(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.rolesService.findRoleById(id);
    return result.unwrap();
  }

  @Post()
  async createRole(
    @Body() dto: CreateRoleDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.rolesService.createRole(dto, user?.sub);
    return result.unwrap();
  }

  @Put(':id')
  async updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.rolesService.updateRole(id, dto, user?.sub);
    return result.unwrap();
  }

  @Post(':id/permissions')
  async assignPermissionsToRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignPermissionsDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.rolesService.assignPermissionsToRole(id, dto, user?.sub);
    return result.unwrap();
  }

  @Post('accounts/:accountId/assign')
  async assignRoleToAccount(
    @Param('accountId', ParseUUIDPipe) accountId: string,
    @Body() dto: AssignAccountRoleDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.rolesService.assignRoleToAccount(accountId, dto, user?.sub);
    return result.unwrap();
  }
}
