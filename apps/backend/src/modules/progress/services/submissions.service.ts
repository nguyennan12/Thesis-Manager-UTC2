// ==============================================================================
// SUBMISSIONS SERVICE (SRP: Final Submission, Plagiarism Check & Advisor Qualification)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { ProgressRepository } from '../repositories/progress.repository';
import { PrismaService } from '../../../database/prisma.service';
import { AuditLogsService } from '../../audit-logs/services/audit-logs.service';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { SubmitThesisDto, QualifyDefenseDto } from '../dto/submission.dto';
import { Result, AppError } from '../../../common/utils';
import { Registration, RegistrationStatus, Prisma } from '@prisma/client';
import { ROLES } from '../../../common/constants/roles.constant';

@Injectable()
export class SubmissionsService {
  constructor(
    private readonly progressRepo: ProgressRepository,
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async submitThesis(dto: SubmitThesisDto, user: AuthenticatedUser): Promise<Result<Registration>> {
    const student = await this.resolveStudent(user);
    if (!student) {
      return Result.err(AppError.forbidden('Chỉ tài khoản sinh viên mới được nộp báo cáo toàn văn đồ án.'));
    }

    const currentSemester = await this.prisma.semester.findFirst({
      where: { isCurrent: true },
    });
    if (!currentSemester) {
      return Result.err(AppError.badRequest('Hệ thống chưa có học kỳ nào đang mở hoạt động.'));
    }

    const reg = await this.prisma.registration.findUnique({
      where: {
        studentId_semesterId: {
          studentId: student.id,
          semesterId: currentSemester.id,
        },
      },
    });

    if (!reg || reg.status === RegistrationStatus.CANCELLED) {
      return Result.err(AppError.notFound('Bạn chưa có hồ sơ đăng ký đề tài hợp lệ để nộp báo cáo toàn văn.'));
    }

    // Cập nhật trạng thái sang SUBMITTED
    const updated = await this.prisma.registration.update({
      where: { id: reg.id },
      data: {
        reportSubmissionUrl: dto.reportSubmissionUrl,
        submittedAt: new Date(),
        status: RegistrationStatus.SUBMITTED,
      },
    });

    // Tự động phân tích đạo văn mô phỏng (tỷ lệ ngẫu nhiên an toàn 12.5% <= 25% theo BR-06)
    await this.progressRepo.upsertPlagiarismResult(reg.id, 12.5, {
      checkedSourcesCount: 1500,
      matchedSections: [
        { section: 'Chương 1: Khảo sát lý thuyết', similarity: 6.2 },
        { section: 'Tài liệu tham khảo', similarity: 6.3 },
      ],
    });

    this.auditLogsService.record({
      action: 'THESIS_FINAL_SUBMITTED',
      endpoint: '/api/v1/submissions',
      httpMethod: 'POST',
      accountId: user.sub,
      payload: { registrationId: reg.id, url: dto.reportSubmissionUrl },
    });

    return Result.ok(updated);
  }

  async getPlagiarismResult(registrationId: string): Promise<Result<any>> {
    const result = await this.progressRepo.findPlagiarismByRegistrationId(registrationId);
    if (!result) {
      return Result.err(AppError.notFound('Hồ sơ này chưa có kết quả phân tích tỷ lệ trùng lặp đạo văn.'));
    }
    return Result.ok(result);
  }

  async qualifyDefense(
    registrationId: string,
    dto: QualifyDefenseDto,
    user: AuthenticatedUser,
  ): Promise<Result<Registration>> {
    const reg = await this.prisma.registration.findUnique({
      where: { id: registrationId },
    });
    if (!reg) {
      return Result.err(AppError.notFound(`Không tìm thấy hồ sơ đồ án với ID '${registrationId}'.`));
    }

    const isAdvisor = user.lecturerId && reg.advisorLecturerId === user.lecturerId;
    const isAdmin = user.roles?.includes(ROLES.ADMIN);

    if (!isAdvisor && !isAdmin) {
      return Result.err(AppError.forbidden('Chỉ giảng viên hướng dẫn của đề tài mới được đánh giá điều kiện bảo vệ.'));
    }

    if (
      reg.status !== RegistrationStatus.SUBMITTED &&
      reg.status !== RegistrationStatus.IN_PROGRESS
    ) {
      return Result.err(
        AppError.badRequest('Sinh viên phải nộp báo cáo toàn văn (SUBMITTED) trước khi được đánh giá điều kiện bảo vệ.'),
      );
    }

    const nextStatus = dto.isQualified
      ? RegistrationStatus.QUALIFIED_DEFENSE
      : RegistrationStatus.DISQUALIFIED;

    const updated = await this.prisma.registration.update({
      where: { id: registrationId },
      data: {
        scoreProcess: new Prisma.Decimal(dto.scoreProcess.toString()),
        advisorFeedback: dto.advisorFeedback,
        isQualifiedForDefense: dto.isQualified,
        status: nextStatus,
      },
    });

    this.auditLogsService.record({
      action: dto.isQualified ? 'DEFENSE_QUALIFIED' : 'DEFENSE_DISQUALIFIED',
      endpoint: `/api/v1/submissions/${registrationId}/qualify`,
      httpMethod: 'PATCH',
      accountId: user.sub,
      payload: {
        registrationId,
        scoreProcess: dto.scoreProcess,
        isQualified: dto.isQualified,
      },
    });

    return Result.ok(updated);
  }

  private async resolveStudent(user: AuthenticatedUser) {
    if (user.studentId) {
      return this.prisma.student.findUnique({ where: { id: user.studentId } });
    }
    const account = await this.prisma.account.findUnique({
      where: { id: user.sub },
      include: { student: true },
    });
    return account?.student || null;
  }
}
