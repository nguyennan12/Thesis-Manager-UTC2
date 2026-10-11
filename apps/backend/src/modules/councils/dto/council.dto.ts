import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CouncilRole } from '@prisma/client';

export class CouncilMemberInputDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID giảng viên tham gia Hội đồng' })
  @IsUUID('4', { message: 'Mã giảng viên không đúng định dạng UUID.' })
  @IsNotEmpty({ message: 'Mã giảng viên không được để trống.' })
  lecturerId!: string;

  @ApiProperty({ enum: CouncilRole, example: CouncilRole.CHAIRMAN, description: 'Vai trò trong hội đồng (CHAIRMAN, SECRETARY, MEMBER)' })
  @IsEnum(CouncilRole, { message: 'Vai trò hội đồng phải là CHAIRMAN, SECRETARY hoặc MEMBER.' })
  role!: CouncilRole;
}

export class CreateCouncilDto {
  @ApiProperty({ example: 'HD_CNPM_01', description: 'Mã hội đồng (duy nhất)' })
  @IsString({ message: 'Mã hội đồng phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Mã hội đồng không được để trống.' })
  code!: string;

  @ApiProperty({ example: 'Hội đồng chấm KLTN Bộ môn CNPM số 1', description: 'Tên hội đồng' })
  @IsString({ message: 'Tên hội đồng phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Tên hội đồng không được để trống.' })
  name!: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID Bộ môn trực thuộc' })
  @IsUUID('4', { message: 'Mã bộ môn không đúng định dạng UUID.' })
  @IsNotEmpty({ message: 'Mã bộ môn không được để trống.' })
  departmentId!: string;

  @ApiProperty({ example: '2027-01-15', description: 'Ngày diễn ra bảo vệ (YYYY-MM-DD)' })
  @IsString({ message: 'Ngày bảo vệ phải là chuỗi ký tự ngày.' })
  @IsNotEmpty({ message: 'Ngày bảo vệ không được để trống.' })
  defenseDate!: string;

  @ApiProperty({ example: 'Phòng A4-301', description: 'Phòng bảo vệ' })
  @IsString({ message: 'Phòng bảo vệ phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Phòng bảo vệ không được để trống.' })
  defenseRoom!: string;

  @ApiProperty({ example: '08:00', description: 'Giờ bắt đầu' })
  @IsString({ message: 'Giờ bắt đầu phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Giờ bắt đầu không được để trống.' })
  startTime!: string;

  @ApiProperty({ example: '12:00', description: 'Giờ kết thúc' })
  @IsString({ message: 'Giờ kết thúc phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Giờ kết thúc không được để trống.' })
  endTime!: string;

  @ApiProperty({ type: [CouncilMemberInputDto], description: 'Danh sách thành viên hội đồng (tối thiểu 3 thành viên theo BR-C2)' })
  @IsArray({ message: 'Danh sách thành viên phải là mảng.' })
  @ArrayMinSize(3, { message: 'Hội đồng bảo vệ phải có tối thiểu 3 thành viên (Chủ tịch, Thư ký, Ủy viên) theo BR-C2.' })
  @ValidateNested({ each: true })
  @Type(() => CouncilMemberInputDto)
  members!: CouncilMemberInputDto[];
}

export class QueryCouncilDto {
  @ApiPropertyOptional({ default: 1, minimum: 1, description: 'Số trang' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Số trang phải là số nguyên.' })
  @Min(1, { message: 'Số trang tối thiểu là 1.' })
  page?: number = 1;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100, description: 'Số mục mỗi trang' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Số mục mỗi trang phải là số nguyên.' })
  @Min(1, { message: 'Số mục tối thiểu là 1.' })
  @Max(100, { message: 'Số mục tối đa là 100.' })
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Từ khóa tìm kiếm (Mã hoặc tên hội đồng, phòng)' })
  @IsOptional()
  @IsString({ message: 'Từ khóa tìm kiếm phải là chuỗi ký tự.' })
  search?: string;

  @ApiPropertyOptional({ description: 'Lọc theo ID học kỳ' })
  @IsOptional()
  @IsUUID('4', { message: 'Mã học kỳ không đúng định dạng UUID.' })
  semesterId?: string;

  @ApiPropertyOptional({ description: 'Lọc theo ID bộ môn' })
  @IsOptional()
  @IsUUID('4', { message: 'Mã bộ môn không đúng định dạng UUID.' })
  departmentId?: string;
}

export class AssignStudentsToCouncilDto {
  @ApiProperty({ type: [String], description: 'Danh sách ID hồ sơ đăng ký của sinh viên (registration IDs)' })
  @IsArray({ message: 'Danh sách hồ sơ sinh viên phải là mảng.' })
  @ArrayMinSize(1, { message: 'Vui lòng chọn ít nhất 1 sinh viên để phân công vào hội đồng.' })
  @IsUUID('4', { each: true, message: 'ID hồ sơ đăng ký không đúng định dạng UUID.' })
  registrationIds!: string[];
}
