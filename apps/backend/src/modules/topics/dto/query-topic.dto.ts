import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TopicStatus, TopicType } from '@prisma/client';

export class QueryTopicDto {
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

  @ApiPropertyOptional({ description: 'Từ khóa tìm kiếm (mã hoặc tên đề tài)' })
  @IsOptional()
  @IsString({ message: 'Từ khóa tìm kiếm phải là chuỗi ký tự.' })
  search?: string;

  @ApiPropertyOptional({ enum: TopicStatus, description: 'Lọc theo trạng thái đề tài' })
  @IsOptional()
  @IsEnum(TopicStatus, { message: 'Trạng thái đề tài không hợp lệ.' })
  status?: TopicStatus;

  @ApiPropertyOptional({ enum: TopicType, description: 'Lọc theo loại đề tài' })
  @IsOptional()
  @IsEnum(TopicType, { message: 'Loại đề tài không hợp lệ.' })
  topicType?: TopicType;

  @ApiPropertyOptional({ description: 'Lọc theo ID ngành đào tạo' })
  @IsOptional()
  @IsUUID('4', { message: 'Mã ngành không đúng định dạng UUID.' })
  majorId?: string;

  @ApiPropertyOptional({ description: 'Lọc theo ID học kỳ' })
  @IsOptional()
  @IsUUID('4', { message: 'Mã học kỳ không đúng định dạng UUID.' })
  semesterId?: string;

  @ApiPropertyOptional({ description: 'Lọc theo ID giảng viên đề xuất' })
  @IsOptional()
  @IsUUID('4', { message: 'Mã giảng viên không đúng định dạng UUID.' })
  lecturerId?: string;
}
