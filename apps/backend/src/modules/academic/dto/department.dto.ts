import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateDepartmentDto {
  @IsNotEmpty({ message: 'Mã bộ môn không được để trống' })
  @IsString({ message: 'Mã bộ môn phải là chuỗi ký tự' })
  @MaxLength(20, { message: 'Mã bộ môn không được vượt quá 20 ký tự' })
  code: string;

  @IsNotEmpty({ message: 'Tên bộ môn không được để trống' })
  @IsString({ message: 'Tên bộ môn phải là chuỗi ký tự' })
  @MaxLength(150, { message: 'Tên bộ môn không được vượt quá 150 ký tự' })
  name: string;

  @IsNotEmpty({ message: 'Mã định danh khoa (facultyId) không được để trống' })
  @IsUUID('4', { message: 'Mã khoa phải là UUID hợp lệ' })
  facultyId: string;
}

export class UpdateDepartmentDto {
  @IsOptional()
  @IsString({ message: 'Tên bộ môn phải là chuỗi ký tự' })
  @MaxLength(150, { message: 'Tên bộ môn không được vượt quá 150 ký tự' })
  name?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Mã khoa phải là UUID hợp lệ' })
  facultyId?: string;
}

export class QueryDepartmentDto {
  @IsOptional()
  @IsUUID('4', { message: 'Mã khoa phải là UUID hợp lệ' })
  facultyId?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
