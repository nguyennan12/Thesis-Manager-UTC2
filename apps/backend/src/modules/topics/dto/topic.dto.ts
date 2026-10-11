import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { TopicType } from '@prisma/client';

export class CreateTopicDto {
  @ApiProperty({ example: 'Xây dựng hệ thống quản lý đồ án tốt nghiệp UTC2', description: 'Tên đề tài tiếng Việt' })
  @IsString({ message: 'Tên đề tài tiếng Việt phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Tên đề tài tiếng Việt không được để trống.' })
  @MaxLength(300, { message: 'Tên đề tài tiếng Việt tối đa 300 ký tự.' })
  titleVi!: string;

  @ApiPropertyOptional({ example: 'Building UTC2 Thesis Management System', description: 'Tên đề tài tiếng Anh' })
  @IsOptional()
  @IsString({ message: 'Tên đề tài tiếng Anh phải là chuỗi ký tự.' })
  @MaxLength(300, { message: 'Tên đề tài tiếng Anh tối đa 300 ký tự.' })
  titleEn?: string;

  @ApiPropertyOptional({ description: 'Mô tả tóm tắt nội dung đề tài' })
  @IsOptional()
  @IsString({ message: 'Mô tả đề tài phải là chuỗi ký tự.' })
  description?: string;

  @ApiPropertyOptional({ description: 'Mục tiêu nghiên cứu và phát triển của đề tài' })
  @IsOptional()
  @IsString({ message: 'Mục tiêu đề tài phải là chuỗi ký tự.' })
  objectives?: string;

  @ApiPropertyOptional({ description: 'Yêu cầu kiến thức, công nghệ đối với sinh viên' })
  @IsOptional()
  @IsString({ message: 'Yêu cầu đề tài phải là chuỗi ký tự.' })
  requirements?: string;

  @ApiPropertyOptional({ enum: TopicType, default: TopicType.MAJOR, description: 'Loại đề tài' })
  @IsOptional()
  @IsEnum(TopicType, { message: 'Loại đề tài phải là FOUNDATION hoặc MAJOR.' })
  topicType?: TopicType = TopicType.MAJOR;

  @ApiPropertyOptional({ default: 1, minimum: 1, maximum: 2, description: 'Số lượng sinh viên tối đa' })
  @IsOptional()
  @IsInt({ message: 'Số lượng sinh viên phải là số nguyên.' })
  @Min(1, { message: 'Đề tài tối thiểu 1 sinh viên.' })
  @Max(2, { message: 'Đề tài tối đa 2 sinh viên (BR-04).' })
  maxStudents?: number = 1;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID Ngành đào tạo áp dụng đề tài' })
  @IsUUID('4', { message: 'Mã ngành đào tạo (majorId) không đúng định dạng UUID.' })
  @IsNotEmpty({ message: 'Mã ngành đào tạo không được để trống.' })
  majorId!: string;
}

export class UpdateTopicDto {
  @ApiPropertyOptional({ description: 'Tên đề tài tiếng Việt' })
  @IsOptional()
  @IsString({ message: 'Tên đề tài tiếng Việt phải là chuỗi ký tự.' })
  @MaxLength(300, { message: 'Tên đề tài tiếng Việt tối đa 300 ký tự.' })
  titleVi?: string;

  @ApiPropertyOptional({ description: 'Tên đề tài tiếng Anh' })
  @IsOptional()
  @IsString({ message: 'Tên đề tài tiếng Anh phải là chuỗi ký tự.' })
  @MaxLength(300, { message: 'Tên đề tài tiếng Anh tối đa 300 ký tự.' })
  titleEn?: string;

  @ApiPropertyOptional({ description: 'Mô tả tóm tắt nội dung đề tài' })
  @IsOptional()
  @IsString({ message: 'Mô tả đề tài phải là chuỗi ký tự.' })
  description?: string;

  @ApiPropertyOptional({ description: 'Mục tiêu nghiên cứu' })
  @IsOptional()
  @IsString({ message: 'Mục tiêu đề tài phải là chuỗi ký tự.' })
  objectives?: string;

  @ApiPropertyOptional({ description: 'Yêu cầu đối với sinh viên' })
  @IsOptional()
  @IsString({ message: 'Yêu cầu đề tài phải là chuỗi ký tự.' })
  requirements?: string;

  @ApiPropertyOptional({ enum: TopicType, description: 'Loại đề tài' })
  @IsOptional()
  @IsEnum(TopicType, { message: 'Loại đề tài phải là FOUNDATION hoặc MAJOR.' })
  topicType?: TopicType;

  @ApiPropertyOptional({ minimum: 1, maximum: 2, description: 'Số lượng sinh viên tối đa' })
  @IsOptional()
  @IsInt({ message: 'Số lượng sinh viên phải là số nguyên.' })
  @Min(1, { message: 'Đề tài tối thiểu 1 sinh viên.' })
  @Max(2, { message: 'Đề tài tối đa 2 sinh viên.' })
  maxStudents?: number;

  @ApiPropertyOptional({ description: 'ID Ngành đào tạo' })
  @IsOptional()
  @IsUUID('4', { message: 'Mã ngành đào tạo không đúng định dạng UUID.' })
  majorId?: string;
}
