// ==============================================================================
// CREATE ROLE DTO
// ==============================================================================

import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, Matches } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Mã vai trò không được để trống' })
  @IsString({ message: 'Mã vai trò phải là chuỗi ký tự' })
  @MinLength(2, { message: 'Mã vai trò phải có tối thiểu 2 ký tự' })
  @MaxLength(50, { message: 'Mã vai trò không được vượt quá 50 ký tự' })
  @Matches(/^[A-Z0-9_]+$/, {
    message: 'Mã vai trò chỉ được chứa chữ in hoa, chữ số và dấu gạch dưới',
  })
  code: string;

  @IsNotEmpty({ message: 'Tên vai trò không được để trống' })
  @IsString({ message: 'Tên vai trò phải là chuỗi ký tự' })
  @MinLength(2, { message: 'Tên vai trò phải có tối thiểu 2 ký tự' })
  @MaxLength(100, { message: 'Tên vai trò không được vượt quá 100 ký tự' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi ký tự' })
  description?: string;
}
