// ==============================================================================
// TEMPLATE GENERATOR HELPER (Generate Standard Excel .xlsx Import Templates)
// ==============================================================================

import { Workbook } from 'exceljs';

export class TemplateGeneratorHelper {
  static async generateTemplate(type: 'students' | 'lecturers' | 'classes'): Promise<Buffer> {
    const workbook = new Workbook();
    const sheet = workbook.addWorksheet('Dữ liệu mẫu');

    if (type === 'students') {
      sheet.columns = [
        { header: 'Mã SV (*)', key: 'code', width: 18 },
        { header: 'Họ và tên (*)', key: 'fullName', width: 25 },
        { header: 'Email (*)', key: 'email', width: 28 },
        { header: 'Số điện thoại', key: 'phone', width: 16 },
        { header: 'Giới tính', key: 'gender', width: 14 },
        { header: 'Mã lớp (*)', key: 'classCode', width: 16 },
      ];
      sheet.addRow({
        code: '6251071001',
        fullName: 'Nguyễn Văn An',
        email: '6251071001@utc2.edu.vn',
        phone: '0901234567',
        gender: 'MALE',
        classCode: 'CNTT-K62A',
      });
    } else if (type === 'lecturers') {
      sheet.columns = [
        { header: 'Mã GV (*)', key: 'code', width: 18 },
        { header: 'Họ và tên (*)', key: 'fullName', width: 25 },
        { header: 'Email (*)', key: 'email', width: 28 },
        { header: 'Số điện thoại', key: 'phone', width: 16 },
        { header: 'Học vị', key: 'degree', width: 15 },
        { header: 'Học hàm', key: 'academicTitle', width: 15 },
        { header: 'Mã bộ môn (*)', key: 'departmentCode', width: 18 },
      ];
      sheet.addRow({
        code: 'GV001',
        fullName: 'TS. Trần Văn Bình',
        email: 'binh.tv@utc2.edu.vn',
        phone: '0912345678',
        degree: 'Tiến sĩ',
        academicTitle: 'Phó Giáo sư',
        departmentCode: 'BM_CNPM',
      });
    } else {
      sheet.columns = [
        { header: 'Mã lớp (*)', key: 'code', width: 18 },
        { header: 'Tên lớp (*)', key: 'name', width: 25 },
        { header: 'Mã ngành (*)', key: 'majorCode', width: 18 },
        { header: 'Năm học (*)', key: 'academicYear', width: 18 },
      ];
      sheet.addRow({
        code: 'CNTT-K62A',
        name: 'Công nghệ thông tin K62A',
        majorCode: 'CNTT',
        academicYear: '2026-2027',
      });
    }

    // Định dạng dòng tiêu đề
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF004B87' }, // Màu xanh thương hiệu UTC2
    };
    headerRow.height = 24;

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
