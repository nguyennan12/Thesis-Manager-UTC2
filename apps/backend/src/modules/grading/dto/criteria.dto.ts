import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { TopicType } from '@prisma/client';

export class CriterionItemDto {
  @ApiProperty({ example: 'TC01', description: 'Mã tiêu chí (duy nhất trong bộ rubric)' })
  @IsString({ message: 'Mã tiêu chí phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Mã tiêu chí không được để trống.' })
  @MaxLength(20, { message: 'Mã tiêu chí tối đa 20 ký tự.' })
  code!: string;

  @ApiProperty({ example: 'Chất lượng báo cáo thuyết minh', description: 'Tên tiêu chí' })
  @IsString({ message: 'Tên tiêu chí phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Tên tiêu chí không được để trống.' })
  @MaxLength(200, { message: 'Tên tiêu chí tối đa 200 ký tự.' })
  name!: string;

  @ApiPropertyOptional({ example: 'Bố cục rõ ràng, văn phong khoa học, đúng chuẩn định dạng UTC2', description: 'Mô tả chi tiết' })
  @IsOptional()
  @IsString({ message: 'Mô tả tiêu chí phải là chuỗi ký tự.' })
  description?: string;

  @ApiProperty({ example: 30.0, description: 'Trọng số phần trăm (0 < weight <= 100)' })
  @IsNumber({}, { message: 'Trọng số tiêu chí phải là số thực.' })
  @Min(0.01, { message: 'Trọng số tiêu chí phải lớn hơn 0%.' })
  @Max(100.0, { message: 'Trọng số tiêu chí không vượt quá 100%.' })
  weight!: number;

  @ApiProperty({ enum: TopicType, example: TopicType.MAJOR, description: 'Loại đề tài' })
  @IsEnum(TopicType, { message: 'Loại đề tài phải là FOUNDATION hoặc MAJOR.' })
  topicType!: TopicType;

  @ApiPropertyOptional({ default: 1, example: 1, description: 'Thứ tự hiển thị' })
  @IsOptional()
  @IsInt({ message: 'Thứ tự hiển thị phải là số nguyên.' })
  @Min(1, { message: 'Thứ tự hiển thị tối thiểu là 1.' })
  orderIndex?: number = 1;
}

export class UpsertCriteriaDto {
  @ApiProperty({ type: [CriterionItemDto], description: 'Danh sách các tiêu chí đánh giá' })
  @IsArray({ message: 'Danh sách tiêu chí phải là một mảng.' })
  @ArrayMinSize(1, { message: 'Bộ tiêu chí phải có ít nhất 1 tiêu chí.' })
  @ValidateNested({ each: true })
  @Type(() => CriterionItemDto)
  criteria!: CriterionItemDto[];
}
