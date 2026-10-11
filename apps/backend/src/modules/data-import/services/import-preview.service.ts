// ==============================================================================
// IMPORT PREVIEW SERVICE (SRP: Parse, Validate & Stage Uploaded Data in Redis)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../database/redis/redis.service';
import { FileGuardHelper } from '../helpers/file-guard.helper';
import { StudentImportProcessor } from '../processors/student-import.processor';
import { LecturerImportProcessor } from '../processors/lecturer-import.processor';
import { ClassImportProcessor } from '../processors/class-import.processor';
import { Result, AppError } from '../../../common/utils';
import { randomUUID } from 'crypto';

export interface ImportPreviewResponse {
  token: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  errors: { row: number; column: string; message: string }[];
  previewData: any[];
}

@Injectable()
export class ImportPreviewService {
  private static readonly SESSION_TTL_SECONDS = 1800; // 30 phút

  constructor(
    private readonly redisService: RedisService,
    private readonly studentProcessor: StudentImportProcessor,
    private readonly lecturerProcessor: LecturerImportProcessor,
    private readonly classProcessor: ClassImportProcessor,
  ) {}

  async preview(type: string, file?: Express.Multer.File): Promise<Result<ImportPreviewResponse>> {
    // 1. Kiểm tra loại dữ liệu hỗ trợ
    if (!['students', 'lecturers', 'classes'].includes(type)) {
      return Result.err(AppError.badRequest(`Loại dữ liệu import '${type}' không được hỗ trợ. Chỉ hỗ trợ students, lecturers, classes.`));
    }

    // 2. Kiểm tra file và magic bytes
    const fileError = FileGuardHelper.validateUpload(file);
    if (fileError) {
      return Result.err(AppError.badRequest(fileError));
    }

    // 3. Đọc dữ liệu ra mảng dòng thô
    let rawRows: Record<string, any>[];
    try {
      rawRows = await FileGuardHelper.parseToRows(file!);
    } catch (err: any) {
      return Result.err(AppError.badRequest(err.message || 'Không thể đọc nội dung tệp tin tải lên.'));
    }

    if (!rawRows || rawRows.length === 0) {
      return Result.err(AppError.badRequest('Tệp tin không chứa bất kỳ dòng dữ liệu nào.'));
    }

    // 4. Validate nghiệp vụ theo từng loại dữ liệu
    let processResult: any;
    if (type === 'students') {
      processResult = await this.studentProcessor.process(rawRows);
    } else if (type === 'lecturers') {
      processResult = await this.lecturerProcessor.process(rawRows);
    } else {
      processResult = await this.classProcessor.process(rawRows);
    }

    // 5. Lưu phiên tạm vào Redis với TTL 30 phút
    const token = randomUUID();
    const sessionKey = `utc2:import_session:${token}`;

    await this.redisService.set(
      sessionKey,
      {
        type,
        validItems: processResult.validItems,
      },
      ImportPreviewService.SESSION_TTL_SECONDS,
    );

    return Result.ok({
      token,
      totalRows: processResult.totalRows,
      validRows: processResult.validRows,
      invalidRows: processResult.invalidRows,
      errors: processResult.errors,
      previewData: processResult.previewData,
    });
  }
}
