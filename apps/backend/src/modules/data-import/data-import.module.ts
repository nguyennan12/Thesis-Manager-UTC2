import { Module } from '@nestjs/common';
import { DataImportController } from './controllers/data-import.controller';
import { StudentImportProcessor } from './processors/student-import.processor';
import { LecturerImportProcessor } from './processors/lecturer-import.processor';
import { ClassImportProcessor } from './processors/class-import.processor';
import { ImportPreviewService } from './services/import-preview.service';
import { ImportConfirmService } from './services/import-confirm.service';

@Module({
  controllers: [DataImportController],
  providers: [
    StudentImportProcessor,
    LecturerImportProcessor,
    ClassImportProcessor,
    ImportPreviewService,
    ImportConfirmService,
  ],
  exports: [
    ImportPreviewService,
    ImportConfirmService,
  ],
})
export class DataImportModule {}
