// ==============================================================================
// REGISTRATIONS REPOSITORY (Data Access Layer for Student Thesis Registrations)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma, Registration, RegistrationStatus } from '@prisma/client';
import { QueryRegistrationDto } from '../dto/query-registration.dto';
import { PaginationHelper, PaginatedResult } from '../../../common/helpers/pagination.helper';

@Injectable()
export class RegistrationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.RegistrationCreateInput, tx?: Prisma.TransactionClient): Promise<Registration> {
    const client = tx || this.prisma;
    return client.registration.create({ data });
  }

  async findById(id: string) {
    return this.prisma.registration.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            code: true,
            fullName: true,
            email: true,
            phone: true,
            class: { select: { id: true, code: true, name: true } },
          },
        },
        topic: {
          select: {
            id: true,
            code: true,
            titleVi: true,
            titleEn: true,
            description: true,
            maxStudents: true,
            status: true,
            departmentId: true,
          },
        },
        advisorLecturer: {
          select: {
            id: true,
            code: true,
            fullName: true,
            email: true,
            phone: true,
            degree: true,
          },
        },
        semester: {
          select: {
            id: true,
            code: true,
            name: true,
            isCurrent: true,
          },
        },
      },
    });
  }

  async findByStudentAndSemester(studentId: string, semesterId: string) {
    return this.prisma.registration.findUnique({
      where: {
        studentId_semesterId: {
          studentId,
          semesterId,
        },
      },
      include: {
        topic: true,
        advisorLecturer: true,
        semester: true,
      },
    });
  }

  async findAll(
    query: QueryRegistrationDto,
    extraWhere: Prisma.RegistrationWhereInput = {},
  ): Promise<PaginatedResult<any>> {
    const { page, limit, skip } = PaginationHelper.normalize(query.page, query.limit);

    const where: Prisma.RegistrationWhereInput = {
      ...extraWhere,
    };

    if (query.search) {
      where.OR = [
        { code: { contains: query.search, mode: 'insensitive' } },
        { student: { code: { contains: query.search, mode: 'insensitive' } } },
        { student: { fullName: { contains: query.search, mode: 'insensitive' } } },
        { topic: { code: { contains: query.search, mode: 'insensitive' } } },
        { topic: { titleVi: { contains: query.search, mode: 'insensitive' } } },
      ];
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.semesterId) {
      where.semesterId = query.semesterId;
    }
    if (query.advisorLecturerId) {
      where.advisorLecturerId = query.advisorLecturerId;
    }

    const [items, total] = await Promise.all([
      this.prisma.registration.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ createdAt: 'desc' }],
        include: {
          student: {
            select: { id: true, code: true, fullName: true, class: { select: { code: true } } },
          },
          topic: {
            select: { id: true, code: true, titleVi: true },
          },
          advisorLecturer: {
            select: { id: true, code: true, fullName: true, degree: true },
          },
          semester: {
            select: { id: true, code: true, name: true },
          },
        },
      }),
      this.prisma.registration.count({ where }),
    ]);

    return PaginationHelper.paginate(items, total, page, limit);
  }

  async countByTopic(topicId: string, tx?: Prisma.TransactionClient): Promise<number> {
    const client = tx || this.prisma;
    return client.registration.count({
      where: {
        topicId,
        status: { not: RegistrationStatus.CANCELLED },
      },
    });
  }

  async countAdvisedByLecturer(
    advisorLecturerId: string,
    semesterId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    const client = tx || this.prisma;
    return client.registration.count({
      where: {
        advisorLecturerId,
        semesterId,
        status: { not: RegistrationStatus.CANCELLED },
      },
    });
  }

  async update(
    id: string,
    data: Prisma.RegistrationUpdateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Registration> {
    const client = tx || this.prisma;
    return client.registration.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, tx?: Prisma.TransactionClient): Promise<Registration> {
    const client = tx || this.prisma;
    return client.registration.delete({
      where: { id },
    });
  }
}
