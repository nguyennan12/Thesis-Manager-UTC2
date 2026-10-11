// ==============================================================================
// PROGRESS CONTROLLER (4 Endpoints: Weekly Reports, Reviews & Delayed Student Alerts)
// ==============================================================================

import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
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
import { ProgressService } from '../services/progress.service';
import { CreateProgressReportDto, ReviewProgressReportDto } from '../dto/progress-report.dto';

@ApiTags('Progress - Báo cáo Tiến độ')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post('reports')
  @RequirePermissions('progress:submit_report')
  @ApiOperation({ summary: 'Sinh viên nộp báo cáo tiến độ tuần' })
  @ApiResponse({ status: 201, description: 'Nộp báo cáo tuần thành công' })
  async createReport(
    @Body() dto: CreateProgressReportDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.progressService.createReport(dto, user);
    return result.unwrap();
  }

  @Get('registrations/:regId/reports')
  @RequirePermissions('progress:read_reports')
  @ApiOperation({ summary: 'Xem lịch sử các báo cáo tuần của một hồ sơ đồ án' })
  async getReports(@Param('regId') regId: string) {
    const result = await this.progressService.getReportsByRegistrationId(regId);
    return result.unwrap();
  }

  @Patch('reports/:id/review')
  @RequirePermissions('progress:review')
  @ApiOperation({ summary: 'Giảng viên hướng dẫn đánh giá và nhận xét báo cáo tuần của sinh viên' })
  async reviewReport(
    @Param('id') id: string,
    @Body() dto: ReviewProgressReportDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.progressService.reviewReport(id, dto, user);
    return result.unwrap();
  }

  @Get('warnings')
  @RequirePermissions('progress:view_warnings')
  @ApiOperation({ summary: 'Danh sách sinh viên bị cảnh báo chậm tiến độ làm đồ án (>= 2 tuần chưa nộp)' })
  async getWarnings(@Query('semesterId') semesterId?: string) {
    const result = await this.progressService.getWarnings(semesterId);
    return result.unwrap();
  }
}
