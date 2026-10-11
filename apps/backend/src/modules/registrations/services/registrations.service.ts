// ==============================================================================
// REGISTRATIONS SERVICE (SRP: Student Self-Registration, Cancellation & Profile)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { RegistrationsRepository } from '../repositories/registrations.repository';
import { PrismaService } from '../../../database/prisma.service';
import { TransactionManager } from '../../../database/transaction-manager';
import { AuditLogsService } from '../../audit-logs/services/audit-logs.service';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { CreateRegistrationDto } from '../dto/registration.dto';
import { RegistrationGuardHelper } from '../helpers/registration-guard.helper';
import { QuotaResolverHelper } from '../../academic/helpers/quota-resolver.helper';
import { Result, AppError } from '../../../common/utils';
import { Registration, RegistrationStatus, TopicStatus } from '@prisma/client';

@Injectable()
export class RegistrationsService {
  constructor(
    private readonly regRepo: RegistrationsRepository,
    private readonly prisma: PrismaService,
    private readonly txManager: TransactionManager,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async register(dto: CreateRegistrationDto, user: AuthenticatedUser): Promise<Result<Registration>> {
    const student = await this.resolveStudent(user);
    if (!student) {
      return Result.err(AppError.forbidden('Chỉ tài khoản sinh viên mới được thực hiện đăng ký đề tài tốt nghiệp.'));
    }

    // 1. BR-01: Kiểm tra điều kiện tiên quyết của sinh viên (GPA, tín chỉ, trạng thái)
    const eligibilityErrors = RegistrationGuardHelper.validateStudentEligibility(student);
    if (eligibilityErrors.length > 0) {
      return Result.err(AppError.badRequest(eligibilityErrors.join('; ')));
    }

    // 2. BR-03: Kiểm tra học kỳ hiện tại và khung thời gian đăng ký
    const currentSemester = await this.prisma.semester.findFirst({
      where: { isCurrent: true },
    });
    if (!currentSemester) {
      return Result.err(AppError.badRequest('Hệ thống hiện chưa kích hoạt học kỳ nào để mở đăng ký đồ án.'));
    }

    const timelineError = RegistrationGuardHelper.validateSemesterTimeline(currentSemester);
    if (timelineError) {
      return Result.err(AppError.badRequest(timelineError));
    }

    // 3. Kiểm tra sinh viên đã đăng ký trong kỳ này chưa
    const existingReg = await this.regRepo.findByStudentAndSemester(student.id, currentSemester.id);
    if (existingReg && existingReg.status !== RegistrationStatus.CANCELLED) {
      return Result.err(AppError.conflict('Bạn đã đăng ký một đề tài trong học kỳ này rồi.'));
    }

    // 4. Kiểm tra đề tài hợp lệ và còn chỗ
    const topic = await this.prisma.topic.findUnique({
      where: { id: dto.topicId },
    });
    if (!topic) {
      return Result.err(AppError.notFound(`Không tìm thấy đề tài với ID '${dto.topicId}'.`));
    }
    if (topic.status !== TopicStatus.APPROVED) {
      return Result.err(AppError.badRequest('Chỉ đề tài đã được Trưởng bộ môn phê duyệt (APPROVED) mới có thể đăng ký.'));
    }

    const currentTopicStudents = await this.regRepo.countByTopic(topic.id);
    const capacityError = RegistrationGuardHelper.validateTopicCapacity(currentTopicStudents, topic.maxStudents);
    if (capacityError) {
      return Result.err(AppError.badRequest(capacityError));
    }

    // 5. BR-02: Kiểm tra Quota GVHD
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

    // 6. Transaction an toàn chống Race Condition
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

      // Nếu đã đủ maxStudents thì đánh dấu đề tài là ASSIGNED
      if (currentTopicStudents + 1 >= topic.maxStudents) {
        await tx.topic.update({
          where: { id: topic.id },
          data: { status: TopicStatus.ASSIGNED },
        });
      }

      return reg;
    });

    this.auditLogsService.record({
      action: 'STUDENT_TOPIC_REGISTERED',
      endpoint: '/api/v1/registrations',
      httpMethod: 'POST',
      accountId: user.sub,
      payload: { registrationId: createdRegistration.id, topicId: topic.id, studentId: student.id },
    });

    return Result.ok(createdRegistration);
  }

  async cancel(id: string, user: AuthenticatedUser): Promise<Result<void>> {
    const reg = await this.regRepo.findById(id);
    if (!reg) {
      return Result.err(AppError.notFound(`Không tìm thấy hồ sơ đăng ký với ID '${id}'.`));
    }

    const student = await this.resolveStudent(user);
    if (!student || reg.studentId !== student.id) {
      return Result.err(AppError.forbidden('Bạn không thể hủy hồ sơ đăng ký của sinh viên khác.'));
    }

    if (reg.status !== RegistrationStatus.REGISTERED) {
      return Result.err(AppError.badRequest('Chỉ có thể hủy đăng ký khi hồ sơ ở trạng thái vừa đăng ký (REGISTERED).'));
    }

    // Kiểm tra thời hạn mở đăng ký
    const semester = await this.prisma.semester.findUnique({ where: { id: reg.semesterId } });
    if (semester) {
      const timelineError = RegistrationGuardHelper.validateSemesterTimeline(semester);
      if (timelineError) {
        return Result.err(AppError.badRequest(timelineError));
      }
    }

    await this.txManager.run(async (tx) => {
      await this.regRepo.update(id, { status: RegistrationStatus.CANCELLED }, tx);

      // Mở lại đề tài thành APPROVED nếu đề tài đang bị ASSIGNED
      await tx.topic.update({
        where: { id: reg.topicId },
        data: { status: TopicStatus.APPROVED },
      });
    });

    this.auditLogsService.record({
      action: 'STUDENT_REGISTRATION_CANCELLED',
      endpoint: `/api/v1/registrations/${id}/cancel`,
      httpMethod: 'DELETE',
      accountId: user.sub,
      payload: { registrationId: id, topicId: reg.topicId },
    });

    return Result.ok(undefined);
  }

  async getMyRegistration(user: AuthenticatedUser): Promise<Result<any>> {
    const student = await this.resolveStudent(user);
    if (!student) {
      return Result.err(AppError.forbidden('Chỉ tài khoản sinh viên mới có hồ sơ đồ án cá nhân.'));
    }

    const currentSemester = await this.prisma.semester.findFirst({
      where: { isCurrent: true },
    });
    if (!currentSemester) {
      return Result.err(AppError.notFound('Chưa có học kỳ nào đang mở hoạt động.'));
    }

    const reg = await this.regRepo.findByStudentAndSemester(student.id, currentSemester.id);
    if (!reg || reg.status === RegistrationStatus.CANCELLED) {
      return Result.err(AppError.notFound('Bạn chưa đăng ký đề tài nào trong học kỳ hiện tại.'));
    }

    return Result.ok(reg);
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
