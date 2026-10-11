import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class ReviewTopicDto {
  @ApiProperty({ example: true, description: 'Quyết định thẩm định (true = DUYỆT, false = TỪ CHỐI)' })
  @IsBoolean({ message: 'Quyết định thẩm định phải là boolean (true/false).' })
  isApproved!: boolean;

  @ApiPropertyOptional({ example: 'Đề tài trùng lặp với hướng nghiên cứu khóa trước', description: 'Lý do từ chối (bắt buộc khi isApproved = false)' })
  @ValidateIf((o) => o.isApproved === false)
  @IsNotEmpty({ message: 'Vui lòng cung cấp lý do từ chối đề tài để giảng viên chỉnh sửa.' })
  @IsString({ message: 'Lý do từ chối phải là chuỗi ký tự.' })
  rejectionReason?: string;
}
