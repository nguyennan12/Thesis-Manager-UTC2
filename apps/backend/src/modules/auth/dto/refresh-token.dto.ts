// ==============================================================================
// REFRESH TOKEN DTO
// ==============================================================================

import { IsOptional, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsOptional()
  @IsString({ message: 'Refresh token phải là chuỗi ký tự' })
  refreshToken?: string;
}
