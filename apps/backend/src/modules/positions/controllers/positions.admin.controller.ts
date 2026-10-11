// ==============================================================================
// POSITIONS ADMIN CONTROLLER (3 Endpoints: Gán/Thu hồi chức danh & Trưởng bộ môn)
// ==============================================================================

import {
  Controller,
  Post,
  Delete,
  Put,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { PositionAssignmentService } from '../services/position-assignment.service';
import { AssignPositionDto, AssignDepartmentHeadDto } from '../dto/position.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { ROLES } from '../../../common/constants/roles.constant';
import { PERMISSIONS } from '../../../common/constants/permissions.constant';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles(ROLES.ADMIN)
export class PositionsAdminController {
  constructor(private readonly positionAssignmentService: PositionAssignmentService) {}

  @Post('users/:id/positions')
  @RequirePermissions(PERMISSIONS.USERS_MANAGE)
  async assignPosition(
    @Param('id', ParseUUIDPipe) accountId: string,
    @Body() dto: AssignPositionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.positionAssignmentService.assignPosition(accountId, dto, user?.sub);
    return result.unwrap();
  }

  @Delete('users/:id/positions/:assignmentId')
  @RequirePermissions(PERMISSIONS.USERS_MANAGE)
  async revokePosition(
    @Param('id', ParseUUIDPipe) accountId: string,
    @Param('assignmentId', ParseUUIDPipe) assignmentId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.positionAssignmentService.revokePosition(
      accountId,
      assignmentId,
      user?.sub,
    );
    return result.unwrap();
  }

  @Put('academic/departments/:id/head')
  @RequirePermissions(PERMISSIONS.USERS_MANAGE)
  async assignDepartmentHead(
    @Param('id', ParseUUIDPipe) departmentId: string,
    @Body() dto: AssignDepartmentHeadDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.positionAssignmentService.assignDepartmentHead(
      departmentId,
      dto.lecturerId,
      user?.sub,
    );
    return result.unwrap();
  }
}
