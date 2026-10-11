// ==============================================================================
// IMPORT CONFIRM SERVICE (SRP: Batch Database Persistence & Account Provisioning)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { RedisService } from '../../../database/redis/redis.service';
import { TransactionManager } from '../../../database/transaction-manager';
import { AuditLogsService } from '../../audit-logs/services/audit-logs.service';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { Result, AppError } from '../../../common/utils';
import { ValidatedStudentItem } from '../processors/student-import.processor';
import { ValidatedLecturerItem } from '../processors/lecturer-import.processor';
import { ValidatedClassItem } from '../processors/class-import.processor';
import * as bcrypt from 'bcryptjs';

interface ImportSessionPayload {
  type: 'students' | 'lecturers' | 'classes';
  validItems: any[];
}

@Injectable()
export class ImportConfirmService {
  private static readonly BATCH_SIZE = 200;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly txManager: TransactionManager,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async confirm(token: string, user?: AuthenticatedUser): Promise<Result<{ success: boolean; importedCount: number }>> {
    const sessionKey = `utc2:import_session:${token}`;
    const session = await this.redisService.get<ImportSessionPayload>(sessionKey);

    if (!session || !session.validItems) {
      return Result.err(
        AppError.notFound('Phiên import đã hết hạn (sau 30 phút) hoặc không tồn tại. Vui lòng tải lại tệp tin.'),
      );
    }

    const { type, validItems } = session;
    if (validItems.length === 0) {
      return Result.err(AppError.badRequest('Không có dòng dữ liệu hợp lệ nào để lưu vào hệ thống.'));
    }

    const initialPassword = process.env.DEFAULT_INITIAL_PASSWORD || 'Utc2@123456';

    if (type === 'students') {
      await this.saveStudentsBatch(validItems as ValidatedStudentItem[], initialPassword);
    } else if (type === 'lecturers') {
      await this.saveLecturersBatch(validItems as ValidatedLecturerItem[], initialPassword);
    } else {
      await this.saveClassesBatch(validItems as ValidatedClassItem[]);
    }

    // Xóa session tạm sau khi lưu thành công
    await this.redisService.del(sessionKey);

    // Ghi vết kiểm toán hệ thống (Audit Trail)
    this.auditLogsService.record({
      action: 'USER_BULK_IMPORT',
      endpoint: '/api/v1/import/confirm',
      httpMethod: 'POST',
      accountId: user?.sub,
      payload: {
        importType: type,
        importedCount: validItems.length,
      },
    });

    return Result.ok({
      success: true,
      importedCount: validItems.length,
    });
  }

  private async saveStudentsBatch(items: ValidatedStudentItem[], initialPassword: string): Promise<void> {
    const defaultPasswordHash = await bcrypt.hash(initialPassword, 10);
    const studentRole = await this.prisma.role.findUnique({ where: { code: 'STUDENT' } });

    for (let i = 0; i < items.length; i += ImportConfirmService.BATCH_SIZE) {
      const batch = items.slice(i, i + ImportConfirmService.BATCH_SIZE);

      await this.txManager.run(async (tx) => {
        for (const item of batch) {
          const student = await tx.student.create({
            data: {
              code: item.code,
              fullName: item.fullName,
              email: item.email,
              phone: item.phone,
              gender: item.gender,
              classId: item.classId,
            },
          });

          await tx.account.create({
            data: {
              username: item.code,
              email: item.email,
              passwordHash: defaultPasswordHash,
              mustChangePassword: true,
              studentId: student.id,
              accountRoles: studentRole
                ? {
                    create: {
                      roleId: studentRole.id,
                    },
                  }
                : undefined,
            },
          });
        }
      });
    }
  }

  private async saveLecturersBatch(items: ValidatedLecturerItem[], initialPassword: string): Promise<void> {
    const defaultPasswordHash = await bcrypt.hash(initialPassword, 10);
    const lecturerRole = await this.prisma.role.findUnique({ where: { code: 'LECTURER' } });

    for (let i = 0; i < items.length; i += ImportConfirmService.BATCH_SIZE) {
      const batch = items.slice(i, i + ImportConfirmService.BATCH_SIZE);

      await this.txManager.run(async (tx) => {
        for (const item of batch) {
          const lecturer = await tx.lecturer.create({
            data: {
              code: item.code,
              fullName: item.fullName,
              email: item.email,
              phone: item.phone,
              degree: [item.academicTitle, item.degree].filter(Boolean).join(' ') || undefined,
              departmentId: item.departmentId,
            },
          });

          await tx.account.create({
            data: {
              username: item.code,
              email: item.email,
              passwordHash: defaultPasswordHash,
              mustChangePassword: true,
              lecturerId: lecturer.id,
              accountRoles: lecturerRole
                ? {
                    create: {
                      roleId: lecturerRole.id,
                    },
                  }
                : undefined,
            },
          });
        }
      });
    }
  }

  private async saveClassesBatch(items: ValidatedClassItem[]): Promise<void> {
    for (let i = 0; i < items.length; i += ImportConfirmService.BATCH_SIZE) {
      const batch = items.slice(i, i + ImportConfirmService.BATCH_SIZE);

      await this.txManager.run(async (tx) => {
        await tx.class.createMany({
          data: batch.map((c) => ({
            code: c.code,
            name: c.name,
            majorId: c.majorId,
            academicYear: c.academicYear,
          })),
        });
      });
    }
  }
}
