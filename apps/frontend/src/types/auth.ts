export interface UserRoleScope {
  roleCode: string;
  scopeType?: string;
  scopeId?: string;
}

export interface StudentProfile {
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
}

export interface LecturerProfile {
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
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  studentId?: string;
  lecturerId?: string;
  student?: StudentProfile;
  lecturer?: LecturerProfile;
  roles: string[];
  positions: string[];
  userRoleScopes?: UserRoleScope[];
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}
