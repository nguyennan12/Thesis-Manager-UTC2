import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsDateString, MaxLength } from 'class-validator';

export class CreateSemesterDto {
  @IsNotEmpty({ message: 'Mã học kỳ không được để trống' })
  @IsString({ message: 'Mã học kỳ phải là chuỗi ký tự' })
  @MaxLength(20, { message: 'Mã học kỳ không được vượt quá 20 ký tự' })
  code: string;

  @IsNotEmpty({ message: 'Tên học kỳ không được để trống' })
  @IsString({ message: 'Tên học kỳ phải là chuỗi ký tự' })
  @MaxLength(100, { message: 'Tên học kỳ không được vượt quá 100 ký tự' })
  name: string;

  @IsNotEmpty({ message: 'Năm học không được để trống' })
  @IsString({ message: 'Năm học phải là chuỗi ký tự' })
  @MaxLength(20, { message: 'Năm học không được vượt quá 20 ký tự' })
  academicYear: string;

  @IsNotEmpty({ message: 'Ngày bắt đầu học kỳ không được để trống' })
  @IsDateString({}, { message: 'Ngày bắt đầu phải là định dạng ngày hợp lệ (ISO8601)' })
  startDate: string;

  @IsNotEmpty({ message: 'Ngày kết thúc học kỳ không được để trống' })
  @IsDateString({}, { message: 'Ngày kết thúc phải là định dạng ngày hợp lệ (ISO8601)' })
  endDate: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày mở đăng ký đề tài phải là định dạng ngày hợp lệ' })
  topicRegistrationStart?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày đóng đăng ký đề tài phải là định dạng ngày hợp lệ' })
  topicRegistrationEnd?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày bắt đầu thực hiện đồ án phải là định dạng ngày hợp lệ' })
  executionStart?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày kết thúc thực hiện đồ án phải là định dạng ngày hợp lệ' })
  executionEnd?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Hạn nộp báo cáo toàn văn phải là định dạng ngày hợp lệ' })
  thesisSubmissionEnd?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày bắt đầu bảo vệ đồ án phải là định dạng ngày hợp lệ' })
  defenseStart?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày kết thúc bảo vệ đồ án phải là định dạng ngày hợp lệ' })
  defenseEnd?: string;

  @IsOptional()
  @IsBoolean({ message: 'Trạng thái học kỳ hiện tại phải là giá trị boolean' })
  isCurrent?: boolean;
}

export class UpdateSemesterDto {
  @IsOptional()
  @IsString({ message: 'Tên học kỳ phải là chuỗi ký tự' })
  @MaxLength(100, { message: 'Tên học kỳ không được vượt quá 100 ký tự' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Năm học phải là chuỗi ký tự' })
  @MaxLength(20, { message: 'Năm học không được vượt quá 20 ký tự' })
  academicYear?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày bắt đầu phải là định dạng ngày hợp lệ' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày kết thúc phải là định dạng ngày hợp lệ' })
  endDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày mở đăng ký đề tài phải là định dạng ngày hợp lệ' })
  topicRegistrationStart?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày đóng đăng ký đề tài phải là định dạng ngày hợp lệ' })
  topicRegistrationEnd?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày bắt đầu thực hiện đồ án phải là định dạng ngày hợp lệ' })
  executionStart?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày kết thúc thực hiện đồ án phải là định dạng ngày hợp lệ' })
  executionEnd?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Hạn nộp báo cáo toàn văn phải là định dạng ngày hợp lệ' })
  thesisSubmissionEnd?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày bắt đầu bảo vệ đồ án phải là định dạng ngày hợp lệ' })
  defenseStart?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày kết thúc bảo vệ đồ án phải là định dạng ngày hợp lệ' })
  defenseEnd?: string;
}
