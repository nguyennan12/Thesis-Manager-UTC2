// ==============================================================================
// TOPICS REVIEW CONTROLLER (Head of Department Review & Approval)
// ==============================================================================

import {
  Body,
  Controller,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { TopicsReviewService } from '../services/topics-review.service';
import { ReviewTopicDto } from '../dto/review-topic.dto';

@ApiTags('Topics - Thẩm định Đề tài')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('topics')
export class TopicsReviewController {
  constructor(private readonly reviewService: TopicsReviewService) {}

  @Patch(':id/review')
  @RequirePermissions('topics:review_department')
  @ApiOperation({ summary: 'Trưởng bộ môn thẩm định phê duyệt hoặc từ chối đề tài' })
  @ApiResponse({ status: 200, description: 'Cập nhật quyết định thẩm định thành công' })
  async review(
    @Param('id') id: string,
    @Body() dto: ReviewTopicDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.reviewService.review(id, dto, user);
    return result.unwrap();
  }

  @Patch(':id/dean-approval')
  @RequirePermissions('topics:approve_dean')
  @ApiOperation({ summary: 'Ban Chủ nhiệm Khoa phê duyệt hoặc từ chối đề tài cấp 2' })
  @ApiResponse({ status: 200, description: 'Cập nhật quyết định phê duyệt cấp khoa thành công' })
  async approveByDean(
    @Param('id') id: string,
    @Body() dto: ReviewTopicDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.reviewService.approveByDean(id, dto, user);
    return result.unwrap();
  }
}
