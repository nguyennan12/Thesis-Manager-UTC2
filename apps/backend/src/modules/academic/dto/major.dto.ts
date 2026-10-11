import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateMajorDto {
  @IsNotEmpty({ message: 'Mã ngành không được để trống' })
  @IsString({ message: 'Mã ngành phải là chuỗi ký tự' })
  @MaxLength(20, { message: 'Mã ngành không được vượt quá 20 ký tự' })
  code: string;

  @IsNotEmpty({ message: 'Tên ngành không được để trống' })
  @IsString({ message: 'Tên ngành phải là chuỗi ký tự' })
  @MaxLength(150, { message: 'Tên ngành không được vượt quá 150 ký tự' })
  name: string;

  @IsNotEmpty({ message: 'Mã định danh khoa (facultyId) không được để trống' })
  @IsUUID('4', { message: 'Mã khoa phải là UUID hợp lệ' })
  facultyId: string;
}

export class UpdateMajorDto {
  @IsOptional()
  @IsString({ message: 'Tên ngành phải là chuỗi ký tự' })
  @MaxLength(150, { message: 'Tên ngành không được vượt quá 150 ký tự' })
  name?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Mã khoa phải là UUID hợp lệ' })
  facultyId?: string;
}

export class QueryMajorDto {
  @IsOptional()
  @IsUUID('4', { message: 'Mã khoa phải là UUID hợp lệ' })
  facultyId?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
