import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export enum StudentGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum StudentStatusEnum {
  STUDYING = 'STUDYING',
  RESERVED = 'RESERVED',
  DROPPED = 'DROPPED',
  GRADUATED = 'GRADUATED',
}

export class CreateStudentDto {
  @IsNotEmpty({ message: 'Mã số sinh viên không được để trống' })
  @IsString({ message: 'Mã số sinh viên phải là chuỗi ký tự' })
  @MaxLength(20, { message: 'Mã số sinh viên không vượt quá 20 ký tự' })
  code: string;

  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  @IsString({ message: 'Họ và tên phải là chuỗi ký tự' })
  @MaxLength(250, { message: 'Họ và tên không vượt quá 250 ký tự' })
  fullName: string;

  @IsOptional()
  @IsEnum(StudentGender, { message: 'Giới tính phải là MALE, FEMALE hoặc OTHER' })
  gender?: StudentGender;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày sinh phải là định dạng ngày hợp lệ' })
  dob?: string;

  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  phone?: string;

  @IsNotEmpty({ message: 'Mã lớp sinh hoạt không được để trống' })
  @IsUUID('4', { message: 'Mã lớp phải là UUID hợp lệ' })
  classId: string;

  @IsOptional()
  @IsNumber({}, { message: 'GPA tích lũy phải là số thập phân' })
  @Min(0, { message: 'GPA tối thiểu là 0.00' })
  @Max(4.0, { message: 'GPA tối đa theo thang 4 là 4.00' })
  gpaCumulative?: number;

  @IsOptional()
  @IsInt({ message: 'Số tín chỉ tích lũy phải là số nguyên' })
  @Min(0, { message: 'Số tín chỉ tích lũy không được âm' })
  creditsAccumulated?: number;
}

export class UpdateStudentDto {
  @IsOptional()
  @IsString({ message: 'Họ và tên phải là chuỗi ký tự' })
  @MaxLength(250, { message: 'Họ và tên không vượt quá 250 ký tự' })
  fullName?: string;

  @IsOptional()
  @IsEnum(StudentGender, { message: 'Giới tính phải là MALE, FEMALE hoặc OTHER' })
  gender?: StudentGender;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày sinh phải là định dạng ngày hợp lệ' })
  dob?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  phone?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Mã lớp phải là UUID hợp lệ' })
  classId?: string;

  @IsOptional()
  @IsNumber({}, { message: 'GPA tích lũy phải là số thập phân' })
  @Min(0, { message: 'GPA tối thiểu là 0.00' })
  @Max(4.0, { message: 'GPA tối đa theo thang 4 là 4.00' })
  gpaCumulative?: number;

  @IsOptional()
  @IsInt({ message: 'Số tín chỉ tích lũy phải là số nguyên' })
  @Min(0, { message: 'Số tín chỉ tích lũy không được âm' })
  creditsAccumulated?: number;

  @IsOptional()
  @IsEnum(StudentStatusEnum, { message: 'Trạng thái học tập không hợp lệ' })
  status?: StudentStatusEnum;
}

export class QueryStudentDto {
  @IsOptional()
  @IsUUID('4', { message: 'Mã lớp phải là UUID hợp lệ' })
  classId?: string;

  @IsOptional()
  @IsEnum(StudentStatusEnum, { message: 'Trạng thái học tập không hợp lệ' })
  status?: StudentStatusEnum;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
