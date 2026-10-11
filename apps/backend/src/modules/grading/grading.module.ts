import { Module } from '@nestjs/common';
import { RubricsController } from './controllers/rubrics.controller';
import { RubricSetsRepository } from './repositories/rubric-sets.repository';
import { EvaluationCriteriaRepository } from './repositories/evaluation-criteria.repository';
import { RubricsService } from './services/rubrics.service';
import { RubricActivationService } from './services/rubric-activation.service';

@Module({
  controllers: [RubricsController],
  providers: [
    RubricSetsRepository,
    EvaluationCriteriaRepository,
    RubricsService,
    RubricActivationService,
  ],
  exports: [
    RubricsService,
    RubricActivationService,
    RubricSetsRepository,
    EvaluationCriteriaRepository,
  ],
})
export class GradingModule {}
