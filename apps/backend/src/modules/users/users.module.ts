// ==============================================================================
// USERS MODULE (Accounts, Students & Lecturers Management)
// ==============================================================================

import { Module } from '@nestjs/common';
import { AcademicModule } from '../academic/academic.module';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

// Controllers
import { UsersAdminController } from './controllers/users.admin.controller';
import { StudentsController } from './controllers/students.controller';
import { LecturersController } from './controllers/lecturers.controller';

// Repositories
import { StudentsRepository } from './repositories/students.repository';
import { LecturersRepository } from './repositories/lecturers.repository';
import { AccountsManagementRepository } from './repositories/accounts-management.repository';

// Services
import { StudentsService } from './services/students.service';
import { LecturersService } from './services/lecturers.service';
import { UsersManagementService } from './services/users-management.service';

@Module({
  imports: [AcademicModule, AuditLogsModule],
  controllers: [UsersAdminController, StudentsController, LecturersController],
  providers: [
    StudentsRepository,
    LecturersRepository,
    AccountsManagementRepository,
    StudentsService,
    LecturersService,
    UsersManagementService,
  ],
  exports: [
    StudentsRepository,
    LecturersRepository,
    AccountsManagementRepository,
    StudentsService,
    LecturersService,
    UsersManagementService,
  ],
})
export class UsersModule {}
