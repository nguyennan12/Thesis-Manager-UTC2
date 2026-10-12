import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

export class CreateProgressReportDto {
  @ApiProperty({ example: 1, minimum: 1, maximum: 15, description: 'Tuần báo cáo (1 - 15)' })
  @IsInt({ message: 'Số thứ tự tuần phải là số nguyên.' })
  @Min(1, { message: 'Tuần báo cáo tối thiểu là tuần 1.' })
  @Max(15, { message: 'Tuần báo cáo tối đa là tuần 15.' })
  weekNumber!: number;

  @ApiPropertyOptional({ example: 'Đã hoàn thành khảo sát hiện trạng và thiết kế ERD cơ sở dữ liệu', description: 'Các công việc đã hoàn thành trong tuần' })
  @IsOptional()
  @IsString({ message: 'Nội dung công việc hoàn thành phải là chuỗi ký tự.' })
  tasksCompleted?: string;

  @IsOptional()
  @IsString()
  completedTasks?: string;

  @ApiPropertyOptional({ example: 'Xây dựng API xác thực và giao diện đăng nhập', description: 'Kế hoạch công việc tuần tiếp theo' })
  @IsOptional()
  @IsString({ message: 'Kế hoạch tuần tới phải là chuỗi ký tự.' })
  nextWeekPlan?: string;

  @IsOptional()
  @IsString()
  plannedTasks?: string;

  @IsOptional()
  @IsString()
  difficulties?: string;

  @IsOptional()
  @IsString()
  registrationId?: string;

  @ApiPropertyOptional({ example: 'https://storage.utc2.edu.vn/reports/week1.pdf', description: 'Đường dẫn tệp báo cáo hoặc tài liệu đính kèm' })
  @IsOptional()
  @IsString({ message: 'Đường dẫn tài liệu đính kèm phải là chuỗi ký tự.' })
  attachmentUrl?: string;
}

export class ReviewProgressReportDto {
  @ApiProperty({ example: 'ĐẠT', description: 'Đánh giá mức độ hoàn thành (TỐT, KHÁ, ĐẠT, CHƯA ĐẠT)' })
  @IsString({ message: 'Mức độ hoàn thành phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Mức độ hoàn thành không được để trống.' })
  completionLevel!: string;

  @ApiPropertyOptional({ example: 'Tiến độ tốt, cần bổ sung thêm giải thích các quan hệ trong ERD', description: 'Nhận xét chi tiết của GVHD' })
  @IsOptional()
  @IsString({ message: 'Nhận xét của GVHD phải là chuỗi ký tự.' })
  advisorFeedback?: string;
}
