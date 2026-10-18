// ==============================================================================
// TOPICS CONTROLLER (Core Endpoints: Topic Proposals, Scoped Listing & Submission)
// ==============================================================================

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { TopicsService } from '../services/topics.service';
import { CreateTopicDto, UpdateTopicDto } from '../dto/topic.dto';
import { QueryTopicDto } from '../dto/query-topic.dto';

@ApiTags('Topics - Quản lý Đề tài')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post()
  @RequirePermissions('topics:propose')
  @ApiOperation({ summary: 'Giảng viên tạo đề xuất đề tài tốt nghiệp mới (Bản nháp)' })
  @ApiResponse({ status: 201, description: 'Tạo đề tài thành công' })
  async create(
    @Body() dto: CreateTopicDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.topicsService.create(dto, user);
    return result.unwrap();
  }

  @Get()
  @ApiOperation({ summary: 'Tra cứu danh sách đề tài (Data Scoping tự động theo vai trò người dùng)' })
  async findAll(
    @Query() query: QueryTopicDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.topicsService.findAll(query, user);
    return result.unwrap();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết đề tài tốt nghiệp' })
  async findById(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const result = await this.topicsService.findById(id, user);
    return result.unwrap();
  }

  @Put(':id')
  @RequirePermissions('topics:update_draft')
  @ApiOperation({ summary: 'Giảng viên cập nhật nội dung đề tài (chỉ sửa khi DRAFT hoặc REJECTED)' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTopicDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.topicsService.update(id, dto, user);
    return result.unwrap();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions('topics:update_draft')
  @ApiOperation({ summary: 'Giảng viên xóa đề tài nháp' })
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.topicsService.delete(id, user);
    return result.unwrap();
  }

  @Patch(':id/submit')
  @RequirePermissions('topics:submit_review')
  @ApiOperation({ summary: 'Giảng viên gửi đề tài lên Trưởng bộ môn thẩm định' })
  async submit(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.topicsService.submit(id, user);
    return result.unwrap();
  }
}
