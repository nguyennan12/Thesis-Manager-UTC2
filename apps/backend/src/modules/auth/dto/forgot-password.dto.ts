// ==============================================================================
// FORGOT PASSWORD DTO
// ==============================================================================

import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Địa chỉ email không đúng định dạng hợp lệ' })
  email: string;
}
