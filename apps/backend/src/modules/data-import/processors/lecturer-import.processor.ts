// ==============================================================================
// LECTURER IMPORT PROCESSOR (Validate & Transform Lecturer Import Rows)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { ProcessResult } from './student-import.processor';

export interface ValidatedLecturerItem {
  code: string;
  fullName: string;
  email: string;
  phone?: string;
  degree?: string;
  academicTitle?: string;
  departmentId: string;
  departmentCode: string;
}

@Injectable()
export class LecturerImportProcessor {
  constructor(private readonly prisma: PrismaService) {}

  async process(rawRows: Record<string, any>[]): Promise<ProcessResult<ValidatedLecturerItem>> {
    const errors: { row: number; column: string; message: string }[] = [];
    const validItems: ValidatedLecturerItem[] = [];

    // 1. Tải trước danh sách các bộ môn để ánh xạ
    const departments = await this.prisma.department.findMany({
      select: { id: true, code: true },
    });
    const deptMap = new Map<string, string>(departments.map((d) => [d.code.trim().toUpperCase(), d.id]));

    // 2. Tải trước danh sách mã GV và email hiện có trong hệ thống để chặn trùng lặp
    const [existingLecturers, existingAccounts] = await Promise.all([
      this.prisma.lecturer.findMany({ select: { code: true } }),
      this.prisma.account.findMany({ select: { username: true, email: true } }),
    ]);

    const systemCodes = new Set<string>(existingLecturers.map((l) => l.code.trim().toUpperCase()));
    const systemEmails = new Set<string>(existingAccounts.map((a) => a.email.trim().toLowerCase()));
    const systemUsernames = new Set<string>(existingAccounts.map((a) => a.username.trim().toUpperCase()));

    const fileCodes = new Set<string>();
    const fileEmails = new Set<string>();

    for (let index = 0; index < rawRows.length; index++) {
      const row = rawRows[index];
      const rowNum = index + 2;
      let hasRowError = false;

      const code = (row['Mã GV (*)'] || row['Mã GV'] || row['code'] || row['lecturerCode'] || '').toString().trim();
      const fullName = (row['Họ và tên (*)'] || row['Họ và tên'] || row['fullName'] || '').toString().trim();
      const email = (row['Email (*)'] || row['Email'] || row['email'] || '').toString().trim().toLowerCase();
      const phone = (row['Số điện thoại'] || row['phone'] || '').toString().trim();
      const degree = (row['Học vị'] || row['degree'] || '').toString().trim();
      const academicTitle = (row['Học hàm'] || row['academicTitle'] || '').toString().trim();
      const deptCode = (row['Mã bộ môn (*)'] || row['Mã bộ môn'] || row['departmentCode'] || '').toString().trim().toUpperCase();

      if (!code) {
        errors.push({ row: rowNum, column: 'Mã GV', message: 'Mã giảng viên không được để trống.' });
        hasRowError = true;
      } else {
        const codeUpper = code.toUpperCase();
        if (fileCodes.has(codeUpper)) {
          errors.push({ row: rowNum, column: 'Mã GV', message: `Mã GV '${code}' bị trùng lặp trong tệp.` });
          hasRowError = true;
        } else if (systemCodes.has(codeUpper) || systemUsernames.has(codeUpper)) {
          errors.push({ row: rowNum, column: 'Mã GV', message: `Mã GV '${code}' đã tồn tại trên hệ thống.` });
          hasRowError = true;
        }
        fileCodes.add(codeUpper);
      }

      if (!fullName) {
        errors.push({ row: rowNum, column: 'Họ và tên', message: 'Họ và tên giảng viên không được để trống.' });
        hasRowError = true;
      }

      if (!email) {
        errors.push({ row: rowNum, column: 'Email', message: 'Email không được để trống.' });
        hasRowError = true;
      } else {
        if (!email.includes('@')) {
          errors.push({ row: rowNum, column: 'Email', message: `Email '${email}' không đúng định dạng.` });
          hasRowError = true;
        } else if (fileEmails.has(email)) {
          errors.push({ row: rowNum, column: 'Email', message: `Email '${email}' bị trùng lặp trong tệp.` });
          hasRowError = true;
        } else if (systemEmails.has(email)) {
          errors.push({ row: rowNum, column: 'Email', message: `Email '${email}' đã được đăng ký tài khoản.` });
          hasRowError = true;
        }
        fileEmails.add(email);
      }

      let departmentId = '';
      if (!deptCode) {
        errors.push({ row: rowNum, column: 'Mã bộ môn', message: 'Mã bộ môn không được để trống.' });
        hasRowError = true;
      } else {
        const foundId = deptMap.get(deptCode);
        if (!foundId) {
          errors.push({ row: rowNum, column: 'Mã bộ môn', message: `Mã bộ môn '${deptCode}' không tồn tại trong danh mục.` });
          hasRowError = true;
        } else {
          departmentId = foundId;
        }
      }

      if (!hasRowError) {
        validItems.push({
          code,
          fullName,
          email,
          phone: phone || undefined,
          degree: degree || undefined,
          academicTitle: academicTitle || undefined,
          departmentId,
          departmentCode: deptCode,
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
