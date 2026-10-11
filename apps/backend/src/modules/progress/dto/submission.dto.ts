import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class SubmitThesisDto {
  @ApiProperty({ example: 'https://storage.utc2.edu.vn/thesis/baocao_toanvan.pdf', description: 'Đường dẫn tệp báo cáo toàn văn (.pdf)' })
  @IsString({ message: 'Đường dẫn báo cáo toàn văn phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Vui lòng cung cấp đường dẫn báo cáo toàn văn.' })
  reportSubmissionUrl!: string;

  @ApiPropertyOptional({ example: 'https://storage.utc2.edu.vn/thesis/slide.pptx', description: 'Đường dẫn slide thuyết trình' })
  @IsOptional()
  @IsString({ message: 'Đường dẫn slide phải là chuỗi ký tự.' })
  presentationUrl?: string;

  @ApiPropertyOptional({ example: 'https://github.com/utc2/thesis-project', description: 'Đường dẫn mã nguồn (Source code repo)' })
  @IsOptional()
  @IsString({ message: 'Đường dẫn mã nguồn phải là chuỗi ký tự.' })
  sourceCodeUrl?: string;

  @ApiPropertyOptional({ example: 'https://thesis-demo.utc2.edu.vn', description: 'Đường dẫn sản phẩm chạy thực tế (Demo link)' })
  @IsOptional()
  @IsString({ message: 'Đường dẫn demo phải là chuỗi ký tự.' })
  demoUrl?: string;
}

export class QualifyDefenseDto {
  @ApiProperty({ example: true, description: 'Xác nhận sinh viên ĐỦ điều kiện bảo vệ (true = ĐỦ, false = KHÔNG ĐỦ)' })
  @IsBoolean({ message: 'Cờ điều kiện bảo vệ phải là boolean (true/false).' })
  isQualified!: boolean;

  @ApiProperty({ example: 8.5, minimum: 0, maximum: 10, description: 'Điểm đánh giá quá trình thực hiện đồ án của GVHD (thang 10)' })
  @IsNumber({}, { message: 'Điểm quá trình phải là số thực.' })
  @Min(0, { message: 'Điểm quá trình tối thiểu là 0.0.' })
  @Max(10, { message: 'Điểm quá trình tối đa là 10.0.' })
  scoreProcess!: number;

  @ApiPropertyOptional({ example: 'Sinh viên tích cực, hoàn thành đầy đủ yêu cầu đề tài, đủ điều kiện bảo vệ', description: 'Nhận xét của GVHD' })
  @IsOptional()
  @IsString({ message: 'Nhận xét của GVHD phải là chuỗi ký tự.' })
  advisorFeedback?: string;
}
