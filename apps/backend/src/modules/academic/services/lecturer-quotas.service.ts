// ==============================================================================
// LECTURER QUOTAS SERVICE (SRP: Lecturer Advising Quota per Semester Management)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { LecturerQuotasRepository } from '../repositories/lecturer-quotas.repository';
import { SemestersRepository } from '../repositories/semesters.repository';
import { QuotaResolverHelper } from '../helpers/quota-resolver.helper';
import { Result, AppError } from '../../../common/utils';
import { AuditLogsService } from '../../audit-logs/services/audit-logs.service';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class LecturerQuotasService {
  constructor(
    private readonly lecturerQuotasRepository: LecturerQuotasRepository,
    private readonly semestersRepository: SemestersRepository,
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  /**
   * Lấy danh sách định mức hướng dẫn của giảng viên trong một học kỳ
   */
  async getLecturerQuotasBySemester(
    semesterId: string,
    departmentId?: string,
  ): Promise<Result<any[]>> {
    const semester = await this.semestersRepository.findById(semesterId);
    if (!semester) {
      return Result.fail(AppError.notFound('Không tìm thấy học kỳ tương ứng.'));
    }

    // Đọc default quota từ system settings (fallback 5)
    const defaultSetting = await this.prisma.systemSetting.findUnique({
      where: { key: 'advising.default_quota' },
    });
    const defaultQuota = defaultSetting ? parseInt(defaultSetting.value, 10) || 5 : 5;

    const lecturers = await this.lecturerQuotasRepository.findBySemester(semesterId, departmentId);

    const formatted = lecturers.map((lecturer) => {
      const customQuota = lecturer.semesterQuotas?.[0]?.maxQuota ?? null;
      const effectiveQuota = QuotaResolverHelper.resolve(customQuota, defaultQuota);
      const assignedCount = lecturer._count?.advisedRegistrations ?? 0;
      const remainingQuota = Math.max(0, effectiveQuota - assignedCount);

      return {
        lecturerId: lecturer.id,
        code: lecturer.code,
        fullName: lecturer.fullName,
        email: lecturer.email,
        degree: lecturer.degree,
        department: lecturer.department,
        customQuota,
        effectiveQuota,
        assignedCount,
        remainingQuota,
        isFull: remainingQuota <= 0,
      };
    });

    return Result.ok(formatted);
  }

  /**
   * Cập nhật định mức hướng dẫn riêng cho một giảng viên trong học kỳ
   */
  async updateLecturerQuota(
    semesterId: string,
    lecturerId: string,
    maxQuota: number,
    actorAccountId?: string,
  ): Promise<Result<any>> {
    const semester = await this.semestersRepository.findById(semesterId);
    if (!semester) {
      return Result.fail(AppError.notFound('Không tìm thấy học kỳ tương ứng.'));
    }

    // Kiểm tra số lượng đồ án đã nhận hướng dẫn trong kỳ
    const assignedCount = await this.lecturerQuotasRepository.countAssignedTopics(
      lecturerId,
      semesterId,
    );

    if (maxQuota < assignedCount) {
      return Result.fail(
        AppError.badRequest(
          `Không thể đặt định mức là ${maxQuota} vì giảng viên đã nhận hướng dẫn ${assignedCount} đề tài trong học kỳ này.`,
        ),
      );
    }

    const updated = await this.lecturerQuotasRepository.upsert(
      lecturerId,
      semesterId,
      maxQuota,
    );

    this.auditLogsService.record({
      accountId: actorAccountId,
      action: 'LECTURER_QUOTA_UPDATE',
      endpoint: `/academic/semesters/${semesterId}/lecturer-quotas/${lecturerId}`,
      httpMethod: 'PUT',
      payload: { semesterId, lecturerId, maxQuota, assignedCount },
    });

    return Result.ok(updated);
  }
}
