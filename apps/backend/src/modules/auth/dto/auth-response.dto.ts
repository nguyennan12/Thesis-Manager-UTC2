// ==============================================================================
// AUTH & PROFILE RESPONSE DTOS
// ==============================================================================

export interface UserRoleScopeDto {
  roleCode: string;
  scopeType?: string;
  scopeId?: string;
}

export interface UserProfileDto {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  studentId?: string;
  lecturerId?: string;
  student?: {
    id: string;
    code: string;
    fullName: string;
    email: string;
    phone?: string | null;
    classId: string;
    className?: string;
    gpaCumulative: number;
    creditsAccumulated: number;
    status: string;
  };
  lecturer?: {
    id: string;
    code: string;
    fullName: string;
    email: string;
    phone?: string | null;
    degree?: string | null;
    departmentId: string;
    departmentName?: string;
    facultyId?: string;
    facultyName?: string;
    maxAdvisingQuota: number;
  };
  roles: string[];
  positions: string[];
  userRoleScopes: UserRoleScopeDto[];
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: UserProfileDto;
}
