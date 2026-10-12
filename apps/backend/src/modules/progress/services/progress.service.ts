// ==============================================================================
// PROGRESS SERVICE (SRP: Weekly Progress Submission, Advisor Reviews & Warnings)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { ProgressRepository } from '../repositories/progress.repository';
import { PrismaService } from '../../../database/prisma.service';
import { AuditLogsService } from '../../audit-logs/services/audit-logs.service';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { CreateProgressReportDto, ReviewProgressReportDto } from '../dto/progress-report.dto';
import { Result, AppError } from '../../../common/utils';
import { ProgressReport, ProgressStatus, RegistrationStatus } from '@prisma/client';
import { ROLES } from '../../../common/constants/roles.constant';

@Injectable()
export class ProgressService {
  constructor(
    private readonly progressRepo: ProgressRepository,
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async createReport(dto: CreateProgressReportDto, user: AuthenticatedUser): Promise<Result<ProgressReport>> {
    const student = await this.resolveStudent(user);
    if (!student) {
      return Result.err(AppError.forbidden('Chỉ tài khoản sinh viên mới được nộp báo cáo tiến độ tuần.'));
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

    if (!reg) {
      return Result.err(AppError.notFound('Bạn chưa có hồ sơ đăng ký đề tài nào trong học kỳ này để nộp báo cáo.'));
    }

    if (reg.status === RegistrationStatus.DISQUALIFIED || reg.status === RegistrationStatus.FAILED) {
      return Result.err(AppError.badRequest('Hồ sơ đồ án không đủ điều kiện hoặc đã dừng, không thể nộp báo cáo.'));
    }

    // Kiểm tra trùng tuần báo cáo
    const existingWeek = await this.progressRepo.findReportByWeek(reg.id, dto.weekNumber);
    if (existingWeek) {
      return Result.err(AppError.conflict(`Bạn đã nộp báo cáo cho tuần thứ ${dto.weekNumber} rồi.`));
    }

    const report = await this.progressRepo.createReport({
      registration: { connect: { id: reg.id } },
      weekNumber: dto.weekNumber,
      tasksCompleted: dto.tasksCompleted || dto.completedTasks || '',
      nextWeekPlan: dto.nextWeekPlan || dto.plannedTasks || '',
      attachmentUrl: dto.attachmentUrl,
      status: ProgressStatus.PENDING,
      reviewerLecturer: { connect: { id: reg.advisorLecturerId } },
    });

    // Tự động chuyển status sang IN_PROGRESS nếu vừa mới REGISTERED
    if (reg.status === RegistrationStatus.REGISTERED) {
      await this.prisma.registration.update({
        where: { id: reg.id },
        data: { status: RegistrationStatus.IN_PROGRESS },
      });
    }

    this.auditLogsService.record({
      action: 'PROGRESS_REPORT_SUBMITTED',
      endpoint: '/api/v1/progress/reports',
      httpMethod: 'POST',
      accountId: user.sub,
      payload: { reportId: report.id, weekNumber: report.weekNumber, registrationId: reg.id },
    });

    return Result.ok(report);
  }

  async getReportsByRegistrationId(registrationId: string): Promise<Result<ProgressReport[]>> {
    const reg = await this.prisma.registration.findUnique({ where: { id: registrationId } });
    if (!reg) {
      return Result.err(AppError.notFound(`Không tìm thấy hồ sơ đồ án với ID '${registrationId}'.`));
    }

    const reports = await this.progressRepo.findReportsByRegistrationId(registrationId);
    return Result.ok(reports);
  }

  async reviewReport(
    id: string,
    dto: ReviewProgressReportDto,
    user: AuthenticatedUser,
  ): Promise<Result<ProgressReport>> {
    const report = await this.progressRepo.findReportById(id);
    if (!report) {
      return Result.err(AppError.notFound(`Không tìm thấy báo cáo tiến độ với ID '${id}'.`));
    }

    const isAdvisor = user.lecturerId && report.registration.advisorLecturerId === user.lecturerId;
    const isAdmin = user.roles?.includes(ROLES.ADMIN);

    if (!isAdvisor && !isAdmin) {
      return Result.err(AppError.forbidden('Chỉ giảng viên hướng dẫn của đề tài mới được đánh giá báo cáo này.'));
    }

    const reviewed = await this.progressRepo.updateReport(id, {
      completionLevel: dto.completionLevel,
      advisorFeedback: dto.advisorFeedback,
      status: ProgressStatus.REVIEWED,
      reviewedAt: new Date(),
    });

    this.auditLogsService.record({
      action: 'PROGRESS_REPORT_REVIEWED',
      endpoint: `/api/v1/progress/reports/${id}/review`,
      httpMethod: 'PATCH',
      accountId: user.sub,
      payload: { reportId: id, completionLevel: dto.completionLevel },
    });

    return Result.ok(reviewed);
  }

  async getWarnings(semesterId?: string): Promise<Result<any[]>> {
    const students = await this.progressRepo.findWarningStudents(semesterId);

    // Lọc các sinh viên có ít hơn 2 báo cáo hoặc cần cảnh báo
    const warnings = students.map((s) => ({
      registrationId: s.id,
      studentCode: s.student.code,
      studentName: s.student.fullName,
      studentEmail: s.student.email,
      studentPhone: s.student.phone,
      topicCode: s.topic.code,
      topicTitle: s.topic.titleVi,
      advisorName: s.advisorLecturer.fullName,
      advisorEmail: s.advisorLecturer.email,
      submittedReportsCount: s._count.progressReports,
      isDelayed: s._count.progressReports < 2,
    }));

    return Result.ok(warnings);
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
