import { describe, it, expect } from 'vitest';
import { DataScopeHelper } from './data-scope.helper';
import { AuthenticatedUser } from '../interfaces/jwt-payload.interface';
import { ROLES } from '../constants/roles.constant';

describe('DataScopeHelper (Layer 3 Defense-in-Depth)', () => {
  it('should return global scope for ADMIN role', () => {
    const adminUser: AuthenticatedUser = {
      sub: 'admin-id',
      username: 'admin',
      email: 'admin@utc2.edu.vn',
      roles: [ROLES.ADMIN],
      permissions: ['users:manage'],
      positions: [],
      userRoleScopes: [],
    };

    const scope = DataScopeHelper.extractScope(adminUser);
    expect(scope.isGlobal).toBe(true);
    expect(DataScopeHelper.canAccessFaculty(scope, 'any-faculty')).toBe(true);
    expect(DataScopeHelper.canAccessDepartment(scope, 'any-dept')).toBe(true);
  });

  it('should return global scope for TRAINING_DEPT position', () => {
    const pdtUser: AuthenticatedUser = {
      sub: 'pdt-id',
      username: 'pdt',
      email: 'pdt@utc2.edu.vn',
      roles: [ROLES.LECTURER],
      permissions: ['academic:manage'],
      positions: ['TRAINING_DEPT'],
      userRoleScopes: [],
    };

    const scope = DataScopeHelper.extractScope(pdtUser);
    expect(scope.isGlobal).toBe(true);
  });

  it('should strictly limit Faculty Academic Affairs (Giao vu Khoa) to their assigned Faculty', () => {
    const facultyAUser: AuthenticatedUser = {
      sub: 'faculty-staff-a',
      username: 'giao-vu-cntt',
      email: 'giao-vu-cntt@utc2.edu.vn',
      roles: [ROLES.LECTURER],
      permissions: ['academic:manage', 'profiles:manage'],
      positions: ['ACADEMIC_AFFAIRS'],
      facultyId: 'faculty-cntt-id',
      userRoleScopes: [
        {
          roleCode: 'ACADEMIC_AFFAIRS',
          scopeType: 'FACULTY',
          scopeId: 'faculty-cntt-id',
        },
      ],
    };

    const scope = DataScopeHelper.extractScope(facultyAUser);
    expect(scope.isGlobal).toBe(false);
    expect(scope.facultyIds).toContain('faculty-cntt-id');
    expect(scope.facultyIds).not.toContain('faculty-kinh-te-id');

    // Giáo vụ Khoa CNTT được phép truy cập Khoa CNTT
    expect(DataScopeHelper.canAccessFaculty(scope, 'faculty-cntt-id')).toBe(true);

    // BẢO MẬT TẦNG 3: Giáo vụ Khoa CNTT TUYỆT ĐỐI KHÔNG xem được dữ liệu Khoa Kinh Tế
    expect(DataScopeHelper.canAccessFaculty(scope, 'faculty-kinh-te-id')).toBe(false);
  });

  it('should strictly limit Head of Department to their assigned Department', () => {
    const hodUser: AuthenticatedUser = {
      sub: 'hod-user-id',
      username: 'tbm-cnpm',
      email: 'tbm-cnpm@utc2.edu.vn',
      roles: [ROLES.LECTURER],
      permissions: ['topics:approve'],
      positions: ['HEAD_OF_DEPARTMENT'],
      facultyId: 'faculty-cntt-id',
      departmentId: 'dept-cnpm-id',
      userRoleScopes: [
        {
          roleCode: 'HEAD_OF_DEPARTMENT',
          scopeType: 'DEPARTMENT',
          scopeId: 'dept-cnpm-id',
        },
      ],
    };

    const scope = DataScopeHelper.extractScope(hodUser);
    expect(scope.isGlobal).toBe(false);
    expect(scope.departmentIds).toContain('dept-cnpm-id');
    expect(scope.departmentIds).not.toContain('dept-mang-id');

    // Được duyệt bộ môn CNPM
    expect(DataScopeHelper.canAccessDepartment(scope, 'dept-cnpm-id')).toBe(true);

    // Không thể duyệt bộ môn Mạng máy tính
    expect(DataScopeHelper.canAccessDepartment(scope, 'dept-mang-id')).toBe(false);
  });

  it('should safely return empty non-global scope when user is undefined or null', () => {
    const scopeNull = DataScopeHelper.extractScope(null);
    expect(scopeNull.isGlobal).toBe(false);
    expect(scopeNull.facultyIds).toHaveLength(0);
    expect(scopeNull.departmentIds).toHaveLength(0);

    const scopeUndefined = DataScopeHelper.extractScope(undefined);
    expect(scopeUndefined.isGlobal).toBe(false);
    expect(DataScopeHelper.canAccessFaculty(scopeUndefined, 'faculty-a')).toBe(false);
  });
});
