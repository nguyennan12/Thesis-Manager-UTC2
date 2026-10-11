import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CriterionScoreItemDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID tiêu chí đánh giá trong Rubric' })
  @IsUUID('4', { message: 'Mã tiêu chí (criterionId) không đúng định dạng UUID.' })
  @IsNotEmpty({ message: 'Mã tiêu chí không được để trống.' })
  criterionId!: string;

  @ApiProperty({ example: 8.5, minimum: 0, maximum: 10, description: 'Điểm chấm cho tiêu chí này (thang 10)' })
  @IsNumber({}, { message: 'Điểm tiêu chí phải là số thực.' })
  @Min(0, { message: 'Điểm tiêu chí tối thiểu là 0.0.' })
  @Max(10, { message: 'Điểm tiêu chí tối đa là 10.0.' })
  score!: number;

  @ApiPropertyOptional({ example: 'Phần demo hoạt động tốt, trả lời câu hỏi tự tin', description: 'Ghi chú nhận xét của người chấm' })
  @IsOptional()
  @IsString({ message: 'Ghi chú nhận xét phải là chuỗi ký tự.' })
  notes?: string;
}

export class SubmitDetailedScoreDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001', description: 'ID hồ sơ đăng ký đồ án của sinh viên' })
  @IsUUID('4', { message: 'Mã hồ sơ đăng ký không đúng định dạng UUID.' })
  @IsNotEmpty({ message: 'Mã hồ sơ đăng ký không được để trống.' })
  registrationId!: string;

  @ApiProperty({ type: [CriterionScoreItemDto], description: 'Danh sách điểm theo từng tiêu chí Rubric' })
  @IsArray({ message: 'Danh sách điểm tiêu chí phải là một mảng.' })
  @ArrayMinSize(1, { message: 'Phải nhập điểm cho ít nhất 1 tiêu chí.' })
  @ValidateNested({ each: true })
  @Type(() => CriterionScoreItemDto)
  scores!: CriterionScoreItemDto[];
}
