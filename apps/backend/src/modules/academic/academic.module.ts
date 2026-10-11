// ==============================================================================
// ACADEMIC MODULE (Faculties, Majors, Departments, Classes, Semesters & Quotas)
// ==============================================================================

import { Module } from '@nestjs/common';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

// Controllers
import { FacultiesAdminController } from './controllers/faculties.admin.controller';
import { MajorsAdminController } from './controllers/majors.admin.controller';
import { DepartmentsAdminController } from './controllers/departments.admin.controller';
import { ClassesController } from './controllers/classes.controller';
import { SemestersController } from './controllers/semesters.controller';
import { QuotasController } from './controllers/quotas.controller';

// Repositories
import { FacultiesRepository } from './repositories/faculties.repository';
import { MajorsRepository } from './repositories/majors.repository';
import { DepartmentsRepository } from './repositories/departments.repository';
import { ClassesRepository } from './repositories/classes.repository';
import { SemestersRepository } from './repositories/semesters.repository';
import { LecturerQuotasRepository } from './repositories/lecturer-quotas.repository';

// Services
import { FacultiesService } from './services/faculties.service';
import { MajorsService } from './services/majors.service';
import { DepartmentsService } from './services/departments.service';
import { ClassesService } from './services/classes.service';
import { SemestersService } from './services/semesters.service';
import { LecturerQuotasService } from './services/lecturer-quotas.service';

@Module({
  imports: [AuditLogsModule],
  controllers: [
    FacultiesAdminController,
    MajorsAdminController,
    DepartmentsAdminController,
    ClassesController,
    SemestersController,
    QuotasController,
  ],
  providers: [
    // Repositories
    FacultiesRepository,
    MajorsRepository,
    DepartmentsRepository,
    ClassesRepository,
    SemestersRepository,
    LecturerQuotasRepository,

    // Services
    FacultiesService,
    MajorsService,
    DepartmentsService,
    ClassesService,
    SemestersService,
    LecturerQuotasService,
  ],
  exports: [
    FacultiesRepository,
    MajorsRepository,
    DepartmentsRepository,
    ClassesRepository,
    SemestersRepository,
    LecturerQuotasRepository,
    FacultiesService,
    MajorsService,
    DepartmentsService,
    ClassesService,
    SemestersService,
    LecturerQuotasService,
  ],
})
export class AcademicModule {}
