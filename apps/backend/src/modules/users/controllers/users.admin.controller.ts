// ==============================================================================
// USERS ADMIN CONTROLLER (5 Endpoints: Quản trị Tài khoản người dùng)
// ==============================================================================

import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersManagementService } from '../services/users-management.service';
import { CreateUserDto, UpdateUserStatusDto, QueryUserDto } from '../dto/user.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { ROLES } from '../../../common/constants/roles.constant';
import { PERMISSIONS } from '../../../common/constants/permissions.constant';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles(ROLES.ADMIN)
export class UsersAdminController {
  constructor(private readonly usersService: UsersManagementService) {}

  @Get()
  @RequirePermissions(PERMISSIONS.USERS_READ)
  async findAll(@Query() query: QueryUserDto) {
    const result = await this.usersService.findAllUsers(query);
    return result.unwrap();
  }

  @Get(':id')
  @RequirePermissions(PERMISSIONS.USERS_READ)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.usersService.findUserById(id);
    return result.unwrap();
  }

  @Post()
  @RequirePermissions(PERMISSIONS.USERS_MANAGE)
  async create(
    @Body() dto: CreateUserDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.usersService.createUser(dto, user?.sub);
    return result.unwrap();
  }

  @Patch(':id/status')
  @RequirePermissions(PERMISSIONS.USERS_MANAGE)
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserStatusDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.usersService.updateUserStatus(id, dto.isActive, user?.sub);
    return result.unwrap();
  }

  @Post(':id/reset-password')
  @RequirePermissions(PERMISSIONS.USERS_MANAGE)
  async resetPassword(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.usersService.resetPassword(id, user?.sub);
    return result.unwrap();
  }
}
