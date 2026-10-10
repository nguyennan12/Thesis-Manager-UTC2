export interface UserRoleScope {
  roleCode: string;
  scopeType?: string; // GLOBAL, FACULTY, DEPARTMENT
  scopeId?: string;
}

export interface JwtPayload {
  sub: string; // Account ID (UUID)
  username: string;
  email: string;
  roles: string[]; // List of active role codes (e.g. ['ADMIN'] or ['LECTURER', 'HEAD_OF_DEPARTMENT'])
  permissions?: string[]; // List of permission codes (e.g. ['topics.approve', 'grades.lock'])
  studentId?: string;
  lecturerId?: string;
  facultyId?: string;
  departmentId?: string;
  userRoleScopes?: UserRoleScope[];
}

export interface AuthenticatedUser extends JwtPayload {}
