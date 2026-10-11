import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { TopicType } from '@prisma/client';

export class QueryRubricSetDto {
  @ApiPropertyOptional({ default: 1, minimum: 1, description: 'Số trang' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Số trang phải là số nguyên.' })
  @Min(1, { message: 'Số trang phải lớn hơn hoặc bằng 1.' })
  page?: number = 1;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100, description: 'Số lượng mục trên một trang' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Số lượng mục mỗi trang phải là số nguyên.' })
  @Min(1, { message: 'Số lượng mục mỗi trang tối thiểu là 1.' })
  @Max(100, { message: 'Số lượng mục mỗi trang tối đa là 100.' })
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Từ khóa tìm kiếm (mã hoặc tên)' })
  @IsOptional()
  @IsString({ message: 'Từ khóa tìm kiếm phải là chuỗi ký tự.' })
  search?: string;

  @ApiPropertyOptional({ enum: TopicType, description: 'Lọc theo loại đề tài' })
  @IsOptional()
  @IsEnum(TopicType, { message: 'Loại đề tài phải là FOUNDATION hoặc MAJOR.' })
  topicType?: TopicType;

  @ApiPropertyOptional({ description: 'Lọc theo năm học' })
  @IsOptional()
  @IsString({ message: 'Năm học phải là chuỗi ký tự.' })
  academicYear?: string;

  @ApiPropertyOptional({ description: 'Lọc theo trạng thái kích hoạt' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'Trạng thái isActive phải là boolean.' })
  isActive?: boolean;
}
