// ==============================================================================
// POSITIONS REPOSITORY (Data Access Layer for Positions & Role Scopes)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class PositionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAssignmentById(id: string) {
    return this.prisma.accountRole.findUnique({
      where: { id },
      include: {
        account: {
          select: {
            id: true,
            username: true,
            lecturerId: true,
          },
        },
        role: true,
      },
    });
  }

  async findRoleByCode(code: string) {
    return this.prisma.role.findUnique({
      where: { code },
    });
  }

  async findAccountByLecturerId(lecturerId: string) {
    return this.prisma.account.findUnique({
      where: { lecturerId },
      include: {
        lecturer: {
          select: { id: true, departmentId: true, fullName: true },
        },
      },
    });
  }

  async findActiveDepartmentHead(departmentId: string) {
    return this.prisma.department.findUnique({
      where: { id: departmentId },
      select: {
        id: true,
        headLecturerId: true,
        headLecturer: {
          select: {
            id: true,
            fullName: true,
            account: {
              select: { id: true },
            },
          },
        },
      },
    });
  }

  async deleteAssignment(id: string, tx?: Prisma.TransactionClient) {
    const client = tx || this.prisma;
    return client.accountRole.delete({
      where: { id },
    });
  }

  async removeScopeForAccount(
    accountId: string,
    roleId: string,
    scopeType: string,
    scopeId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || this.prisma;
    return client.accountRole.deleteMany({
      where: {
        accountId,
        roleId,
        scopeType,
        scopeId,
      },
    });
  }

  async createAssignment(
    data: Prisma.AccountRoleUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || this.prisma;
    return client.accountRole.create({ data });
  }

  async updateDepartmentHead(
    departmentId: string,
    headLecturerId: string | null,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || this.prisma;
    return client.department.update({
      where: { id: departmentId },
      data: { headLecturerId },
    });
  }
}
