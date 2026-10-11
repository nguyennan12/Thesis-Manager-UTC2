// ==============================================================================
// SEMESTERS CONTROLLER (6 Endpoints: CRUD Học kỳ, Kích hoạt & Cache Invalidation)
// ==============================================================================

import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { SemestersService } from '../services/semesters.service';
import { CreateSemesterDto, UpdateSemesterDto } from '../dto/semester.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { ROLES } from '../../../common/constants/roles.constant';
import { PERMISSIONS } from '../../../common/constants/permissions.constant';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';

@Controller('academic/semesters')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class SemestersController {
  constructor(private readonly semestersService: SemestersService) {}

  @Get()
  @RequirePermissions(PERMISSIONS.ACADEMIC_READ)
  async findAll() {
    const result = await this.semestersService.findAllSemesters();
    return result.unwrap();
  }

  @Get('current')
  @RequirePermissions(PERMISSIONS.ACADEMIC_READ)
  async findCurrent() {
    const result = await this.semestersService.findCurrentSemester();
    return result.unwrap();
  }

  @Get(':id')
  @RequirePermissions(PERMISSIONS.ACADEMIC_READ)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.semestersService.findSemesterById(id);
    return result.unwrap();
  }

  @Post()
  @Roles(ROLES.ADMIN, ROLES.STAFF)
  @RequirePermissions(PERMISSIONS.SEMESTERS_MANAGE)
  async create(
    @Body() dto: CreateSemesterDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.semestersService.createSemester(dto, user?.sub);
    return result.unwrap();
  }

  @Put(':id')
  @Roles(ROLES.ADMIN, ROLES.STAFF)
  @RequirePermissions(PERMISSIONS.SEMESTERS_MANAGE)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSemesterDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.semestersService.updateSemester(id, dto, user?.sub);
    return result.unwrap();
  }

  @Patch(':id/set-current')
  @Roles(ROLES.ADMIN, ROLES.STAFF)
  @RequirePermissions(PERMISSIONS.SEMESTERS_MANAGE)
  async setCurrent(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.semestersService.setCurrentSemester(id, user?.sub);
    return result.unwrap();
  }
}
