// ==============================================================================
// TECHNICAL ROLES, POSITIONS & SCOPES CONSTANTS
// Hệ thống Web Quản lý Đồ án Tốt nghiệp UTC2 (UTC2-DAMS)
// ==============================================================================

/**
 * 4 Role kỹ thuật chính trong hệ thống (SRS Mục 2.3 & RBAC Matrix)
 */
export const ROLES = {
  ADMIN: 'ADMIN',
  STUDENT: 'STUDENT',
  LECTURER: 'LECTURER',
  STAFF: 'STAFF',
} as const;

export type RoleCode = (typeof ROLES)[keyof typeof ROLES];

/**
 * Các chức danh nghiệp vụ chuyên biệt gắn theo Scope đơn vị (Khoa / Bộ môn / Toàn trường)
 */
export const ROLE_POSITIONS = {
  HEAD_OF_DEPARTMENT: 'HEAD_OF_DEPARTMENT', // Trưởng Bộ môn (Scope: DEPARTMENT)
  FACULTY_DEAN: 'FACULTY_DEAN',             // Ban Chủ nhiệm Khoa (Scope: FACULTY)
  ACADEMIC_AFFAIRS: 'ACADEMIC_AFFAIRS',     // Giáo vụ Khoa (Scope: FACULTY)
  TRAINING_DEPT: 'TRAINING_DEPT',           // Phòng Đào tạo (Scope: GLOBAL)
  UNIVERSITY_BOARD: 'UNIVERSITY_BOARD',     // Ban Giám đốc (Scope: GLOBAL - Chỉ đọc)
} as const;

export type RolePosition = (typeof ROLE_POSITIONS)[keyof typeof ROLE_POSITIONS];

/**
 * Phạm vi tác động của chức danh (Scope Type)
 */
export const ROLE_SCOPES = {
  GLOBAL: 'GLOBAL',         // Toàn trường
  FACULTY: 'FACULTY',       // Theo Khoa
  DEPARTMENT: 'DEPARTMENT', // Theo Bộ môn
  OWNER: 'OWNER',           // Dữ liệu của chính mình
} as const;

export type RoleScope = (typeof ROLE_SCOPES)[keyof typeof ROLE_SCOPES];

/**
 * Metadata định nghĩa chi tiết cho 4 Role kỹ thuật hệ thống
 */
export const SYSTEM_ROLES_METADATA = [
  {
    code: ROLES.ADMIN,
    name: 'Quản trị hệ thống',
    description: 'Vận hành kỹ thuật, quản lý tài khoản, phân quyền, sao lưu và nhật ký audit log.',
    isSystem: true,
  },
  {
    code: ROLES.STUDENT,
    name: 'Sinh viên',
    description: 'Sinh viên thực hiện đồ án tốt nghiệp, tra cứu đề tài, nộp báo cáo tuần và báo cáo toàn văn.',
    isSystem: true,
  },
  {
    code: ROLES.LECTURER,
    name: 'Giảng viên',
    description: 'Giảng viên hướng dẫn, phản biện, thành viên hội đồng, Trưởng bộ môn và Ban chủ nhiệm khoa.',
    isSystem: true,
  },
  {
    code: ROLES.STAFF,
    name: 'Nhân viên quản lý',
    description: 'Giáo vụ khoa, chuyên viên phòng đào tạo và cán bộ quản lý học vụ.',
    isSystem: true,
  },
];
