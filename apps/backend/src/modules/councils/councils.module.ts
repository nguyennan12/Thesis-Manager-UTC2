import { Module } from '@nestjs/common';
import { ReviewersController } from './controllers/reviewers.controller';
import { CouncilsController } from './controllers/councils.controller';
import { EvaluationController } from './controllers/evaluation.controller';
import { CouncilsRepository } from './repositories/councils.repository';
import { ReviewersService } from './services/reviewers.service';
import { CouncilsService } from './services/councils.service';
import { EvaluationService } from './services/evaluation.service';

@Module({
  controllers: [
    ReviewersController,
    CouncilsController,
    EvaluationController,
  ],
  providers: [
    CouncilsRepository,
    ReviewersService,
    CouncilsService,
    EvaluationService,
  ],
  exports: [
    ReviewersService,
    CouncilsService,
    EvaluationService,
    CouncilsRepository,
  ],
})
export class CouncilsModule {}
