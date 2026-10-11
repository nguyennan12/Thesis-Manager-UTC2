// ==============================================================================
// EVALUATION CONTROLLER (2 Endpoints: Submit Rubric Scores & Calculate Final Grades)
// ==============================================================================

import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { EvaluationService } from '../services/evaluation.service';
import { SubmitDetailedScoreDto } from '../dto/evaluation.dto';

@ApiTags('Councils - Chấm điểm & Đánh giá')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/evaluation')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post('scores')
  @RequirePermissions('scores:input_council')
  @ApiOperation({ summary: 'Thành viên Hội đồng nhập điểm chi tiết theo tiêu chí Rubric' })
  @ApiResponse({ status: 200, description: 'Lưu điểm tiêu chí thành công' })
  async submitScores(
    @Body() dto: SubmitDetailedScoreDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.evaluationService.submitDetailedScores(dto, user);
    return result.unwrap();
  }

  @Post(':regId/calculate-final')
  @RequirePermissions('scores:calculate_final')
  @ApiOperation({ summary: 'Tính điểm tổng kết (30% GVHD + 20% GVPB + 50% HĐ) và quy đổi điểm chữ UTC2' })
  async calculateFinalGrade(
    @Param('regId') regId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.evaluationService.calculateFinalGrade(regId, user);
    return result.unwrap();
  }
}
