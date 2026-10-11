import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { TopicType } from '@prisma/client';

export class CreateRubricSetDto {
  @ApiProperty({ example: 'RUBRIC_K20_MAJOR', description: 'Mã bộ tiêu chí (duy nhất)' })
  @IsString({ message: 'Mã bộ tiêu chí phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Mã bộ tiêu chí không được để trống.' })
  @MaxLength(30, { message: 'Mã bộ tiêu chí tối đa 30 ký tự.' })
  code!: string;

  @ApiProperty({ example: 'Bộ tiêu chí đánh giá KLTN Chuyên ngành Khóa 2022', description: 'Tên bộ tiêu chí' })
  @IsString({ message: 'Tên bộ tiêu chí phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Tên bộ tiêu chí không được để trống.' })
  @MaxLength(200, { message: 'Tên bộ tiêu chí tối đa 200 ký tự.' })
  name!: string;

  @ApiProperty({ enum: TopicType, example: TopicType.MAJOR, description: 'Loại đề tài' })
  @IsEnum(TopicType, { message: 'Loại đề tài phải là FOUNDATION hoặc MAJOR.' })
  topicType!: TopicType;

  @ApiProperty({ example: '2026-2027', description: 'Năm học áp dụng' })
  @IsString({ message: 'Năm học phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Năm học không được để trống.' })
  @MaxLength(20, { message: 'Năm học tối đa 20 ký tự.' })
  academicYear!: string;
}

export class UpdateRubricSetDto {
  @ApiPropertyOptional({ example: 'Bộ tiêu chí đánh giá KLTN Chuyên ngành (Cập nhật)', description: 'Tên bộ tiêu chí' })
  @IsOptional()
  @IsString({ message: 'Tên bộ tiêu chí phải là chuỗi ký tự.' })
  @MaxLength(200, { message: 'Tên bộ tiêu chí tối đa 200 ký tự.' })
  name?: string;
}
