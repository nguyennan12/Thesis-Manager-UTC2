// ==============================================================================
// DATA IMPORT CONTROLLER (Templates, Two-Phase Preview & Confirm Endpoints)
// ==============================================================================

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { ImportPreviewService } from '../services/import-preview.service';
import { ImportConfirmService } from '../services/import-confirm.service';
import { TemplateGeneratorHelper } from '../helpers/template-generator.helper';
import { ConfirmImportDto } from '../dto/confirm-import.dto';

@ApiTags('Data Import')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('import')
export class DataImportController {
  constructor(
    private readonly previewService: ImportPreviewService,
    private readonly confirmService: ImportConfirmService,
  ) {}

  @Get('templates/:type')
  @RequirePermissions('profiles:read')
  @ApiOperation({ summary: 'Tải file mẫu Excel (.xlsx) chuẩn cho từng danh mục' })
  @ApiParam({ name: 'type', enum: ['students', 'lecturers', 'classes'], description: 'Loại danh mục cần import' })
  async downloadTemplate(@Param('type') type: string, @Res() res: Response) {
    if (!['students', 'lecturers', 'classes'].includes(type)) {
      res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: `Loại tệp mẫu '${type}' không tồn tại. Chỉ hỗ trợ students, lecturers, classes.`,
      });
      return;
    }

    const buffer = await TemplateGeneratorHelper.generateTemplate(type as any);

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="mau_import_${type}.xlsx"`,
      'Content-Length': buffer.length,
    });

    res.send(buffer);
  }

  @Post(':type/preview')
  @RequirePermissions('profiles:manage')
  @ApiOperation({ summary: 'Bước 1: Tải tệp lên để kiểm tra tính hợp lệ và xem trước dữ liệu (Staged in Redis 30m)' })
  @ApiParam({ name: 'type', enum: ['students', 'lecturers', 'classes'], description: 'Loại dữ liệu cần import' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Tệp tin Excel (.xlsx) hoặc CSV (.csv) chứa dữ liệu',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async preview(
    @Param('type') type: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.previewService.preview(type, file);
    return result.unwrap();
  }

  @Post('confirm')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions('profiles:manage')
  @ApiOperation({ summary: 'Bước 2: Xác nhận lưu dữ liệu hợp lệ vào cơ sở dữ liệu và tạo tài khoản mặc định' })
  @ApiResponse({ status: 200, description: 'Lưu dữ liệu thành công' })
  async confirm(
    @Body() dto: ConfirmImportDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.confirmService.confirm(dto.token, user);
    return result.unwrap();
  }
}
