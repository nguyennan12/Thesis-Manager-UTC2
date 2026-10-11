import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
  @IsString({ message: 'Tên đăng nhập phải là chuỗi ký tự' })
  username: string;

  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @IsNotEmpty({ message: 'Vai trò (role) không được để trống' })
  @IsString({ message: 'Vai trò phải là ADMIN, LECTURER, STUDENT hoặc STAFF' })
  role: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Mã sinh viên liên kết phải là UUID hợp lệ' })
  studentId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Mã giảng viên liên kết phải là UUID hợp lệ' })
  lecturerId?: string;
}

export class UpdateUserStatusDto {
  @IsNotEmpty({ message: 'Trạng thái hoạt động không được để trống' })
  @IsBoolean({ message: 'Trạng thái hoạt động phải là boolean' })
  isActive: boolean;
}

export class QueryUserDto {
  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
