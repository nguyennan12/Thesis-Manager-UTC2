// ==============================================================================
// COUNCILS SERVICE (SRP: Defense Council Creation, Scheduling & Student Allocation)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { CouncilsRepository } from '../repositories/councils.repository';
import { PrismaService } from '../../../database/prisma.service';
import { TransactionManager } from '../../../database/transaction-manager';
import { AuditLogsService } from '../../audit-logs/services/audit-logs.service';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { CreateCouncilDto, QueryCouncilDto, AssignStudentsToCouncilDto } from '../dto/council.dto';
import { Result, AppError } from '../../../common/utils';
import { Council, CouncilRole, RegistrationStatus } from '@prisma/client';
import { PaginatedResult } from '../../../common/helpers/pagination.helper';

@Injectable()
export class CouncilsService {
  constructor(
    private readonly councilsRepo: CouncilsRepository,
    private readonly prisma: PrismaService,
    private readonly txManager: TransactionManager,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async createCouncil(dto: CreateCouncilDto, user: AuthenticatedUser): Promise<Result<Council>> {
    // 1. Kiểm tra trùng mã hội đồng
    const existingCode = await this.councilsRepo.findCouncilByCode(dto.code);
    if (existingCode) {
      return Result.err(AppError.conflict(`Mã hội đồng '${dto.code}' đã tồn tại.`));
    }

    // 2. BR-C2: Tối thiểu 3 thành viên
    if (!dto.members || dto.members.length < 3) {
      return Result.err(AppError.badRequest('Hội đồng bảo vệ phải có tối thiểu 3 thành viên theo BR-C2.'));
    }

    const hasChairman = dto.members.some((m) => m.role === CouncilRole.CHAIRMAN);
    const hasSecretary = dto.members.some((m) => m.role === CouncilRole.SECRETARY);
    if (!hasChairman || !hasSecretary) {
      return Result.err(AppError.badRequest('Hội đồng phải có ít nhất 1 Chủ tịch (CHAIRMAN) và 1 Thư ký (SECRETARY).'));
    }

    // 3. Kiểm tra trùng phòng / ca bảo vệ
    const defenseDate = new Date(dto.defenseDate);
    const conflict = await this.councilsRepo.findConflictingCouncil(
      defenseDate,
      dto.defenseRoom,
      dto.startTime,
      dto.endTime,
    );
    if (conflict) {
      return Result.err(
        AppError.conflict(`Phòng '${dto.defenseRoom}' đã được xếp cho hội đồng khác vào khung giờ ${dto.startTime}-${dto.endTime} ngày ${dto.defenseDate}.`),
      );
    }

    // 4. Lấy học kỳ hiện tại
    const currentSemester = await this.prisma.semester.findFirst({
      where: { isCurrent: true },
    });
    if (!currentSemester) {
      return Result.err(AppError.badRequest('Chưa có học kỳ nào đang mở hoạt động để thành lập hội đồng.'));
    }

    const created = await this.txManager.run(async (tx) => {
      const council = await this.councilsRepo.createCouncil(
        {
          code: dto.code,
          name: dto.name,
          defenseDate,
          defenseRoom: dto.defenseRoom,
          startTime: dto.startTime,
          endTime: dto.endTime,
          department: { connect: { id: dto.departmentId } },
          semester: { connect: { id: currentSemester.id } },
        },
        tx,
      );

      // Thêm các thành viên hội đồng
      await tx.councilMember.createMany({
        data: dto.members.map((m) => ({
          councilId: council.id,
          lecturerId: m.lecturerId,
          role: m.role,
        })),
      });

      return council;
    });

    this.auditLogsService.record({
      action: 'COUNCIL_CREATED',
      endpoint: '/api/v1/councils',
      httpMethod: 'POST',
      accountId: user.sub,
      payload: { councilId: created.id, code: created.code, name: created.name },
    });

    return Result.ok(created);
  }

  async findAll(query: QueryCouncilDto, user: AuthenticatedUser): Promise<Result<PaginatedResult<any>>> {
    const result = await this.councilsRepo.findAllCouncils(query);
    return Result.ok(result);
  }

  async findById(id: string): Promise<Result<any>> {
    const council = await this.councilsRepo.findCouncilById(id);
    if (!council) {
      return Result.err(AppError.notFound(`Không tìm thấy hội đồng với ID '${id}'.`));
    }
    return Result.ok(council);
  }

  async assignStudents(
    councilId: string,
    dto: AssignStudentsToCouncilDto,
    user: AuthenticatedUser,
  ): Promise<Result<any>> {
    const council = await this.councilsRepo.findCouncilById(councilId);
    if (!council) {
      return Result.err(AppError.notFound(`Không tìm thấy hội đồng với ID '${councilId}'.`));
    }

    const chairmanMember = council.members.find((m) => m.role === CouncilRole.CHAIRMAN);

    // Lấy danh sách hồ sơ sinh viên
    const regs = await this.prisma.registration.findMany({
      where: { id: { in: dto.registrationIds } },
      include: { student: true, topic: true },
    });

    for (const reg of regs) {
      // BR-C4: Chỉ sinh viên ĐỦ điều kiện mới được ra hội đồng
      if (reg.status !== RegistrationStatus.QUALIFIED_DEFENSE) {
        return Result.err(
          AppError.badRequest(`Sinh viên ${reg.student.fullName} (${reg.student.code}) chưa được GVHD xác nhận đủ điều kiện bảo vệ (QUALIFIED_DEFENSE).`),
        );
      }

      // BR-C3: GVHD không được làm Chủ tịch trong hội đồng chấm học trò của mình
      if (chairmanMember && reg.advisorLecturerId === chairmanMember.lecturerId) {
        return Result.err(
          AppError.badRequest(`Giảng viên hướng dẫn của sinh viên ${reg.student.fullName} đang giữ vai trò Chủ tịch hội đồng này (vi phạm tính khách quan theo BR-C3).`),
        );
      }
    }

    await this.councilsRepo.assignStudents(councilId, dto.registrationIds);

    this.auditLogsService.record({
      action: 'STUDENTS_ASSIGNED_TO_COUNCIL',
      endpoint: `/api/v1/councils/${councilId}/assign-students`,
      httpMethod: 'POST',
      accountId: user.sub,
      payload: { councilId, studentCount: dto.registrationIds.length },
    });

    return Result.ok({ success: true, assignedCount: dto.registrationIds.length });
  }
}
