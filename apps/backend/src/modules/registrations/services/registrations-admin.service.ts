// ==============================================================================
// REGISTRATIONS ADMIN SERVICE (SRP: Registration Queries & Staff Topic Assignment)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { RegistrationsRepository } from '../repositories/registrations.repository';
import { PrismaService } from '../../../database/prisma.service';
import { TransactionManager } from '../../../database/transaction-manager';
import { AuditLogsService } from '../../audit-logs/services/audit-logs.service';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { AssignRegistrationDto } from '../dto/registration.dto';
import { QueryRegistrationDto } from '../dto/query-registration.dto';
import { RegistrationGuardHelper } from '../helpers/registration-guard.helper';
import { QuotaResolverHelper } from '../../academic/helpers/quota-resolver.helper';
import { Result, AppError } from '../../../common/utils';
import { ROLES } from '../../../common/constants/roles.constant';
import { PaginatedResult } from '../../../common/helpers/pagination.helper';
import { Registration, RegistrationStatus, TopicStatus, Prisma } from '@prisma/client';

@Injectable()
export class RegistrationsAdminService {
  constructor(
    private readonly regRepo: RegistrationsRepository,
    private readonly prisma: PrismaService,
    private readonly txManager: TransactionManager,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async findAll(query: QueryRegistrationDto, user: AuthenticatedUser): Promise<Result<PaginatedResult<any>>> {
    const where: Prisma.RegistrationWhereInput = {};

    // Phân quyền dữ liệu theo vai trò (Data Scoping):
    if (user.roles?.includes(ROLES.ADMIN) || user.positions?.includes('ACADEMIC_AFFAIRS') || user.positions?.includes('TRAINING_DEPT')) {
      // Admin / Giáo vụ Khoa: xem toàn bộ
    } else if (user.positions?.includes('HEAD_OF_DEPARTMENT') && user.departmentId) {
      // Trưởng bộ môn: xem sinh viên đăng ký đề tài thuộc bộ môn
      where.topic = { departmentId: user.departmentId };
    } else if (user.lecturerId) {
      // Giảng viên hướng dẫn: chỉ xem sinh viên do chính mình hướng dẫn
      where.advisorLecturerId = user.lecturerId;
    } else {
      return Result.err(AppError.forbidden('Bạn không có phạm vi được phép xem danh sách đăng ký.'));
    }

    const result = await this.regRepo.findAll(query, where);
    return Result.ok(result);
  }

  async findById(id: string, user: AuthenticatedUser): Promise<Result<any>> {
    const reg = await this.regRepo.findById(id);
    if (!reg) {
      return Result.err(AppError.notFound(`Không tìm thấy hồ sơ đăng ký với ID '${id}'.`));
    }
    const canRead = user.roles?.includes(ROLES.ADMIN) ||
      (user.roles?.includes(ROLES.STUDENT) && reg.studentId === user.studentId) ||
      user.positions?.includes('ACADEMIC_AFFAIRS') || user.positions?.includes('TRAINING_DEPT') ||
      (user.positions?.includes('HEAD_OF_DEPARTMENT') && reg.topic.departmentId === user.departmentId) ||
      (!!user.lecturerId && reg.advisorLecturerId === user.lecturerId);
    if (!canRead) {
      return Result.err(AppError.forbidden('Bạn không có quyền xem hồ sơ đăng ký này.'));
    }
    return Result.ok(reg);
  }

  async assign(dto: AssignRegistrationDto, user: AuthenticatedUser): Promise<Result<Registration>> {
    // 1. Kiểm tra sinh viên
    const student = await this.prisma.student.findUnique({
      where: { id: dto.studentId },
    });
    if (!student) {
      return Result.err(AppError.notFound(`Không tìm thấy sinh viên với ID '${dto.studentId}'.`));
    }

    // 2. Kiểm tra học kỳ hiện tại
    const currentSemester = await this.prisma.semester.findFirst({
      where: { isCurrent: true },
    });
    if (!currentSemester) {
      return Result.err(AppError.badRequest('Hệ thống hiện chưa có học kỳ nào đang mở hoạt động.'));
    }

    // 3. Kiểm tra sinh viên chưa có đề tài trong kỳ
    const existingReg = await this.regRepo.findByStudentAndSemester(student.id, currentSemester.id);
    if (existingReg && existingReg.status !== RegistrationStatus.CANCELLED) {
      return Result.err(AppError.conflict('Sinh viên này đã có hồ sơ đăng ký đề tài trong học kỳ hiện tại.'));
    }

    // 4. Kiểm tra đề tài
    const topic = await this.prisma.topic.findUnique({
      where: { id: dto.topicId },
    });
    if (!topic) {
      return Result.err(AppError.notFound(`Không tìm thấy đề tài với ID '${dto.topicId}'.`));
    }
    if (topic.status !== TopicStatus.APPROVED && topic.status !== TopicStatus.ASSIGNED) {
      return Result.err(AppError.badRequest('Chỉ có thể phân công đề tài đã được phê duyệt.'));
    }

    const currentTopicStudents = await this.regRepo.countByTopic(topic.id);
    const capacityError = RegistrationGuardHelper.validateTopicCapacity(currentTopicStudents, topic.maxStudents);
    if (capacityError) {
      return Result.err(AppError.badRequest(capacityError));
    }

    // 5. Kiểm tra Quota GVHD
    const lecturerQuota = await this.prisma.lecturerSemesterQuota.findUnique({
      where: {
        lecturerId_semesterId: {
          lecturerId: topic.proposerLecturerId,
          semesterId: currentSemester.id,
        },
      },
    });
    const maxQuota = QuotaResolverHelper.resolve(lecturerQuota?.maxQuota);
    const currentAdvisedCount = await this.regRepo.countAdvisedByLecturer(topic.proposerLecturerId, currentSemester.id);

    const quotaError = RegistrationGuardHelper.validateAdvisorQuota(currentAdvisedCount, maxQuota);
    if (quotaError) {
      return Result.err(AppError.badRequest(quotaError));
    }

    // 6. Gán đề tài trong Transaction
    const registrationCode = `DK_${currentSemester.code}_${student.code}`;

    const createdRegistration = await this.txManager.run(async (tx) => {
      const reg = await this.regRepo.create(
        {
          code: registrationCode,
          topic: { connect: { id: topic.id } },
          student: { connect: { id: student.id } },
          semester: { connect: { id: currentSemester.id } },
          advisorLecturer: { connect: { id: topic.proposerLecturerId } },
          status: RegistrationStatus.REGISTERED,
        },
        tx,
      );

      if (currentTopicStudents + 1 >= topic.maxStudents) {
        await tx.topic.update({
          where: { id: topic.id },
          data: { status: TopicStatus.ASSIGNED },
        });
      }

      return reg;
    });

    this.auditLogsService.record({
      action: 'TOPIC_FORCE_ASSIGNED',
      endpoint: '/api/v1/registrations/assign',
      httpMethod: 'POST',
      accountId: user.sub,
      payload: {
        registrationId: createdRegistration.id,
        topicId: topic.id,
        studentId: student.id,
      },
    });

    return Result.ok(createdRegistration);
  }
}
