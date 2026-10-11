import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { RegistrationStatus } from '@prisma/client';

export class QueryRegistrationDto {
  @ApiPropertyOptional({ default: 1, minimum: 1, description: 'Số trang' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Số trang phải là số nguyên.' })
  @Min(1, { message: 'Số trang tối thiểu là 1.' })
  page?: number = 1;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100, description: 'Số mục mỗi trang' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Số mục mỗi trang phải là số nguyên.' })
  @Min(1, { message: 'Số mục tối thiểu là 1.' })
  @Max(100, { message: 'Số mục tối đa là 100.' })
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Từ khóa tìm kiếm (Mã SV, họ tên hoặc mã đề tài)' })
  @IsOptional()
  @IsString({ message: 'Từ khóa tìm kiếm phải là chuỗi ký tự.' })
  search?: string;

  @ApiPropertyOptional({ enum: RegistrationStatus, description: 'Lọc theo trạng thái hồ sơ đồ án' })
  @IsOptional()
  @IsEnum(RegistrationStatus, { message: 'Trạng thái đăng ký không hợp lệ.' })
  status?: RegistrationStatus;

  @ApiPropertyOptional({ description: 'Lọc theo ID học kỳ' })
  @IsOptional()
  @IsUUID('4', { message: 'Mã học kỳ không đúng định dạng UUID.' })
  semesterId?: string;

  @ApiPropertyOptional({ description: 'Lọc theo ID giảng viên hướng dẫn' })
  @IsOptional()
  @IsUUID('4', { message: 'Mã giảng viên không đúng định dạng UUID.' })
  advisorLecturerId?: string;
}
