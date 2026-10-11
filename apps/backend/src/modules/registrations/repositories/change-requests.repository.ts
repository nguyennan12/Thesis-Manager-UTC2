// ==============================================================================
// CHANGE REQUESTS REPOSITORY (Data Access Layer for Topic/Advisor Change Requests)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { ChangeRequest, ChangeRequestStatus, Prisma } from '@prisma/client';

@Injectable()
export class ChangeRequestsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ChangeRequestCreateInput, tx?: Prisma.TransactionClient): Promise<ChangeRequest> {
    const client = tx || this.prisma;
    return client.changeRequest.create({ data });
  }

  async findById(id: string) {
    return this.prisma.changeRequest.findUnique({
      where: { id },
      include: {
        registration: {
          include: {
            student: true,
            topic: true,
            advisorLecturer: true,
          },
        },
        approvedBy: {
          select: { id: true, username: true, email: true },
        },
      },
    });
  }

  async findPendingByRegistrationId(registrationId: string): Promise<ChangeRequest | null> {
    return this.prisma.changeRequest.findFirst({
      where: {
        registrationId,
        status: ChangeRequestStatus.PENDING,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.ChangeRequestUpdateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<ChangeRequest> {
    const client = tx || this.prisma;
    return client.changeRequest.update({
      where: { id },
      data,
    });
  }
}
