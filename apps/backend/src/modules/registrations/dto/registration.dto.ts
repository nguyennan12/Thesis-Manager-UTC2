import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRegistrationDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID đề tài tốt nghiệp cần đăng ký' })
  @IsUUID('4', { message: 'Mã đề tài (topicId) không đúng định dạng UUID.' })
  @IsNotEmpty({ message: 'Mã đề tài không được để trống.' })
  topicId!: string;
}

export class AssignRegistrationDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID sinh viên được phân công' })
  @IsUUID('4', { message: 'Mã sinh viên (studentId) không đúng định dạng UUID.' })
  @IsNotEmpty({ message: 'Mã sinh viên không được để trống.' })
  studentId!: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001', description: 'ID đề tài được phân công' })
  @IsUUID('4', { message: 'Mã đề tài (topicId) không đúng định dạng UUID.' })
  @IsNotEmpty({ message: 'Mã đề tài không được để trống.' })
  topicId!: string;
}
