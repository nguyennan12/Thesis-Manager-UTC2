import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class AssignReviewerDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID đề tài hoặc hồ sơ đăng ký cần gán phản biện' })
  @IsUUID('4', { message: 'Mã đề tài (topicId) không đúng định dạng UUID.' })
  @IsNotEmpty({ message: 'Mã đề tài không được để trống.' })
  topicId!: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001', description: 'ID giảng viên được phân công phản biện' })
  @IsUUID('4', { message: 'Mã giảng viên phản biện không đúng định dạng UUID.' })
  @IsNotEmpty({ message: 'Mã giảng viên phản biện không được để trống.' })
  reviewerLecturerId!: string;
}

export class ScoreReviewerDto {
  @ApiProperty({ example: 8.0, minimum: 0, maximum: 10, description: 'Điểm đánh giá của giảng viên phản biện (thang 10, chiếm 20% tổng điểm)' })
  @IsNumber({}, { message: 'Điểm phản biện phải là số thực.' })
  @Min(0, { message: 'Điểm phản biện tối thiểu là 0.0.' })
  @Max(10, { message: 'Điểm phản biện tối đa là 10.0.' })
  scoreReviewer!: number;

  @ApiPropertyOptional({ example: 'Đề tài có tính ứng dụng tốt, tài liệu thuyết minh đầy đủ, đồng ý cho bảo vệ', description: 'Nhận xét phản biện' })
  @IsOptional()
  @IsString({ message: 'Nhận xét phản biện phải là chuỗi ký tự.' })
  notes?: string;
}
