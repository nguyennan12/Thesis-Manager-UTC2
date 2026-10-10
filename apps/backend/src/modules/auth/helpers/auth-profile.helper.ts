// ==============================================================================
// AUTH PROFILE HELPER (Role/Position Extraction & Profile Mapping)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ROLE_POSITIONS } from '../../../common/constants/roles.constant';
import { UserRoleScope } from '../../../common/interfaces/jwt-payload.interface';
import { UserProfileDto } from '../dto';

export type AccountWithProfileRelations = Prisma.AccountGetPayload<{
  include: {
    accountRoles: {
      include: {
        role: true;
      };
    };
    student: {
      include: {
        class: {
          include: {
            major: true;
          };
        };
      };
    };
    lecturer: {
      include: {
        department: {
          include: {
            faculty: true;
          };
        };
      };
    };
  };
}>;

@Injectable()
export class AuthProfileHelper {
  /**
   * Trích xuất roles, positions và userRoleScopes từ dữ liệu account (Strictly Type-Safe)
   */
  extractRolesAndPositions(account: AccountWithProfileRelations) {
    const roles: string[] = account.accountRoles.map((ar) => ar.role.code);
    const userRoleScopes: UserRoleScope[] = account.accountRoles.map((ar) => ({
      roleCode: ar.role.code,
      scopeType: ar.scopeType || undefined,
      scopeId: ar.scopeId || undefined,
    }));

    const positions: string[] = [];
    for (const ar of account.accountRoles) {
      if (ar.scopeType === 'FACULTY' && ar.role.code === 'LECTURER') {
        positions.push(ROLE_POSITIONS.FACULTY_DEAN);
      } else if (ar.scopeType === 'DEPARTMENT' && ar.role.code === 'LECTURER') {
        positions.push(ROLE_POSITIONS.HEAD_OF_DEPARTMENT);
      } else if (ar.scopeType === 'FACULTY' && ar.role.code === 'STAFF') {
        positions.push(ROLE_POSITIONS.ACADEMIC_AFFAIRS);
      }
    }

    return { roles, positions, userRoleScopes };
  }

  /**
   * Chuyển đổi account entity thành UserProfileDto chuẩn
   */
  buildUserProfile(
    account: AccountWithProfileRelations,
    roles: string[],
    positions: string[],
    userRoleScopes: UserRoleScope[],
  ): UserProfileDto {
    return {
      id: account.id,
      username: account.username,
      email: account.email,
      isActive: account.isActive,
      studentId: account.studentId || undefined,
      lecturerId: account.lecturerId || undefined,
      student: account.student
        ? {
            id: account.student.id,
            code: account.student.code,
            fullName: account.student.fullName,
            email: account.student.email,
            phone: account.student.phone,
            classId: account.student.classId,
            className: account.student.class?.name,
            gpaCumulative: Number(account.student.gpaCumulative),
            creditsAccumulated: account.student.creditsAccumulated,
            status: account.student.status,
          }
        : undefined,
      lecturer: account.lecturer
        ? {
            id: account.lecturer.id,
            code: account.lecturer.code,
            fullName: account.lecturer.fullName,
            email: account.lecturer.email,
            phone: account.lecturer.phone,
            degree: account.lecturer.degree,
            departmentId: account.lecturer.departmentId,
            departmentName: account.lecturer.department?.name,
            facultyId: account.lecturer.department?.facultyId,
            facultyName: account.lecturer.department?.faculty?.name,
            maxAdvisingQuota: account.lecturer.maxAdvisingQuota,
          }
        : undefined,
      roles,
      positions,
      userRoleScopes,
    };
  }
}
