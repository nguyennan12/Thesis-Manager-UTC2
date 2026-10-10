import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class TopicRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Placeholder for Topic complex queries
}
