import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ConfirmImportDto {
  @ApiProperty({ example: 'b3f54d6a-939e-4a6c-b258-29bf8643de5f', description: 'Token xác thực của phiên preview' })
  @IsString({ message: 'Token phiên import phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Token phiên import không được để trống.' })
  token!: string;
}
