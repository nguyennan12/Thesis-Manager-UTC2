// ==============================================================================
// QUOTAS CONTROLLER (2 Endpoints: Quản lý Chỉ tiêu Quota theo Học kỳ)
// ==============================================================================

import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { LecturerQuotasService } from '../services/lecturer-quotas.service';
import { UpdateLecturerQuotaDto } from '../dto/lecturer-quota.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { ROLES } from '../../../common/constants/roles.constant';
import { PERMISSIONS } from '../../../common/constants/permissions.constant';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';

@Controller('academic/semesters/:id/lecturer-quotas')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class QuotasController {
  constructor(private readonly lecturerQuotasService: LecturerQuotasService) {}

  @Get()
  @Roles(ROLES.ADMIN, ROLES.STAFF, ROLES.LECTURER)
  @RequirePermissions(PERMISSIONS.QUOTAS_MANAGE)
  async getQuotas(
    @Param('id', ParseUUIDPipe) semesterId: string,
    @Query('departmentId') departmentId?: string,
  ) {
    const result = await this.lecturerQuotasService.getLecturerQuotasBySemester(
      semesterId,
      departmentId,
    );
    return result.unwrap();
  }

  @Put(':lecturerId')
  @Roles(ROLES.ADMIN, ROLES.STAFF, ROLES.LECTURER)
  @RequirePermissions(PERMISSIONS.QUOTAS_MANAGE)
  async updateQuota(
    @Param('id', ParseUUIDPipe) semesterId: string,
    @Param('lecturerId', ParseUUIDPipe) lecturerId: string,
    @Body() dto: UpdateLecturerQuotaDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.lecturerQuotasService.updateLecturerQuota(
      semesterId,
      lecturerId,
      dto.maxQuota,
      user?.sub,
    );
    return result.unwrap();
  }
}
