// ==============================================================================
// FILE GUARD HELPER (Strict File Type, Size, Magic Bytes & Line Limit Validation)
// ==============================================================================

import { Workbook } from 'exceljs';
import { parse as parseCsv } from 'csv-parse/sync';

export interface FileValidationError {
  row: number;
  column: string;
  message: string;
}

export class FileGuardHelper {
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private static readonly MAX_ROWS = 2000;

  /**
   * Kiểm tra định dạng tệp, kích thước và magic bytes
   */
  static validateUpload(file?: Express.Multer.File): string | null {
    if (!file || !file.buffer) {
      return 'Vui lòng tải lên tệp dữ liệu Excel (.xlsx) hoặc CSV (.csv).';
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return 'Dung lượng tệp vượt quá giới hạn cho phép (tối đa 5MB).';
    }

    const filename = file.originalname.toLowerCase();
    const isXlsx = filename.endsWith('.xlsx');
    const isCsv = filename.endsWith('.csv');

    if (!isXlsx && !isCsv) {
      return 'Hệ thống chỉ hỗ trợ định dạng tệp .xlsx hoặc .csv (không hỗ trợ định dạng cũ .xls).';
    }

    // Kiểm tra Magic Bytes cho .xlsx (PK zip file format: 0x50, 0x4B, 0x03, 0x04)
    if (isXlsx && file.buffer.length >= 4) {
      const b0 = file.buffer[0];
      const b1 = file.buffer[1];
      const b2 = file.buffer[2];
      const b3 = file.buffer[3];
      if (b0 !== 0x50 || b1 !== 0x4b || b2 !== 0x03 || b3 !== 0x04) {
        return 'Tệp tin .xlsx không đúng định dạng chuẩn hoặc đã bị hỏng cấu trúc.';
      }
    }

    return null;
  }

  /**
   * Đọc nội dung tệp Excel hoặc CSV thành danh sách các dòng dữ liệu đối tượng
   */
  static async parseToRows(file: Express.Multer.File): Promise<Record<string, any>[]> {
    const filename = file.originalname.toLowerCase();

    if (filename.endsWith('.csv')) {
      const records = parseCsv(file.buffer.toString('utf-8'), {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      if (records.length > this.MAX_ROWS) {
        throw new Error(`File dữ liệu vượt quá giới hạn tối đa ${this.MAX_ROWS} dòng (hiện có ${records.length} dòng).`);
      }

      return records;
    }

    // Đọc Excel (.xlsx) qua ExcelJS
    const workbook = new Workbook();
    // ExcelJS load buffer
    await workbook.xlsx.load(file.buffer as any);
    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      return [];
    }

    const rows: Record<string, any>[] = [];
    const headers: string[] = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        row.eachCell((cell, colNumber) => {
          headers[colNumber] = cell.text?.trim() || `col_${colNumber}`;
        });
      } else {
        const rowData: Record<string, any> = {};
        let hasData = false;

        row.eachCell((cell, colNumber) => {
          const header = headers[colNumber];
          if (header) {
            const val = cell.text?.trim();
            if (val) {
              rowData[header] = val;
              hasData = true;
            }
          }
        });

        if (hasData) {
          rows.push(rowData);
        }
      }
    });

    if (rows.length > this.MAX_ROWS) {
      throw new Error(`File dữ liệu vượt quá giới hạn tối đa ${this.MAX_ROWS} dòng (hiện có ${rows.length} dòng).`);
    }

    return rows;
  }
}
