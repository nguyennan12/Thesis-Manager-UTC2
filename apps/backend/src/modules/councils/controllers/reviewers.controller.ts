// ==============================================================================
// REVIEWERS CONTROLLER (2 Endpoints: Assign Reviewer & Input Reviewer Score)
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
import { ReviewersService } from '../services/reviewers.service';
import { AssignReviewerDto, ScoreReviewerDto } from '../dto/reviewer.dto';

@ApiTags('Councils - Giảng viên Phản biện')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reviewers')
export class ReviewersController {
  constructor(private readonly reviewersService: ReviewersService) {}

  @Post('assign')
  @RequirePermissions('councils:propose_members')
  @ApiOperation({ summary: 'Trưởng bộ môn phân công Giảng viên phản biện (Check BR-C1 chống trùng GVHD)' })
  @ApiResponse({ status: 201, description: 'Phân công phản biện thành công' })
  async assignReviewer(
    @Body() dto: AssignReviewerDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.reviewersService.assignReviewer(dto, user);
    return result.unwrap();
  }

  @Get('my-assignments')
  @ApiOperation({ summary: 'Lấy danh sách các đề tài được phân công phản biện cho Giảng viên' })
  async getMyAssignments(@CurrentUser() user: AuthenticatedUser) {
    const result = await this.reviewersService.getMyAssignments(user);
    return result.unwrap();
  }

  @Patch(':regId/score')
  @RequirePermissions('scores:input_reviewer')
  @ApiOperation({ summary: 'Giảng viên phản biện chấm điểm phản biện và nhận xét (thang 10, chiếm 20%)' })
  async scoreReviewer(
    @Param('regId') regId: string,
    @Body() dto: ScoreReviewerDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.reviewersService.scoreReviewer(regId, dto, user);
    return result.unwrap();
  }
}
