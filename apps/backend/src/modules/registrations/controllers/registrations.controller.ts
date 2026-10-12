// ==============================================================================
// REGISTRATIONS CONTROLLER (6 Endpoints: Student Registration, My-Profile & Staff Assignment)
// ==============================================================================

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { RegistrationsService } from '../services/registrations.service';
import { RegistrationsAdminService } from '../services/registrations-admin.service';
import { CreateRegistrationDto, AssignRegistrationDto } from '../dto/registration.dto';
import { QueryRegistrationDto } from '../dto/query-registration.dto';

@ApiTags('Registrations - Đăng ký Đồ án')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('registrations')
export class RegistrationsController {
  constructor(
    private readonly regService: RegistrationsService,
    private readonly adminService: RegistrationsAdminService,
  ) {}

  @Get()
  @RequirePermissions('registrations:read_scope')
  @ApiOperation({ summary: 'Xem danh sách sinh viên đăng ký đồ án theo phạm vi quản trị' })
  async findAll(
    @Query() query: QueryRegistrationDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.adminService.findAll(query, user);
    return result.unwrap();
  }

  @Get('my-registration')
  @RequirePermissions('registrations:read_self')
  @ApiOperation({ summary: 'Sinh viên xem hồ sơ đề tài đồ án hiện tại của chính mình' })
  async getMyRegistration(@CurrentUser() user: AuthenticatedUser) {
    const result = await this.regService.getMyRegistration(user);
    return result.unwrap();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết một hồ sơ đăng ký đề tài đồ án' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.adminService.findById(id);
    return result.unwrap();
  }

  @Post()
  @RequirePermissions('registrations:register')
  @ApiOperation({ summary: 'Sinh viên thực hiện đăng ký đề tài đồ án tốt nghiệp' })
  @ApiResponse({ status: 201, description: 'Đăng ký đề tài thành công' })
  async register(
    @Body() dto: CreateRegistrationDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.regService.register(dto, user);
    return result.unwrap();
  }

  @Delete(':id/cancel')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions('registrations:cancel')
  @ApiOperation({ summary: 'Sinh viên hủy đăng ký đề tài đồ án (trong thời hạn cho phép)' })
  async cancel(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.regService.cancel(id, user);
    return result.unwrap();
  }

  @Post('assign')
  @RequirePermissions('profiles:manage')
  @ApiOperation({ summary: 'Giáo vụ / Ban chủ nhiệm Khoa gán đề tài trực tiếp cho sinh viên' })
  async assign(
    @Body() dto: AssignRegistrationDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.adminService.assign(dto, user);
    return result.unwrap();
  }
}
