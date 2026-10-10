// ==============================================================================
// AUDIT LOGS SERVICE (SRP: Asynchronous System Event & Audit Trail Logging - BR-13)
// ==============================================================================

import { Injectable, Logger } from '@nestjs/common';
import { AuditLogsRepository, CreateAuditLogData } from '../repositories/audit-logs.repository';
import { Result } from '../../../common/utils';

@Injectable()
export class AuditLogsService {
  private readonly logger = new Logger(AuditLogsService.name);

  constructor(private readonly auditLogsRepository: AuditLogsRepository) {}

  /**
   * Ghi nhận log sự kiện bất đồng bộ (Non-blocking Fire-and-Forget)
   */
  logEvent(data: CreateAuditLogData): void {
    this.auditLogsRepository
      .create(data)
      .catch((err) => {
        this.logger.error(`Failed to record audit log for action [${data.action}]: ${err.message}`);
      });
  }

  /**
   * Lấy danh sách Audit Logs cho Quản trị viên
   */
  async getAuditLogs(params: {
    page?: number;
    limit?: number;
    accountId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 20;
    const skip = (page - 1) * limit;

    const result = await this.auditLogsRepository.findAll({
      skip,
      take: limit,
      accountId: params.accountId,
      action: params.action,
      startDate: params.startDate ? new Date(params.startDate) : undefined,
      endDate: params.endDate ? new Date(params.endDate) : undefined,
    });

    return Result.ok({
      items: result.items,
      meta: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    });
  }
}
