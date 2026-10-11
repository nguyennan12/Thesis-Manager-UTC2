// ==============================================================================
// DEPARTMENTS CONTROLLER (5 Endpoints: CRUD Bộ môn)
// ==============================================================================

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { DepartmentsService } from '../services/departments.service';
import { CreateDepartmentDto, UpdateDepartmentDto, QueryDepartmentDto } from '../dto/department.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { ROLES } from '../../../common/constants/roles.constant';
import { PERMISSIONS } from '../../../common/constants/permissions.constant';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';

@Controller('academic/departments')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class DepartmentsAdminController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  @RequirePermissions(PERMISSIONS.ACADEMIC_READ)
  async findAll(@Query() query: QueryDepartmentDto) {
    const result = await this.departmentsService.findAllDepartments(query);
    return result.unwrap();
  }

  @Get(':id')
  @RequirePermissions(PERMISSIONS.ACADEMIC_READ)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.departmentsService.findDepartmentById(id);
    return result.unwrap();
  }

  @Post()
  @Roles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.ACADEMIC_MANAGE)
  async create(
    @Body() dto: CreateDepartmentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.departmentsService.createDepartment(dto, user?.sub);
    return result.unwrap();
  }

  @Put(':id')
  @Roles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.ACADEMIC_MANAGE)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDepartmentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.departmentsService.updateDepartment(id, dto, user?.sub);
    return result.unwrap();
  }
}
