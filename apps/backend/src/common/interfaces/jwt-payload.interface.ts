// ==============================================================================
// JWT PAYLOAD & AUTHENTICATED USER INTERFACES
// ==============================================================================

export interface UserRoleScope {
  roleCode: string;
  scopeType?: string; // GLOBAL, FACULTY, DEPARTMENT, OWNER
  scopeId?: string;
}

export interface JwtPayload {
  sub: string; // Account ID (UUID)
  username: string;
  email: string;
  roles: string[]; // ['ADMIN'], ['LECTURER'], ['STUDENT'], ['STAFF']
  positions?: string[]; // ['FACULTY_DEAN'], ['HEAD_OF_DEPARTMENT'], ['ACADEMIC_AFFAIRS']
  permissions?: string[]; // Granular permission codes
  studentId?: string;
  lecturerId?: string;
  facultyId?: string;
  departmentId?: string;
  userRoleScopes?: UserRoleScope[];
}

export interface AuthenticatedUser extends JwtPayload {}
