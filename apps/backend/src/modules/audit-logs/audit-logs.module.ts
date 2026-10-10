// ==============================================================================
// GLOBAL AUDIT LOGS MODULE (BR-13)
// ==============================================================================

import { Global, Module } from '@nestjs/common';
import { AuditLogsRepository } from './repositories/audit-logs.repository';
import { AuditLogsService } from './services/audit-logs.service';

@Global()
@Module({
  providers: [AuditLogsRepository, AuditLogsService],
  exports: [AuditLogsRepository, AuditLogsService],
})
export class AuditLogsModule {}
