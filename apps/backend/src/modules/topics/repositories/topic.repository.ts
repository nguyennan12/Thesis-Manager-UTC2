// ==============================================================================
// TOPICS REPOSITORY (Data Access Layer for Thesis Topics)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma, Topic } from '@prisma/client';
import { QueryTopicDto } from '../dto/query-topic.dto';
import { PaginationHelper, PaginatedResult } from '../../../common/helpers/pagination.helper';

@Injectable()
export class TopicRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.TopicCreateInput, tx?: Prisma.TransactionClient): Promise<Topic> {
    const client = tx || this.prisma;
    return client.topic.create({ data });
  }

  async findById(id: string) {
    return this.prisma.topic.findUnique({
      where: { id },
      include: {
        proposerLecturer: {
          select: {
            id: true,
            code: true,
            fullName: true,
            email: true,
            phone: true,
            degree: true,
          },
        },
        department: {
          select: { id: true, code: true, name: true, facultyId: true },
        },
        major: {
          select: { id: true, code: true, name: true },
        },
        semester: {
          select: { id: true, code: true, name: true, isCurrent: true },
        },
        registrations: {
          select: {
            id: true,
            studentId: true,
            status: true,
            student: {
              select: {
                id: true,
                code: true,
                fullName: true,
                class: { select: { id: true, code: true } },
              },
            },
          },
        },
      },
    });
  }

  async findByCode(code: string): Promise<Topic | null> {
    return this.prisma.topic.findUnique({
      where: { code },
    });
  }

  async findAll(
    query: QueryTopicDto,
    extraWhere: Prisma.TopicWhereInput = {},
  ): Promise<PaginatedResult<any>> {
    const { page, limit, skip } = PaginationHelper.normalize(query.page, query.limit);

    const where: Prisma.TopicWhereInput = {
      ...extraWhere,
    };

    if (query.search) {
      where.OR = [
        { code: { contains: query.search, mode: 'insensitive' } },
        { titleVi: { contains: query.search, mode: 'insensitive' } },
        { titleEn: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.topicType) {
      where.topicType = query.topicType;
    }
    if (query.majorId) {
      where.majorId = query.majorId;
    }
    if (query.semesterId) {
      where.semesterId = query.semesterId;
    }
    if (query.lecturerId) {
      where.proposerLecturerId = query.lecturerId;
    }

    const [items, total] = await Promise.all([
      this.prisma.topic.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ createdAt: 'desc' }],
        include: {
          proposerLecturer: {
            select: { id: true, code: true, fullName: true, degree: true },
          },
          department: {
            select: { id: true, code: true, name: true },
          },
          major: {
            select: { id: true, code: true, name: true },
          },
          _count: {
            select: { registrations: true },
          },
        },
      }),
      this.prisma.topic.count({ where }),
    ]);

    return PaginationHelper.paginate(items, total, page, limit);
  }

  async update(id: string, data: Prisma.TopicUpdateInput, tx?: Prisma.TransactionClient): Promise<Topic> {
    const client = tx || this.prisma;
    return client.topic.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, tx?: Prisma.TransactionClient): Promise<Topic> {
    const client = tx || this.prisma;
    return client.topic.delete({
      where: { id },
    });
  }

  async countProposedByLecturer(lecturerId: string, semesterId: string): Promise<number> {
    return this.prisma.topic.count({
      where: {
        proposerLecturerId: lecturerId,
        semesterId,
      },
    });
  }
}
