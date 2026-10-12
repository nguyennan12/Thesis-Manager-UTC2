// ==============================================================================
// REVIEWERS SERVICE (SRP: Reviewer Assignment & Pre-Defense Evaluation)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { AuditLogsService } from '../../audit-logs/services/audit-logs.service';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { AssignReviewerDto, ScoreReviewerDto } from '../dto/reviewer.dto';
import { Result, AppError } from '../../../common/utils';
import { ROLES } from '../../../common/constants/roles.constant';
import { Prisma, Topic } from '@prisma/client';

@Injectable()
export class ReviewersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async assignReviewer(dto: AssignReviewerDto, user: AuthenticatedUser): Promise<Result<Topic>> {
    const topic = await this.prisma.topic.findUnique({
      where: { id: dto.topicId },
    });
    if (!topic) {
      return Result.err(AppError.notFound(`Không tìm thấy đề tài với ID '${dto.topicId}'.`));
    }

    // BR-C1: Giảng viên phản biện tuyệt đối KHÔNG được trùng với Giảng viên hướng dẫn
    if (topic.proposerLecturerId === dto.reviewerLecturerId) {
      return Result.err(
        AppError.badRequest('Giảng viên phản biện (GVPB) không được trùng với Giảng viên hướng dẫn (GVHD) theo BR-C1.'),
      );
    }

    const reviewer = await this.prisma.lecturer.findUnique({
      where: { id: dto.reviewerLecturerId },
    });
    if (!reviewer) {
      return Result.err(AppError.notFound(`Không tìm thấy giảng viên phản biện với ID '${dto.reviewerLecturerId}'.`));
    }

    const updated = await this.prisma.topic.update({
      where: { id: dto.topicId },
      data: {
        reviewerLecturer: { connect: { id: dto.reviewerLecturerId } },
      },
    });

    this.auditLogsService.record({
      action: 'REVIEWER_ASSIGNED',
      endpoint: '/api/v1/reviewers/assign',
      httpMethod: 'POST',
      accountId: user.sub,
      payload: { topicId: topic.id, reviewerId: reviewer.id, reviewerName: reviewer.fullName },
    });

    return Result.ok(updated);
  }

  async scoreReviewer(
    registrationId: string,
    dto: ScoreReviewerDto,
    user: AuthenticatedUser,
  ): Promise<Result<any>> {
    const reg = await this.prisma.registration.findUnique({
      where: { id: registrationId },
      include: { topic: true },
    });
    if (!reg) {
      return Result.err(AppError.notFound(`Không tìm thấy hồ sơ đồ án với ID '${registrationId}'.`));
    }

    const isReviewer = user.lecturerId && reg.topic.reviewerLecturerId === user.lecturerId;
    const isAdmin = user.roles?.includes(ROLES.ADMIN);

    if (!isReviewer && !isAdmin) {
      return Result.err(
        AppError.forbidden('Chỉ giảng viên được phân công phản biện đề tài này mới có quyền nhập điểm phản biện.'),
      );
    }

    const updated = await this.prisma.registration.update({
      where: { id: registrationId },
      data: {
        scoreReviewer: new Prisma.Decimal(dto.scoreReviewer.toString()),
      },
    });

    this.auditLogsService.record({
      action: 'REVIEWER_SCORE_SUBMITTED',
      endpoint: `/api/v1/reviewers/${registrationId}/score`,
      httpMethod: 'PATCH',
      accountId: user.sub,
      payload: { registrationId, scoreReviewer: dto.scoreReviewer },
    });

    return Result.ok(updated);
  }

  async getMyAssignments(user: AuthenticatedUser): Promise<Result<any[]>> {
    if (!user.lecturerId && !user.roles?.includes(ROLES.ADMIN)) {
      return Result.ok([]);
    }

    const whereClause: Prisma.RegistrationWhereInput = user.roles?.includes(ROLES.ADMIN)
      ? { topic: { reviewerLecturerId: { not: null } } }
      : { topic: { reviewerLecturerId: user.lecturerId } };

    const registrations = await this.prisma.registration.findMany({
      where: whereClause,
      include: {
        student: true,
        topic: {
          include: {
            proposerLecturer: true,
            department: true,
          },
        },
        targetPlagiarisms: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const items = registrations.map((r) => ({
      id: r.id,
      registrationId: r.id,
      topicId: r.topicId,
      topicCode: r.topic.code,
      topicTitle: r.topic.titleVi,
      studentCode: r.student.code,
      studentName: r.student.fullName,
      proposerName: r.topic.proposerLecturer?.fullName || 'GV Hướng dẫn',
      departmentName: r.topic.department?.name || 'Bộ môn',
      reportUrl: r.reportSubmissionUrl,
      plagiarismRate: r.targetPlagiarisms[0] ? Number(r.targetPlagiarisms[0].similarityPercentage) : 0,
      score: r.scoreReviewer ? Number(r.scoreReviewer) : null,
      comment: r.advisorFeedback,
      status: r.scoreReviewer !== null ? 'GRADED' : 'PENDING',
    }));

    return Result.ok(items);
  }
}
