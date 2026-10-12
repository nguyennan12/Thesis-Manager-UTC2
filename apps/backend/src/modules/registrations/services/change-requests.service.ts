// ==============================================================================
// CHANGE REQUESTS SERVICE (SRP: Student Change Request Submission & Review)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { ChangeRequestsRepository } from '../repositories/change-requests.repository';
import { RegistrationsRepository } from '../repositories/registrations.repository';
import { PrismaService } from '../../../database/prisma.service';
import { TransactionManager } from '../../../database/transaction-manager';
import { AuditLogsService } from '../../audit-logs/services/audit-logs.service';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { CreateChangeRequestDto, ReviewChangeRequestDto } from '../dto/change-request.dto';
import { Result, AppError } from '../../../common/utils';
import { ChangeRequest, ChangeRequestStatus, ChangeRequestType, RegistrationStatus, TopicStatus } from '@prisma/client';

@Injectable()
export class ChangeRequestsService {
  constructor(
    private readonly changeReqRepo: ChangeRequestsRepository,
    private readonly regRepo: RegistrationsRepository,
    private readonly prisma: PrismaService,
    private readonly txManager: TransactionManager,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async create(dto: CreateChangeRequestDto, user: AuthenticatedUser): Promise<Result<ChangeRequest>> {
    const student = await this.resolveStudent(user);
    if (!student) {
      return Result.err(AppError.forbidden('Chỉ tài khoản sinh viên mới có quyền nộp đơn xin thay đổi đề tài.'));
    }

    const currentSemester = await this.prisma.semester.findFirst({
      where: { isCurrent: true },
    });
    if (!currentSemester) {
      return Result.err(AppError.badRequest('Hệ thống chưa có học kỳ nào đang mở hoạt động.'));
    }

    const reg = await this.regRepo.findByStudentAndSemester(student.id, currentSemester.id);
    if (!reg || reg.status === RegistrationStatus.CANCELLED) {
      return Result.err(AppError.notFound('Bạn chưa có hồ sơ đăng ký đồ án hợp lệ trong học kỳ này để xin thay đổi.'));
    }

    // Kiểm tra chưa có đơn nào đang chờ duyệt
    const existingPending = await this.changeReqRepo.findPendingByRegistrationId(reg.id);
    if (existingPending) {
      return Result.err(AppError.conflict('Bạn đang có một yêu cầu thay đổi đang chờ Ban chủ nhiệm Khoa xem xét.'));
    }

    const created = await this.changeReqRepo.create({
      registration: { connect: { id: reg.id } },
      requestType: dto.type,
      reason: dto.reason,
      requestedData: dto.requestedData as any,
      status: ChangeRequestStatus.PENDING,
    });

    this.auditLogsService.record({
      action: 'CHANGE_REQUEST_CREATED',
      endpoint: '/api/v1/registrations/change-requests',
      httpMethod: 'POST',
      accountId: user.sub,
      payload: { requestId: created.id, type: created.requestType, registrationId: reg.id },
    });

    return Result.ok(created);
  }

  async review(id: string, dto: ReviewChangeRequestDto, user: AuthenticatedUser): Promise<Result<ChangeRequest>> {
    const changeReq = await this.changeReqRepo.findById(id);
    if (!changeReq) {
      return Result.err(AppError.notFound(`Không tìm thấy yêu cầu thay đổi với ID '${id}'.`));
    }

    if (changeReq.status !== ChangeRequestStatus.PENDING) {
      return Result.err(AppError.badRequest('Yêu cầu thay đổi này đã được xử lý trước đó.'));
    }

    const nextStatus = dto.isApproved ? ChangeRequestStatus.APPROVED : ChangeRequestStatus.REJECTED;

    const reviewed = await this.txManager.run(async (tx) => {
      // Nếu duyệt đổi đề tài (CHANGE_TOPIC) và có newTopicId
      if (dto.isApproved && changeReq.requestType === ChangeRequestType.CHANGE_TOPIC) {
        const payload = changeReq.requestedData as Record<string, any> | null;
        const newTopicId = payload?.newTopicId;

        if (newTopicId) {
          const newTopic = await tx.topic.findUnique({ where: { id: newTopicId } });
          if (newTopic) {
            // Mở lại đề tài cũ
            await tx.topic.update({
              where: { id: changeReq.registration.topicId },
              data: { status: TopicStatus.APPROVED },
            });

            // Cập nhật registration sang đề tài mới và GVHD mới
            await tx.registration.update({
              where: { id: changeReq.registrationId },
              data: {
                topicId: newTopic.id,
                advisorLecturerId: newTopic.proposerLecturerId,
              },
            });
          }
        }
      }

      return this.changeReqRepo.update(
        id,
        {
          status: nextStatus,
          rejectionReason: dto.isApproved ? null : dto.rejectionReason,
          approvedBy: dto.isApproved ? { connect: { id: user.sub } } : undefined,
        },
        tx,
      );
    });

    this.auditLogsService.record({
      action: dto.isApproved ? 'CHANGE_REQUEST_APPROVED' : 'CHANGE_REQUEST_REJECTED',
      endpoint: `/api/v1/registrations/change-requests/${id}/review`,
      httpMethod: 'PATCH',
      accountId: user.sub,
      payload: { requestId: id, decision: nextStatus, reason: dto.rejectionReason || null },
    });

    return Result.ok(reviewed);
  }

  async findMyRequests(user: AuthenticatedUser): Promise<Result<any[]>> {
    const student = await this.resolveStudent(user);
    const whereClause: any = {};
    if (student) {
      whereClause.registration = { studentId: student.id };
    }

    const requests = await this.prisma.changeRequest.findMany({
      where: whereClause,
      include: {
        registration: {
          include: {
            student: true,
            topic: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const items = requests.map((cr) => ({
      id: cr.id,
      type: cr.requestType,
      reason: cr.reason,
      status: cr.status,
      rejectionReason: cr.rejectionReason,
      createdAt: cr.createdAt,
      studentName: cr.registration?.student?.fullName,
      studentCode: cr.registration?.student?.code,
      topicCode: cr.registration?.topic?.code,
      topicTitle: cr.registration?.topic?.titleVi,
      requestedData: cr.requestedData,
    }));

    return Result.ok(items);
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
