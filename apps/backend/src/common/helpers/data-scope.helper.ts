// ==============================================================================
// DATA SCOPE HELPER (Layer 3 Defense in Depth: Role Scope Extraction & Filtering)
// ==============================================================================

import { AuthenticatedUser } from '../interfaces/jwt-payload.interface';
import { ROLES } from '../constants/roles.constant';

export interface ScopeFilter {
  isGlobal: boolean;
  facultyIds: string[];
  departmentIds: string[];
}

export class DataScopeHelper {
  /**
   * Trích xuất ScopeFilter từ thông tin người dùng hiện tại
   * @param user Thông tin người dùng đăng nhập
   */
  static extractScope(user?: AuthenticatedUser | null): ScopeFilter {
    if (!user) {
      return { isGlobal: false, facultyIds: [], departmentIds: [] };
    }

    // Admin hoặc Training Dept luôn có quyền Global
    if (
      user.roles?.includes(ROLES.ADMIN) ||
      user.positions?.includes('TRAINING_DEPT') ||
      user.positions?.includes('UNIVERSITY_BOARD')
    ) {
      return { isGlobal: true, facultyIds: [], departmentIds: [] };
    }

    const facultyIds = new Set<string>();
    const departmentIds = new Set<string>();

    if (user.facultyId) {
      facultyIds.add(user.facultyId);
    }
    if (user.departmentId) {
      departmentIds.add(user.departmentId);
    }

    if (user.userRoleScopes && Array.isArray(user.userRoleScopes)) {
      for (const s of user.userRoleScopes) {
        if (s.scopeType === 'GLOBAL') {
          return { isGlobal: true, facultyIds: [], departmentIds: [] };
        }
        if (s.scopeType === 'FACULTY' && s.scopeId) {
          facultyIds.add(s.scopeId);
        }
        if (s.scopeType === 'DEPARTMENT' && s.scopeId) {
          departmentIds.add(s.scopeId);
        }
      }
    }

    return {
      isGlobal: false,
      facultyIds: Array.from(facultyIds),
      departmentIds: Array.from(departmentIds),
    };
  }

  /**
   * Kiểm tra xem người dùng có quyền truy cập vào một Khoa cụ thể không
   */
  static canAccessFaculty(scope: ScopeFilter, facultyId: string): boolean {
    if (scope.isGlobal) return true;
    return scope.facultyIds.includes(facultyId);
  }

  /**
   * Kiểm tra xem người dùng có quyền truy cập vào một Bộ môn cụ thể không
   */
  static canAccessDepartment(scope: ScopeFilter, departmentId: string): boolean {
    if (scope.isGlobal) return true;
    return scope.departmentIds.includes(departmentId);
  }
}
