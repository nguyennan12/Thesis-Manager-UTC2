// ==============================================================================
// ASSIGN PERMISSIONS DTO
// ==============================================================================

import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class AssignPermissionsDto {
  @IsArray({ message: 'Danh sách quyền phải là một mảng' })
  @ArrayNotEmpty({ message: 'Danh sách quyền không được để trống' })
  @IsUUID('4', { each: true, message: 'Mỗi permissionId phải là định dạng UUID v4 hợp lệ' })
  permissionIds: string[];
}
