// ==============================================================================
// CLASS IMPORT PROCESSOR (Validate & Transform Class Import Rows)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { ProcessResult } from './student-import.processor';

export interface ValidatedClassItem {
  code: string;
  name: string;
  majorId: string;
  majorCode: string;
  academicYear: string;
}

@Injectable()
export class ClassImportProcessor {
  constructor(private readonly prisma: PrismaService) {}

  async process(rawRows: Record<string, any>[]): Promise<ProcessResult<ValidatedClassItem>> {
    const errors: { row: number; column: string; message: string }[] = [];
    const validItems: ValidatedClassItem[] = [];

    // 1. Tải trước danh sách các ngành học để ánh xạ
    const majors = await this.prisma.major.findMany({
      select: { id: true, code: true },
    });
    const majorMap = new Map<string, string>(majors.map((m) => [m.code.trim().toUpperCase(), m.id]));

    // 2. Tải trước danh sách mã lớp hiện có trong hệ thống
    const existingClasses = await this.prisma.class.findMany({
      select: { code: true },
    });
    const systemCodes = new Set<string>(existingClasses.map((c) => c.code.trim().toUpperCase()));
    const fileCodes = new Set<string>();

    for (let index = 0; index < rawRows.length; index++) {
      const row = rawRows[index];
      const rowNum = index + 2;
      let hasRowError = false;

      const code = (row['Mã lớp (*)'] || row['Mã lớp'] || row['code'] || '').toString().trim().toUpperCase();
      const name = (row['Tên lớp (*)'] || row['Tên lớp'] || row['name'] || '').toString().trim();
      const majorCode = (row['Mã ngành (*)'] || row['Mã ngành'] || row['majorCode'] || '').toString().trim().toUpperCase();
      const academicYear = (row['Năm học (*)'] || row['Năm học'] || row['academicYear'] || '2026-2027').toString().trim();

      if (!code) {
        errors.push({ row: rowNum, column: 'Mã lớp', message: 'Mã lớp không được để trống.' });
        hasRowError = true;
      } else {
        if (fileCodes.has(code)) {
          errors.push({ row: rowNum, column: 'Mã lớp', message: `Mã lớp '${code}' bị trùng lặp trong tệp.` });
          hasRowError = true;
        } else if (systemCodes.has(code)) {
          errors.push({ row: rowNum, column: 'Mã lớp', message: `Mã lớp '${code}' đã tồn tại trên hệ thống.` });
          hasRowError = true;
        }
        fileCodes.add(code);
      }

      if (!name) {
        errors.push({ row: rowNum, column: 'Tên lớp', message: 'Tên lớp không được để trống.' });
        hasRowError = true;
      }

      let majorId = '';
      if (!majorCode) {
        errors.push({ row: rowNum, column: 'Mã ngành', message: 'Mã ngành không được để trống.' });
        hasRowError = true;
      } else {
        const foundId = majorMap.get(majorCode);
        if (!foundId) {
          errors.push({ row: rowNum, column: 'Mã ngành', message: `Mã ngành '${majorCode}' không tồn tại trong danh mục.` });
          hasRowError = true;
        } else {
          majorId = foundId;
        }
      }

      if (!hasRowError) {
        validItems.push({
          code,
          name,
          majorId,
          majorCode,
          academicYear,
        });
      }
    }

    return {
      totalRows: rawRows.length,
      validRows: validItems.length,
      invalidRows: rawRows.length - validItems.length,
      errors,
      validItems,
      previewData: validItems.slice(0, 10),
    };
  }
}
