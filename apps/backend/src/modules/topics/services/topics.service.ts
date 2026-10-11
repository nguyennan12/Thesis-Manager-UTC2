// ==============================================================================
// TOPICS SERVICE (SRP: Topic Proposal, Draft Update, Submission & Data Scoping)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { TopicRepository } from '../repositories/topic.repository';
import { PrismaService } from '../../../database/prisma.service';
import { AuditLogsService } from '../../audit-logs/services/audit-logs.service';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { CreateTopicDto, UpdateTopicDto } from '../dto/topic.dto';
import { QueryTopicDto } from '../dto/query-topic.dto';
import { Result, AppError } from '../../../common/utils';
import { ROLES } from '../../../common/constants/roles.constant';
import { PaginatedResult } from '../../../common/helpers/pagination.helper';
import { Topic, TopicStatus, Prisma } from '@prisma/client';

@Injectable()
export class TopicsService {
  constructor(
    private readonly topicRepo: TopicRepository,
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async create(dto: CreateTopicDto, user: AuthenticatedUser): Promise<Result<Topic>> {
    const lecturer = await this.resolveLecturer(user);
    if (!lecturer) {
      return Result.err(AppError.forbidden('Chỉ tài khoản giảng viên mới có quyền tạo đề xuất đề tài tốt nghiệp.'));
    }

    // 1. Kiểm tra học kỳ đang hoạt động
    const currentSemester = await this.prisma.semester.findFirst({
      where: { isCurrent: true },
    });
    if (!currentSemester) {
      return Result.err(AppError.badRequest('Hệ thống hiện chưa có học kỳ nào được kích hoạt để đề xuất đề tài.'));
    }

    // 2. Kiểm tra ngành đào tạo
    const major = await this.prisma.major.findUnique({
      where: { id: dto.majorId },
    });
    if (!major) {
      return Result.err(AppError.notFound(`Không tìm thấy ngành đào tạo với ID '${dto.majorId}'.`));
    }

    // 3. Tự động sinh mã đề tài duy nhất
    const count = await this.topicRepo.countProposedByLecturer(lecturer.id, currentSemester.id);
    const code = `DT_${currentSemester.code}_${lecturer.code}_${count + 1}`;

    const created = await this.topicRepo.create({
      code,
      titleVi: dto.titleVi,
      titleEn: dto.titleEn,
      description: dto.description,
      objectives: dto.objectives,
      requirements: dto.requirements,
      topicType: dto.topicType,
      maxStudents: dto.maxStudents || 1,
      status: TopicStatus.DRAFT,
      department: { connect: { id: lecturer.departmentId } },
      major: { connect: { id: dto.majorId } },
      semester: { connect: { id: currentSemester.id } },
      proposerLecturer: { connect: { id: lecturer.id } },
    });

    this.auditLogsService.record({
      action: 'TOPIC_CREATED',
      endpoint: '/api/v1/topics',
      httpMethod: 'POST',
      accountId: user.sub,
      payload: { topicId: created.id, code: created.code, titleVi: created.titleVi },
    });

    return Result.ok(created);
  }

  async findAll(query: QueryTopicDto, user: AuthenticatedUser): Promise<Result<PaginatedResult<any>>> {
    const where: Prisma.TopicWhereInput = {};

    // Phân quyền dữ liệu theo vai trò (Data Scoping):
    if (user.roles?.includes(ROLES.STUDENT)) {
      // Sinh viên: CHỈ xem được đề tài đã duyệt (APPROVED)
      where.status = TopicStatus.APPROVED;
    } else if (
      user.roles?.includes(ROLES.ADMIN) ||
      user.positions?.includes('TRAINING_DEPT') ||
      user.positions?.includes('ACADEMIC_AFFAIRS')
    ) {
      // Admin / Phòng Đào tạo / Giáo vụ: xem toàn bộ
    } else if (user.positions?.includes('HEAD_OF_DEPARTMENT') && user.departmentId) {
      // Trưởng bộ môn: xem đề tài đã duyệt HOẶC toàn bộ đề tài của bộ môn mình
      where.OR = [
        { status: TopicStatus.APPROVED },
        { departmentId: user.departmentId },
      ];
    } else {
      // Giảng viên thông thường: xem đề tài đã duyệt HOẶC đề tài do chính mình đề xuất
      const lecturerId = user.lecturerId;
      if (lecturerId) {
        where.OR = [
          { status: TopicStatus.APPROVED },
          { proposerLecturerId: lecturerId },
        ];
      } else {
        where.status = TopicStatus.APPROVED;
      }
    }

    const result = await this.topicRepo.findAll(query, where);
    return Result.ok(result);
  }

  async findById(id: string): Promise<Result<any>> {
    const topic = await this.topicRepo.findById(id);
    if (!topic) {
      return Result.err(AppError.notFound(`Không tìm thấy đề tài tốt nghiệp với ID '${id}'.`));
    }
    return Result.ok(topic);
  }

  async update(id: string, dto: UpdateTopicDto, user: AuthenticatedUser): Promise<Result<Topic>> {
    const topic = await this.topicRepo.findById(id);
    if (!topic) {
      return Result.err(AppError.notFound(`Không tìm thấy đề tài với ID '${id}'.`));
    }

    // Chỉ chính chủ giảng viên đề xuất hoặc Admin được sửa
    const lecturer = await this.resolveLecturer(user);
    const isOwner = lecturer && topic.proposerLecturerId === lecturer.id;
    const isAdmin = user.roles?.includes(ROLES.ADMIN);

    if (!isOwner && !isAdmin) {
      return Result.err(AppError.forbidden('Bạn không có quyền chỉnh sửa đề tài của giảng viên khác.'));
    }

    // Chỉ được sửa khi đang DRAFT hoặc REJECTED
    if (topic.status !== TopicStatus.DRAFT && topic.status !== TopicStatus.REJECTED) {
      return Result.err(
        AppError.badRequest('Không thể chỉnh sửa đề tài đang chờ thẩm định hoặc đã được phê duyệt ban hành.'),
      );
    }

    const updated = await this.topicRepo.update(id, {
      titleVi: dto.titleVi,
      titleEn: dto.titleEn,
      description: dto.description,
      objectives: dto.objectives,
      requirements: dto.requirements,
      topicType: dto.topicType,
      maxStudents: dto.maxStudents,
      major: dto.majorId ? { connect: { id: dto.majorId } } : undefined,
    });

    return Result.ok(updated);
  }

  async delete(id: string, user: AuthenticatedUser): Promise<Result<void>> {
    const topic = await this.topicRepo.findById(id);
    if (!topic) {
      return Result.err(AppError.notFound(`Không tìm thấy đề tài với ID '${id}'.`));
    }

    const lecturer = await this.resolveLecturer(user);
    const isOwner = lecturer && topic.proposerLecturerId === lecturer.id;
    const isAdmin = user.roles?.includes(ROLES.ADMIN);

    if (!isOwner && !isAdmin) {
      return Result.err(AppError.forbidden('Bạn không có quyền xóa đề tài của giảng viên khác.'));
    }

    if (topic.status !== TopicStatus.DRAFT) {
      return Result.err(AppError.badRequest('Chỉ có thể xóa đề tài khi đang ở trạng thái bản nháp (DRAFT).'));
    }

    await this.topicRepo.delete(id);
    return Result.ok(undefined);
  }

  async submit(id: string, user: AuthenticatedUser): Promise<Result<Topic>> {
    const topic = await this.topicRepo.findById(id);
    if (!topic) {
      return Result.err(AppError.notFound(`Không tìm thấy đề tài với ID '${id}'.`));
    }

    const lecturer = await this.resolveLecturer(user);
    if (!lecturer || topic.proposerLecturerId !== lecturer.id) {
      return Result.err(AppError.forbidden('Chỉ giảng viên đề xuất mới được gửi đề tài lên Trưởng bộ môn duyệt.'));
    }

    if (topic.status !== TopicStatus.DRAFT && topic.status !== TopicStatus.REJECTED) {
      return Result.err(AppError.badRequest('Chỉ đề tài ở trạng thái DRAFT hoặc REJECTED mới có thể gửi thẩm định.'));
    }

    const submitted = await this.topicRepo.update(id, {
      status: TopicStatus.PENDING_REVIEW,
      rejectionReason: null,
    });

    this.auditLogsService.record({
      action: 'TOPIC_SUBMITTED',
      endpoint: `/api/v1/topics/${id}/submit`,
      httpMethod: 'PATCH',
      accountId: user.sub,
      payload: { topicId: id, code: topic.code },
    });

    return Result.ok(submitted);
  }

  private async resolveLecturer(user: AuthenticatedUser) {
    if (user.lecturerId) {
      return this.prisma.lecturer.findUnique({ where: { id: user.lecturerId } });
    }
    const account = await this.prisma.account.findUnique({
      where: { id: user.sub },
      include: { lecturer: true },
    });
    return account?.lecturer || null;
  }
}
