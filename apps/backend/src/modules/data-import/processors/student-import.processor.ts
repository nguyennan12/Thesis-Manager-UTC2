// ==============================================================================
// STUDENT IMPORT PROCESSOR (Validate & Transform Student Import Rows)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Gender } from '@prisma/client';

export interface ValidatedStudentItem {
  code: string;
  fullName: string;
  email: string;
  phone?: string;
  gender: Gender;
  classId: string;
  classCode: string;
}

export interface ProcessResult<T> {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  errors: { row: number; column: string; message: string }[];
  validItems: T[];
  previewData: any[];
}

@Injectable()
export class StudentImportProcessor {
  constructor(private readonly prisma: PrismaService) {}

  async process(rawRows: Record<string, any>[]): Promise<ProcessResult<ValidatedStudentItem>> {
    const errors: { row: number; column: string; message: string }[] = [];
    const validItems: ValidatedStudentItem[] = [];

    // 1. Tải trước danh sách các lớp sinh viên để ánh xạ
    const classes = await this.prisma.class.findMany({
      select: { id: true, code: true },
    });
    const classMap = new Map<string, string>(classes.map((c) => [c.code.trim().toUpperCase(), c.id]));

    // 2. Tải trước danh sách mã SV và email hiện có trong hệ thống để chặn trùng lặp
    const [existingStudents, existingAccounts] = await Promise.all([
      this.prisma.student.findMany({ select: { code: true } }),
      this.prisma.account.findMany({ select: { username: true, email: true } }),
    ]);

    const systemCodes = new Set<string>(existingStudents.map((s) => s.code.trim().toUpperCase()));
    const systemEmails = new Set<string>(existingAccounts.map((a) => a.email.trim().toLowerCase()));
    const systemUsernames = new Set<string>(existingAccounts.map((a) => a.username.trim().toUpperCase()));

    const fileCodes = new Set<string>();
    const fileEmails = new Set<string>();

    for (let index = 0; index < rawRows.length; index++) {
      const row = rawRows[index];
      const rowNum = index + 2; // Dòng 1 là tiêu đề
      let hasRowError = false;

      const code = (row['Mã SV (*)'] || row['Mã SV'] || row['code'] || row['studentCode'] || '').toString().trim();
      const fullName = (row['Họ và tên (*)'] || row['Họ và tên'] || row['fullName'] || '').toString().trim();
      const email = (row['Email (*)'] || row['Email'] || row['email'] || '').toString().trim().toLowerCase();
      const phone = (row['Số điện thoại'] || row['phone'] || '').toString().trim();
      const genderRaw = (row['Giới tính'] || row['gender'] || 'MALE').toString().trim().toUpperCase();
      const classCode = (row['Mã lớp (*)'] || row['Mã lớp'] || row['classCode'] || '').toString().trim().toUpperCase();

      if (!code) {
        errors.push({ row: rowNum, column: 'Mã SV', message: 'Mã sinh viên không được để trống.' });
        hasRowError = true;
      } else {
        const codeUpper = code.toUpperCase();
        if (fileCodes.has(codeUpper)) {
          errors.push({ row: rowNum, column: 'Mã SV', message: `Mã SV '${code}' bị trùng lặp trong tệp.` });
          hasRowError = true;
        } else if (systemCodes.has(codeUpper) || systemUsernames.has(codeUpper)) {
          errors.push({ row: rowNum, column: 'Mã SV', message: `Mã SV '${code}' đã tồn tại trên hệ thống.` });
          hasRowError = true;
        }
        fileCodes.add(codeUpper);
      }

      if (!fullName) {
        errors.push({ row: rowNum, column: 'Họ và tên', message: 'Họ và tên sinh viên không được để trống.' });
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

      let classId = '';
      if (!classCode) {
        errors.push({ row: rowNum, column: 'Mã lớp', message: 'Mã lớp không được để trống.' });
        hasRowError = true;
      } else {
        const foundId = classMap.get(classCode);
        if (!foundId) {
          errors.push({ row: rowNum, column: 'Mã lớp', message: `Mã lớp '${classCode}' không tồn tại trong danh mục.` });
          hasRowError = true;
        } else {
          classId = foundId;
        }
      }

      let gender: Gender = Gender.MALE;
      if (genderRaw === 'FEMALE' || genderRaw === 'NỮ') gender = Gender.FEMALE;
      else if (genderRaw === 'OTHER' || genderRaw === 'KHÁC') gender = Gender.OTHER;

      if (!hasRowError) {
        validItems.push({
          code,
          fullName,
          email,
          phone: phone || undefined,
          gender,
          classId,
          classCode,
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
