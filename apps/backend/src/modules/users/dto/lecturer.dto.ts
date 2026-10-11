import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateLecturerDto {
  @IsNotEmpty({ message: 'Mã giảng viên không được để trống' })
  @IsString({ message: 'Mã giảng viên phải là chuỗi ký tự' })
  @MaxLength(20, { message: 'Mã giảng viên không vượt quá 20 ký tự' })
  code: string;

  @IsNotEmpty({ message: 'Họ và tên giảng viên không được để trống' })
  @IsString({ message: 'Họ và tên giảng viên phải là chuỗi ký tự' })
  @MaxLength(250, { message: 'Họ và tên giảng viên không vượt quá 250 ký tự' })
  fullName: string;

  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Học hàm/học vị phải là chuỗi ký tự' })
  degree?: string;

  @IsNotEmpty({ message: 'Mã bộ môn (departmentId) không được để trống' })
  @IsUUID('4', { message: 'Mã bộ môn phải là UUID hợp lệ' })
  departmentId: string;

  @IsOptional()
  @IsInt({ message: 'Định mức hướng dẫn phải là số nguyên' })
  @Min(1, { message: 'Định mức hướng dẫn tối thiểu là 1' })
  maxAdvisingQuota?: number;
}

export class UpdateLecturerDto {
  @IsOptional()
  @IsString({ message: 'Họ và tên giảng viên phải là chuỗi ký tự' })
  @MaxLength(250, { message: 'Họ và tên giảng viên không vượt quá 250 ký tự' })
  fullName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Học hàm/học vị phải là chuỗi ký tự' })
  degree?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Mã bộ môn phải là UUID hợp lệ' })
  departmentId?: string;

  @IsOptional()
  @IsInt({ message: 'Định mức hướng dẫn phải là số nguyên' })
  @Min(1, { message: 'Định mức hướng dẫn tối thiểu là 1' })
  maxAdvisingQuota?: number;

  @IsOptional()
  @IsBoolean({ message: 'Trạng thái hoạt động phải là boolean' })
  isActive?: boolean;
}

export class QueryLecturerDto {
  @IsOptional()
  @IsUUID('4', { message: 'Mã bộ môn phải là UUID hợp lệ' })
  departmentId?: string;

  @IsOptional()
  @IsString()
  degree?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
