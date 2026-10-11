// ==============================================================================
// LECTURERS CONTROLLER (4 Endpoints: Hồ sơ Giảng viên & Quota)
// ==============================================================================

import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { LecturersService } from '../services/lecturers.service';
import { CreateLecturerDto, UpdateLecturerDto, QueryLecturerDto } from '../dto/lecturer.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { ROLES } from '../../../common/constants/roles.constant';
import { PERMISSIONS } from '../../../common/constants/permissions.constant';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';

@Controller('lecturers')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class LecturersController {
  constructor(private readonly lecturersService: LecturersService) {}

  @Get()
  async findAll(@Query() query: QueryLecturerDto) {
    const result = await this.lecturersService.findAllLecturers(query);
    return result.unwrap();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.lecturersService.findLecturerById(id);
    return result.unwrap();
  }

  @Put(':id')
  @Roles(ROLES.ADMIN, ROLES.STAFF)
  @RequirePermissions(PERMISSIONS.PROFILES_MANAGE)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLecturerDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.lecturersService.updateLecturer(id, dto, user?.sub);
    return result.unwrap();
  }
}
