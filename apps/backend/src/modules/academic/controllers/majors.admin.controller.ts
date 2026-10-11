// ==============================================================================
// MAJORS CONTROLLER (5 Endpoints: CRUD Ngành đào tạo)
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
import { MajorsService } from '../services/majors.service';
import { CreateMajorDto, UpdateMajorDto, QueryMajorDto } from '../dto/major.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { ROLES } from '../../../common/constants/roles.constant';
import { PERMISSIONS } from '../../../common/constants/permissions.constant';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';

@Controller('academic/majors')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class MajorsAdminController {
  constructor(private readonly majorsService: MajorsService) {}

  @Get()
  @RequirePermissions(PERMISSIONS.ACADEMIC_READ)
  async findAll(@Query() query: QueryMajorDto) {
    const result = await this.majorsService.findAllMajors(query);
    return result.unwrap();
  }

  @Get(':id')
  @RequirePermissions(PERMISSIONS.ACADEMIC_READ)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.majorsService.findMajorById(id);
    return result.unwrap();
  }

  @Post()
  @Roles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.ACADEMIC_MANAGE)
  async create(
    @Body() dto: CreateMajorDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.majorsService.createMajor(dto, user?.sub);
    return result.unwrap();
  }

  @Put(':id')
  @Roles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.ACADEMIC_MANAGE)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMajorDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.majorsService.updateMajor(id, dto, user?.sub);
    return result.unwrap();
  }
}
