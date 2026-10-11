import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class UpdateLecturerQuotaDto {
  @IsNotEmpty({ message: 'Chỉ tiêu hướng dẫn (maxQuota) không được để trống' })
  @IsInt({ message: 'Chỉ tiêu hướng dẫn phải là số nguyên' })
  @Min(1, { message: 'Chỉ tiêu hướng dẫn tối thiểu phải là 1' })
  maxQuota: number;
}
