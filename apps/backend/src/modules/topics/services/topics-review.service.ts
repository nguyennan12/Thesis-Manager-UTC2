// ==============================================================================
// TOPICS REVIEW SERVICE (SRP: Department Head Topic Assessment & Decision)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { TopicRepository } from '../repositories/topic.repository';
import { PrismaService } from '../../../database/prisma.service';
import { AuditLogsService } from '../../audit-logs/services/audit-logs.service';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { ReviewTopicDto } from '../dto/review-topic.dto';
import { Result, AppError } from '../../../common/utils';
import { ROLES } from '../../../common/constants/roles.constant';
import { Topic, TopicStatus } from '@prisma/client';

@Injectable()
export class TopicsReviewService {
  constructor(
    private readonly topicRepo: TopicRepository,
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async review(id: string, dto: ReviewTopicDto, user: AuthenticatedUser): Promise<Result<Topic>> {
    const topic = await this.topicRepo.findById(id);
    if (!topic) {
      return Result.err(AppError.notFound(`Không tìm thấy đề tài với ID '${id}'.`));
    }

    if (topic.status !== TopicStatus.PENDING_REVIEW) {
      return Result.err(AppError.badRequest('Đề tài hiện không ở trạng thái chờ thẩm định (PENDING_REVIEW).'));
    }

    // Kiểm tra quyền Trưởng bộ môn:
    const isHod = user.positions?.includes('HEAD_OF_DEPARTMENT');
    const isAdmin = user.roles?.includes(ROLES.ADMIN);

    if (!isHod && !isAdmin) {
      return Result.err(AppError.forbidden('Chỉ Trưởng bộ môn hoặc Quản trị viên mới có quyền thẩm định đề tài.'));
    }

    // Nếu là Trưởng bộ môn, kiểm tra đề tài có thuộc bộ môn của mình không
    if (isHod && !isAdmin && (!user.departmentId || user.departmentId !== topic.departmentId)) {
      return Result.err(
        AppError.forbidden('Bạn chỉ có quyền thẩm định đề tài thuộc bộ môn do mình phụ trách.'),
      );
    }

    const nextStatus = dto.isApproved ? TopicStatus.PENDING_DEAN : TopicStatus.REJECTED;
    const reviewed = await this.topicRepo.update(id, {
      status: nextStatus,
      rejectionReason: dto.isApproved ? null : dto.rejectionReason,
    });

    this.auditLogsService.record({
      action: dto.isApproved ? 'TOPIC_APPROVED_BY_HOD' : 'TOPIC_REJECTED_BY_HOD',
      endpoint: `/api/v1/topics/${id}/review`,
      httpMethod: 'PATCH',
      accountId: user.sub,
      payload: {
        topicId: id,
        code: topic.code,
        decision: nextStatus,
        reason: dto.rejectionReason || null,
      },
    });

    return Result.ok(reviewed);
  }

  async approveByDean(id: string, dto: ReviewTopicDto, user: AuthenticatedUser): Promise<Result<Topic>> {
    const topic = await this.topicRepo.findById(id);
    if (!topic) {
      return Result.err(AppError.notFound(`Không tìm thấy đề tài với ID '${id}'.`));
    }

    if (topic.status !== TopicStatus.PENDING_DEAN) {
      return Result.err(AppError.badRequest('Đề tài hiện không chờ Ban Chủ nhiệm Khoa phê duyệt (PENDING_DEAN).'));
    }

    const isDean = user.positions?.includes('FACULTY_DEAN');
    const isAdmin = user.roles?.includes(ROLES.ADMIN);
    if (!isDean && !isAdmin) {
      return Result.err(AppError.forbidden('Chỉ Ban Chủ nhiệm Khoa hoặc Quản trị viên mới được phê duyệt đề tài cấp 2.'));
    }

    if (isDean && !isAdmin && (!user.facultyId || topic.department.facultyId !== user.facultyId)) {
      return Result.err(AppError.forbidden('Bạn chỉ có quyền phê duyệt đề tài thuộc Khoa mình phụ trách.'));
    }

    const nextStatus = dto.isApproved ? TopicStatus.APPROVED : TopicStatus.REJECTED;
    const reviewed = await this.topicRepo.update(id, {
      status: nextStatus,
      rejectionReason: dto.isApproved ? null : dto.rejectionReason,
    });

    this.auditLogsService.record({
      action: dto.isApproved ? 'TOPIC_APPROVED_BY_DEAN' : 'TOPIC_REJECTED_BY_DEAN',
      endpoint: `/api/v1/topics/${id}/dean-approval`,
      httpMethod: 'PATCH',
      accountId: user.sub,
      payload: {
        topicId: id,
        code: topic.code,
        decision: nextStatus,
        reason: dto.rejectionReason || null,
      },
    });

    return Result.ok(reviewed);
  }
}
