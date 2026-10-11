import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateFacultyDto {
  @IsNotEmpty({ message: 'Mã khoa không được để trống' })
  @IsString({ message: 'Mã khoa phải là chuỗi ký tự' })
  @MaxLength(20, { message: 'Mã khoa không được vượt quá 20 ký tự' })
  code: string;

  @IsNotEmpty({ message: 'Tên khoa không được để trống' })
  @IsString({ message: 'Tên khoa phải là chuỗi ký tự' })
  @MaxLength(150, { message: 'Tên khoa không được vượt quá 150 ký tự' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Mô tả khoa phải là chuỗi ký tự' })
  description?: string;
}

export class UpdateFacultyDto {
  @IsOptional()
  @IsString({ message: 'Tên khoa phải là chuỗi ký tự' })
  @MaxLength(150, { message: 'Tên khoa không được vượt quá 150 ký tự' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Mô tả khoa phải là chuỗi ký tự' })
  description?: string;
}
