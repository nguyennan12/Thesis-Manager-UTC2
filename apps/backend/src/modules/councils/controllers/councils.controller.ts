// ==============================================================================
// COUNCILS CONTROLLER (4 Endpoints: Council Creation, Listing, Detail & Assign Students)
// ==============================================================================

import {
  Body,
  Controller,
  Get,
  Param,
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
import { CouncilsService } from '../services/councils.service';
import { CreateCouncilDto, QueryCouncilDto, AssignStudentsToCouncilDto } from '../dto/council.dto';

@ApiTags('Councils - Hội đồng Bảo vệ')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('councils')
export class CouncilsController {
  constructor(private readonly councilsService: CouncilsService) {}

  @Post()
  @RequirePermissions('councils:manage_schedule')
  @ApiOperation({ summary: 'Thành lập Hội đồng bảo vệ đồ án tốt nghiệp (Check BR-C2 tối thiểu 3 thành viên)' })
  @ApiResponse({ status: 201, description: 'Thành lập hội đồng thành công' })
  async createCouncil(
    @Body() dto: CreateCouncilDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.councilsService.createCouncil(dto, user);
    return result.unwrap();
  }

  @Get()
  @RequirePermissions('councils:read')
  @ApiOperation({ summary: 'Danh sách các Hội đồng bảo vệ đồ án theo học kỳ và bộ môn' })
  async findAll(
    @Query() query: QueryCouncilDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.councilsService.findAll(query, user);
    return result.unwrap();
  }

  @Get(':id')
  @RequirePermissions('councils:read')
  @ApiOperation({ summary: 'Xem chi tiết Hội đồng bảo vệ (thành viên và danh sách sinh viên bảo vệ)' })
  async findById(@Param('id') id: string) {
    const result = await this.councilsService.findById(id);
    return result.unwrap();
  }

  @Post(':id/assign-students')
  @RequirePermissions('councils:assign_students')
  @ApiOperation({ summary: 'Phân công sinh viên vào Hội đồng (Check BR-C3 và điều kiện QUALIFIED_DEFENSE BR-C4)' })
  async assignStudents(
    @Param('id') id: string,
    @Body() dto: AssignStudentsToCouncilDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.councilsService.assignStudents(id, dto, user);
    return result.unwrap();
  }
}
