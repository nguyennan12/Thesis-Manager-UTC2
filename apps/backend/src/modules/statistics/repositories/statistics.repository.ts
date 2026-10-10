import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class StatisticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Placeholder for Statistics aggregate queries
}
