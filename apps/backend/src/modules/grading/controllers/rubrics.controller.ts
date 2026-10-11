// ==============================================================================
// RUBRICS CONTROLLER (9 Endpoints for Rubric Sets and Criteria Management)
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
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { RubricsService } from '../services/rubrics.service';
import { RubricActivationService } from '../services/rubric-activation.service';
import { CreateRubricSetDto, UpdateRubricSetDto } from '../dto/rubric-set.dto';
import { QueryRubricSetDto } from '../dto/query-rubric-set.dto';
import { UpsertCriteriaDto } from '../dto/criteria.dto';
import { TopicType } from '@prisma/client';

@ApiTags('Grading - Rubrics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/grading/rubrics')
export class RubricsController {
  constructor(
    private readonly rubricsService: RubricsService,
    private readonly activationService: RubricActivationService,
  ) {}

  @Post()
  @RequirePermissions('rubrics:manage')
  @ApiOperation({ summary: 'Tạo bộ tiêu chí đánh giá mới (bản nháp)' })
  @ApiResponse({ status: 201, description: 'Tạo bộ tiêu chí thành công' })
  async create(@Body() dto: CreateRubricSetDto) {
    const result = await this.rubricsService.create(dto);
    return result.unwrap();
  }

  @Get()
  @RequirePermissions('rubrics:read')
  @ApiOperation({ summary: 'Lấy danh sách các bộ tiêu chí (có phân trang và bộ lọc)' })
  async findAll(@Query() query: QueryRubricSetDto) {
    const result = await this.rubricsService.findAll(query);
    return result.unwrap();
  }

  @Get('active')
  @RequirePermissions('rubrics:read')
  @ApiOperation({ summary: 'Tra cứu bộ tiêu chí đang áp dụng (Active) theo loại đề tài và năm học' })
  @ApiQuery({ name: 'topicType', enum: TopicType, required: true })
  @ApiQuery({ name: 'academicYear', type: String, required: true })
  async findActive(
    @Query('topicType') topicType: TopicType,
    @Query('academicYear') academicYear: string,
  ) {
    const result = await this.rubricsService.findActive(topicType, academicYear);
    return result.unwrap();
  }

  @Get(':id')
  @RequirePermissions('rubrics:read')
  @ApiOperation({ summary: 'Xem chi tiết bộ tiêu chí và danh sách tiêu chí con' })
  async findById(@Param('id') id: string) {
    const result = await this.rubricsService.findById(id);
    return result.unwrap();
  }

  @Patch(':id')
  @RequirePermissions('rubrics:manage')
  @ApiOperation({ summary: 'Cập nhật thông tin chung bộ tiêu chí' })
  async update(@Param('id') id: string, @Body() dto: UpdateRubricSetDto) {
    const result = await this.rubricsService.update(id, dto);
    return result.unwrap();
  }

  @Post(':id/activate')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions('rubrics:manage')
  @ApiOperation({ summary: 'Kích hoạt bộ tiêu chí (tổng trọng số phải đúng 100.00%)' })
  async activate(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const result = await this.activationService.activate(id, user);
    return result.unwrap();
  }

  @Put(':id/criteria')
  @RequirePermissions('rubrics:manage')
  @ApiOperation({ summary: 'Cập nhật danh sách tiêu chí con của bộ tiêu chí' })
  async upsertCriteria(@Param('id') id: string, @Body() dto: UpsertCriteriaDto) {
    const result = await this.rubricsService.upsertCriteria(id, dto);
    return result.unwrap();
  }
}
