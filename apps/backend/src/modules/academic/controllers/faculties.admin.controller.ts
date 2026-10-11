// ==============================================================================
// FACULTIES CONTROLLER (5 Endpoints: CRUD Khoa đào tạo)
// ==============================================================================

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { FacultiesService } from '../services/faculties.service';
import { CreateFacultyDto, UpdateFacultyDto } from '../dto/faculty.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { ROLES } from '../../../common/constants/roles.constant';
import { PERMISSIONS } from '../../../common/constants/permissions.constant';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';

@Controller('academic/faculties')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class FacultiesAdminController {
  constructor(private readonly facultiesService: FacultiesService) {}

  @Get()
  @RequirePermissions(PERMISSIONS.ACADEMIC_READ)
  async findAll() {
    const result = await this.facultiesService.findAllFaculties();
    return result.unwrap();
  }

  @Get(':id')
  @RequirePermissions(PERMISSIONS.ACADEMIC_READ)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.facultiesService.findFacultyById(id);
    return result.unwrap();
  }

  @Post()
  @Roles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.ACADEMIC_MANAGE)
  async create(
    @Body() dto: CreateFacultyDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.facultiesService.createFaculty(dto, user?.sub);
    return result.unwrap();
  }

  @Put(':id')
  @Roles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.ACADEMIC_MANAGE)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFacultyDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.facultiesService.updateFaculty(id, dto, user?.sub);
    return result.unwrap();
  }
}
