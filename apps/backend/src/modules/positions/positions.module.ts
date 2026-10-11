// ==============================================================================
// POSITIONS MODULE
// ==============================================================================

import { Module } from '@nestjs/common';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { PositionsAdminController } from './controllers/positions.admin.controller';
import { PositionsRepository } from './repositories/positions.repository';
import { PositionAssignmentService } from './services/position-assignment.service';

@Module({
  imports: [AuditLogsModule],
  controllers: [PositionsAdminController],
  providers: [PositionsRepository, PositionAssignmentService],
  exports: [PositionsRepository, PositionAssignmentService],
})
export class PositionsModule {}
