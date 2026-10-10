// ==============================================================================
// UPDATE ROLE DTO
// ==============================================================================

import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateRoleDto {
  @IsOptional()
  @IsString({ message: 'Tên vai trò phải là chuỗi ký tự' })
  @MinLength(2, { message: 'Tên vai trò phải có tối thiểu 2 ký tự' })
  @MaxLength(100, { message: 'Tên vai trò không được vượt quá 100 ký tự' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi ký tự' })
  description?: string;
}
