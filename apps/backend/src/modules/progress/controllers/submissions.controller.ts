// ==============================================================================
// SUBMISSIONS CONTROLLER (3 Endpoints: Final Submission, Plagiarism & Qualification)
// ==============================================================================

import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { SubmissionsService } from '../services/submissions.service';
import { SubmitThesisDto, QualifyDefenseDto } from '../dto/submission.dto';

@ApiTags('Submissions - Nộp Toàn văn & Xét điều kiện')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @RequirePermissions('thesis_reports:upload')
  @ApiOperation({ summary: 'Sinh viên nộp báo cáo toàn văn đồ án tốt nghiệp cuối kỳ' })
  @ApiResponse({ status: 201, description: 'Nộp báo cáo toàn văn thành công' })
  async submitThesis(
    @Body() dto: SubmitThesisDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.submissionsService.submitThesis(dto, user);
    return result.unwrap();
  }

  @Get(':regId/plagiarism')
  @RequirePermissions('thesis_reports:view_plagiarism')
  @ApiOperation({ summary: 'Xem kết quả phân tích tỷ lệ trùng lặp đạo văn' })
  async getPlagiarism(@Param('regId') regId: string) {
    const result = await this.submissionsService.getPlagiarismResult(regId);
    return result.unwrap();
  }

  @Patch(':regId/qualify')
  @RequirePermissions('thesis_reports:qualify_defense')
  @ApiOperation({ summary: 'Giảng viên hướng dẫn chấm điểm quá trình và chốt điều kiện bảo vệ' })
  async qualifyDefense(
    @Param('regId') regId: string,
    @Body() dto: QualifyDefenseDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.submissionsService.qualifyDefense(regId, dto, user);
    return result.unwrap();
  }
}
