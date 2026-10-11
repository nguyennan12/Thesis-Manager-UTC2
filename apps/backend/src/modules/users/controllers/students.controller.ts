// ==============================================================================
// STUDENTS CONTROLLER (4 Endpoints: Quản lý Hồ sơ Sinh viên kèm Phân quyền Scoped)
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
import { StudentsService } from '../services/students.service';
import { CreateStudentDto, UpdateStudentDto, QueryStudentDto } from '../dto/student.dto';
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

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @Roles(ROLES.ADMIN, ROLES.STAFF, ROLES.LECTURER)
  @RequirePermissions(PERMISSIONS.PROFILES_READ)
  async findAll(
    @Query() query: QueryStudentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const scope = DataScopeHelper.extractScope(user);
    const result = await this.studentsService.findAllStudents(query, scope);
    return result.unwrap();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const scope = DataScopeHelper.extractScope(user);
    const callerStudentId = user?.roles?.includes(ROLES.STUDENT) ? user.studentId : undefined;
    const result = await this.studentsService.findStudentById(id, scope, callerStudentId);
    return result.unwrap();
  }

  @Put(':id')
  @Roles(ROLES.ADMIN, ROLES.STAFF)
  @RequirePermissions(PERMISSIONS.PROFILES_MANAGE)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStudentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const scope = DataScopeHelper.extractScope(user);
    const result = await this.studentsService.updateStudent(id, dto, scope, user?.sub);
    return result.unwrap();
  }
}
