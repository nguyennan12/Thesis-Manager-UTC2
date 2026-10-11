import { describe, it, expect } from 'vitest';
import { FileGuardHelper } from './file-guard.helper';

describe('FileGuardHelper', () => {
  it('should reject missing file or empty buffer', () => {
    expect(FileGuardHelper.validateUpload(undefined)).toContain('Vui lòng tải lên tệp dữ liệu');
    expect(FileGuardHelper.validateUpload({} as any)).toContain('Vui lòng tải lên tệp dữ liệu');
  });

  it('should reject files exceeding 5MB', () => {
    const largeFile: any = {
      originalname: 'data.xlsx',
      size: 6 * 1024 * 1024,
      buffer: Buffer.alloc(10),
    };
    expect(FileGuardHelper.validateUpload(largeFile)).toContain('vượt quá giới hạn cho phép');
  });

  it('should reject deprecated .xls and other unsupported extensions', () => {
    const xlsFile: any = {
      originalname: 'data.xls',
      size: 1024,
      buffer: Buffer.alloc(10),
    };
    expect(FileGuardHelper.validateUpload(xlsFile)).toContain('không hỗ trợ định dạng cũ .xls');

    const txtFile: any = {
      originalname: 'data.txt',
      size: 1024,
      buffer: Buffer.alloc(10),
    };
    expect(FileGuardHelper.validateUpload(txtFile)).toContain('chỉ hỗ trợ định dạng tệp .xlsx hoặc .csv');
  });

  it('should reject corrupted .xlsx files with invalid PK magic bytes', () => {
    const fakeXlsx: any = {
      originalname: 'corrupted.xlsx',
      size: 1024,
      buffer: Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04]),
    };
    expect(FileGuardHelper.validateUpload(fakeXlsx)).toContain('không đúng định dạng chuẩn hoặc đã bị hỏng');
  });

  it('should accept valid .xlsx file with PK zip header', () => {
    const validXlsx: any = {
      originalname: 'students.xlsx',
      size: 1024,
      buffer: Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x00, 0x00]),
    };
    expect(FileGuardHelper.validateUpload(validXlsx)).toBeNull();
  });

  it('should accept valid .csv file', () => {
    const validCsv: any = {
      originalname: 'students.csv',
      size: 500,
      buffer: Buffer.from('studentCode,fullName,email\n123,Nguyen Van A,a@utc2.edu.vn'),
    };
    expect(FileGuardHelper.validateUpload(validCsv)).toBeNull();
  });
});
