// ==============================================================================
// ASSIGN ACCOUNT ROLE DTO
// ==============================================================================

import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ROLE_SCOPES, RoleScope } from '../../../common/constants/roles.constant';

export class AssignAccountRoleDto {
  @IsNotEmpty({ message: 'roleId không được để trống' })
  @IsUUID('4', { message: 'roleId phải là định dạng UUID v4 hợp lệ' })
  roleId: string;

  @IsOptional()
  @IsEnum(ROLE_SCOPES, { message: 'Phạm vi Scope không hợp lệ' })
  scopeType?: RoleScope;

  @IsOptional()
  @IsString({ message: 'scopeId phải là chuỗi ký tự' })
  scopeId?: string;

  @IsOptional()
  @IsDateString({}, { message: 'validFrom phải là định dạng ngày hợp lệ (YYYY-MM-DD)' })
  validFrom?: string;

  @IsOptional()
  @IsDateString({}, { message: 'validTo phải là định dạng ngày hợp lệ (YYYY-MM-DD)' })
  validTo?: string;
}
