import { Module } from '@nestjs/common';
import { ProgressController } from './controllers/progress.controller';
import { SubmissionsController } from './controllers/submissions.controller';
import { ProgressRepository } from './repositories/progress.repository';
import { ProgressService } from './services/progress.service';
import { SubmissionsService } from './services/submissions.service';

@Module({
  controllers: [ProgressController, SubmissionsController],
  providers: [
    ProgressRepository,
    ProgressService,
    SubmissionsService,
  ],
  exports: [
    ProgressService,
    SubmissionsService,
    ProgressRepository,
  ],
})
export class ProgressModule {}
