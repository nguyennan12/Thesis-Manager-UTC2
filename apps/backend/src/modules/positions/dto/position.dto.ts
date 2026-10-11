import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export enum PositionType {
  HEAD_OF_DEPARTMENT = 'HEAD_OF_DEPARTMENT',
  FACULTY_DEAN = 'FACULTY_DEAN',
  ACADEMIC_AFFAIRS = 'ACADEMIC_AFFAIRS',
  TRAINING_DEPT = 'TRAINING_DEPT',
}

export class AssignPositionDto {
  @IsNotEmpty({ message: 'Chức danh không được để trống' })
  @IsEnum(PositionType, {
    message: 'Chức danh phải là HEAD_OF_DEPARTMENT, FACULTY_DEAN, ACADEMIC_AFFAIRS hoặc TRAINING_DEPT',
  })
  position: PositionType;

  @IsNotEmpty({ message: 'Loại phạm vi (scopeType) không được để trống' })
  @IsString({ message: 'Loại phạm vi phải là GLOBAL, FACULTY hoặc DEPARTMENT' })
  scopeType: string; // GLOBAL, FACULTY, DEPARTMENT

  @IsOptional()
  @IsUUID('4', { message: 'Mã phạm vi (scopeId) phải là UUID hợp lệ' })
  scopeId?: string;
}

export class AssignDepartmentHeadDto {
  @IsNotEmpty({ message: 'Mã định danh giảng viên (lecturerId) không được để trống' })
  @IsUUID('4', { message: 'Mã giảng viên phải là UUID hợp lệ' })
  lecturerId: string;
}
