// ==============================================================================
// CLASSES CONTROLLER (5 Endpoints: CRUD Lớp sinh hoạt kèm Phân quyền Scope Khoa)
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
import { ClassesService } from '../services/classes.service';
import { CreateClassDto, UpdateClassDto, QueryClassDto } from '../dto/class.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { ROLES } from '../../../common/constants/roles.constant';
import { PERMISSIONS } from '../../../common/constants/permissions.constant';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { DataScopeHelper } from '../../../common/helpers/data-scope.helper';

@Controller('academic/classes')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  @RequirePermissions(PERMISSIONS.ACADEMIC_READ)
  async findAll(
    @Query() query: QueryClassDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const scope = DataScopeHelper.extractScope(user);
    const result = await this.classesService.findAllClasses(query, scope);
    return result.unwrap();
  }

  @Get(':id')
  @RequirePermissions(PERMISSIONS.ACADEMIC_READ)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const scope = DataScopeHelper.extractScope(user);
    const result = await this.classesService.findClassById(id, scope);
    return result.unwrap();
  }

  @Put(':id')
  @Roles(ROLES.ADMIN, ROLES.STAFF)
  @RequirePermissions(PERMISSIONS.ACADEMIC_MANAGE)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateClassDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const scope = DataScopeHelper.extractScope(user);
    const result = await this.classesService.updateClass(id, dto, scope, user?.sub);
    return result.unwrap();
  }
}
