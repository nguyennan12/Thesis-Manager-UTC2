import { Module } from '@nestjs/common';
import { RegistrationsController } from './controllers/registrations.controller';
import { ChangeRequestsController } from './controllers/change-requests.controller';
import { RegistrationsRepository } from './repositories/registrations.repository';
import { ChangeRequestsRepository } from './repositories/change-requests.repository';
import { RegistrationsService } from './services/registrations.service';
import { RegistrationsAdminService } from './services/registrations-admin.service';
import { ChangeRequestsService } from './services/change-requests.service';

@Module({
  controllers: [ChangeRequestsController, RegistrationsController],
  providers: [
    RegistrationsRepository,
    ChangeRequestsRepository,
    RegistrationsService,
    RegistrationsAdminService,
    ChangeRequestsService,
  ],
  exports: [
    RegistrationsService,
    RegistrationsAdminService,
    ChangeRequestsService,
    RegistrationsRepository,
    ChangeRequestsRepository,
  ],
})
export class RegistrationsModule {}
