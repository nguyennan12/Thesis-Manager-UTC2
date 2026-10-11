import { Module } from '@nestjs/common';
import { TopicsController } from './controllers/topics.controller';
import { TopicsReviewController } from './controllers/topics-review.controller';
import { TopicRepository } from './repositories/topic.repository';
import { TopicsService } from './services/topics.service';
import { TopicsReviewService } from './services/topics-review.service';

@Module({
  controllers: [TopicsController, TopicsReviewController],
  providers: [
    TopicRepository,
    TopicsService,
    TopicsReviewService,
  ],
  exports: [
    TopicsService,
    TopicsReviewService,
    TopicRepository,
  ],
})
export class TopicsModule {}
