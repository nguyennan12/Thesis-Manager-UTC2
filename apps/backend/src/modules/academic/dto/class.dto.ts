import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateClassDto {
  @IsNotEmpty({ message: 'Mã lớp không được để trống' })
  @IsString({ message: 'Mã lớp phải là chuỗi ký tự' })
  @MaxLength(20, { message: 'Mã lớp không được vượt quá 20 ký tự' })
  code: string;

  @IsNotEmpty({ message: 'Tên lớp không được để trống' })
  @IsString({ message: 'Tên lớp phải là chuỗi ký tự' })
  @MaxLength(150, { message: 'Tên lớp không được vượt quá 150 ký tự' })
  name: string;

  @IsNotEmpty({ message: 'Mã định danh ngành (majorId) không được để trống' })
  @IsUUID('4', { message: 'Mã ngành phải là UUID hợp lệ' })
  majorId: string;

  @IsNotEmpty({ message: 'Niên khóa không được để trống' })
  @IsString({ message: 'Niên khóa phải là chuỗi ký tự' })
  @MaxLength(20, { message: 'Niên khóa không được vượt quá 20 ký tự' })
  academicYear: string;

  @IsOptional()
  @IsUUID('4', { message: 'Mã giảng viên chủ nhiệm phải là UUID hợp lệ' })
  homeroomAdvisorId?: string;
}

export class UpdateClassDto {
  @IsOptional()
  @IsString({ message: 'Tên lớp phải là chuỗi ký tự' })
  @MaxLength(150, { message: 'Tên lớp không được vượt quá 150 ký tự' })
  name?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Mã ngành phải là UUID hợp lệ' })
  majorId?: string;

  @IsOptional()
  @IsString({ message: 'Niên khóa phải là chuỗi ký tự' })
  @MaxLength(20, { message: 'Niên khóa không được vượt quá 20 ký tự' })
  academicYear?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Mã giảng viên chủ nhiệm phải là UUID hợp lệ' })
  homeroomAdvisorId?: string;
}

export class QueryClassDto {
  @IsOptional()
  @IsUUID('4', { message: 'Mã ngành phải là UUID hợp lệ' })
  majorId?: string;

  @IsOptional()
  @IsString()
  academicYear?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
