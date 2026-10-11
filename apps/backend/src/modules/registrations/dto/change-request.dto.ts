import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';
import { ChangeRequestType } from '@prisma/client';

export class CreateChangeRequestDto {
  @ApiProperty({ enum: ChangeRequestType, example: ChangeRequestType.CHANGE_TOPIC, description: 'Loại yêu cầu thay đổi' })
  @IsEnum(ChangeRequestType, { message: 'Loại yêu cầu thay đổi không hợp lệ.' })
  type!: ChangeRequestType;

  @ApiProperty({ example: 'Đề tài hiện tại không phù hợp với định hướng công nghệ tại doanh nghiệp thực tập', description: 'Lý do xin thay đổi' })
  @IsString({ message: 'Lý do thay đổi phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Lý do thay đổi không được để trống.' })
  reason!: string;

  @ApiPropertyOptional({ example: { newTopicId: '550e8400-e29b-41d4-a716-446655440000' }, description: 'Dữ liệu thay đổi đính kèm (ví dụ: ID đề tài mới)' })
  @IsOptional()
  requestedData?: Record<string, any>;
}

export class ReviewChangeRequestDto {
  @ApiProperty({ example: true, description: 'Quyết định phê duyệt (true = DUYỆT, false = TỪ CHỐI)' })
  @IsBoolean({ message: 'Quyết định phê duyệt phải là boolean.' })
  isApproved!: boolean;

  @ApiPropertyOptional({ example: 'Đã quá thời hạn cho phép đổi đề tài của học kỳ', description: 'Lý do từ chối (bắt buộc khi isApproved = false)' })
  @ValidateIf((o) => o.isApproved === false)
  @IsNotEmpty({ message: 'Vui lòng cung cấp lý do từ chối yêu cầu thay đổi.' })
  @IsString({ message: 'Lý do từ chối phải là chuỗi ký tự.' })
  rejectionReason?: string;
}
