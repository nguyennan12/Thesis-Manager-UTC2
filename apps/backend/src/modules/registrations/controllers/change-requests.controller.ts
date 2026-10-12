// ==============================================================================
// CHANGE REQUESTS CONTROLLER (2 Endpoints: Change Request Creation & Staff Review)
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
import { ChangeRequestsService } from '../services/change-requests.service';
import { CreateChangeRequestDto, ReviewChangeRequestDto } from '../dto/change-request.dto';

@ApiTags('Registrations - Đơn xin Đổi Đề tài')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('registrations/change-requests')
export class ChangeRequestsController {
  constructor(private readonly changeReqService: ChangeRequestsService) {}

  @Get()
  @ApiOperation({ summary: 'Xem danh sách các đơn đề nghị thay đổi đề tài' })
  async findMyRequests(@CurrentUser() user: AuthenticatedUser) {
    const result = await this.changeReqService.findMyRequests(user);
    return result.unwrap();
  }

  @Post()
  @RequirePermissions('registrations:request_change')
  @ApiOperation({ summary: 'Sinh viên nộp đơn xin đổi đề tài / đổi giảng viên hướng dẫn' })
  @ApiResponse({ status: 201, description: 'Nộp đơn thành công' })
  async create(
    @Body() dto: CreateChangeRequestDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.changeReqService.create(dto, user);
    return result.unwrap();
  }

  @Patch(':id/review')
  @RequirePermissions('registrations:approve_change')
  @ApiOperation({ summary: 'Ban chủ nhiệm Khoa / Giáo vụ phê duyệt hoặc từ chối đơn xin đổi đề tài' })
  async review(
    @Param('id') id: string,
    @Body() dto: ReviewChangeRequestDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.changeReqService.review(id, dto, user);
    return result.unwrap();
  }
}
