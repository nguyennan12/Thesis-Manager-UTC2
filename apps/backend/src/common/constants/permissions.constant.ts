// ==============================================================================
// SYSTEM PERMISSIONS & RBAC MATRIX CONSTANTS
// Hệ thống Web Quản lý Đồ án Tốt nghiệp UTC2 (UTC2-DAMS)
// ==============================================================================

import { ROLES } from './roles.constant';

/**
 * Danh mục 45+ Granular Permissions chuẩn hóa theo `<module>:<action>`
 */
export const PERMISSIONS = {
  // 1. Module Xác thực & Quản trị Hệ thống (auth, roles, users, audit_logs, settings)
  AUTH_LOGIN: 'auth:login',
  AUTH_CHANGE_PASSWORD: 'auth:change_password',
  ROLES_MANAGE: 'roles:manage',
  USERS_READ: 'users:read',
  USERS_MANAGE: 'users:manage',
  PROFILES_READ: 'profiles:read',
  PROFILES_MANAGE: 'profiles:manage',
  AUDIT_LOGS_READ: 'audit_logs:read',
  SETTINGS_MANAGE: 'settings:manage',

  // 2. Module Danh mục Học thuật (academic, semesters, quotas)
  ACADEMIC_READ: 'academic:read',
  ACADEMIC_MANAGE: 'academic:manage',
  SEMESTERS_MANAGE: 'semesters:manage',
  QUOTAS_MANAGE: 'quotas:manage',

  // 3. Phân hệ 1.0 – Quản lý Đề tài (topics)
  TOPICS_READ_APPROVED: 'topics:read_approved',
  TOPICS_READ_ALL: 'topics:read_all',
  TOPICS_PROPOSE: 'topics:propose',
  TOPICS_UPDATE_DRAFT: 'topics:update_draft',
  TOPICS_SUBMIT_REVIEW: 'topics:submit_review',
  TOPICS_REVIEW_DEPARTMENT: 'topics:review_department',
  TOPICS_APPROVE_DEAN: 'topics:approve_dean',
  TOPICS_EXPORT: 'topics:export',

  // 4. Phân hệ 2.0 – Đăng ký Đề tài (registrations)
  REGISTRATIONS_REGISTER: 'registrations:register',
  REGISTRATIONS_CANCEL: 'registrations:cancel',
  REGISTRATIONS_READ_SELF: 'registrations:read_self',
  REGISTRATIONS_READ_SCOPE: 'registrations:read_scope',
  REGISTRATIONS_REQUEST_CHANGE: 'registrations:request_change',
  REGISTRATIONS_APPROVE_CHANGE: 'registrations:approve_change',

  // 5. Phân hệ 3.0 – Theo dõi Tiến độ (progress)
  PROGRESS_SUBMIT_REPORT: 'progress:submit_report',
  PROGRESS_UPDATE_REPORT: 'progress:update_report',
  PROGRESS_REVIEW: 'progress:review',
  PROGRESS_READ_REPORTS: 'progress:read_reports',
  PROGRESS_VIEW_WARNINGS: 'progress:view_warnings',

  // 6. Giai đoạn 4 – Báo cáo Toàn văn & Đạo văn (thesis_reports)
  THESIS_REPORTS_UPLOAD: 'thesis_reports:upload',
  THESIS_REPORTS_CHECK_PLAGIARISM: 'thesis_reports:check_plagiarism',
  THESIS_REPORTS_VIEW_PLAGIARISM: 'thesis_reports:view_plagiarism',
  THESIS_REPORTS_QUALIFY_DEFENSE: 'thesis_reports:qualify_defense',

  // 7. Phân hệ 4.0 – Hội đồng & Lịch Bảo vệ (councils)
  COUNCILS_READ: 'councils:read',
  COUNCILS_MANAGE_SCHEDULE: 'councils:manage_schedule',
  COUNCILS_PROPOSE_MEMBERS: 'councils:propose_members',
  COUNCILS_APPROVE_MEMBERS: 'councils:approve_members',
  COUNCILS_ASSIGN_STUDENTS: 'councils:assign_students',
  COUNCILS_EXPORT_DECISION: 'councils:export_decision',

  // 8. Phân hệ 5.0 – Chấm điểm, Rubric & Phúc khảo (rubrics, scores, complaints, statistics)
  RUBRICS_MANAGE: 'rubrics:manage',
  SCORES_INPUT_ADVISOR: 'scores:input_advisor',
  SCORES_INPUT_REVIEWER: 'scores:input_reviewer',
  SCORES_INPUT_COUNCIL: 'scores:input_council',
  SCORES_LOCK: 'scores:lock',
  SCORES_UNLOCK: 'scores:unlock',
  SCORES_CALCULATE_FINAL: 'scores:calculate_final',
  SCORES_PUBLISH: 'scores:publish',
  COMPLAINTS_CREATE: 'complaints:create',
  COMPLAINTS_RESOLVE: 'complaints:resolve',
  STATISTICS_VIEW: 'statistics:view',
} as const;

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export interface PermissionDefinition {
  code: PermissionCode;
  name: string;
  module: string;
  description: string;
}

/**
 * Danh sách Metadata định nghĩa chi tiết cho 45+ Permissions
 */
export const PERMISSIONS_METADATA: PermissionDefinition[] = [
  // 1. Auth & Hệ thống
  {
    code: PERMISSIONS.AUTH_LOGIN,
    name: 'Đăng nhập hệ thống',
    module: 'auth',
    description: 'Cho phép đăng nhập và duy trì phiên làm việc.',
  },
  {
    code: PERMISSIONS.AUTH_CHANGE_PASSWORD,
    name: 'Đổi mật khẩu',
    module: 'auth',
    description: 'Cho phép đổi mật khẩu cá nhân.',
  },
  {
    code: PERMISSIONS.ROLES_MANAGE,
    name: 'Quản lý vai trò & quyền',
    module: 'roles',
    description: 'Tạo vai trò tùy biến và gán quyền chi tiết.',
  },
  {
    code: PERMISSIONS.USERS_READ,
    name: 'Xem danh sách tài khoản',
    module: 'users',
    description: 'Tra cứu hồ sơ tài khoản trong hệ thống.',
  },
  {
    code: PERMISSIONS.USERS_MANAGE,
    name: 'Quản lý tài khoản',
    module: 'users',
    description: 'Tạo, khóa/mở khóa tài khoản và gán vai trò/chức danh.',
  },
  {
    code: PERMISSIONS.PROFILES_READ,
    name: 'Xem hồ sơ sinh viên / giảng viên',
    module: 'profiles',
    description: 'Tra cứu hồ sơ học thuật của sinh viên và giảng viên theo phạm vi phân quyền.',
  },
  {
    code: PERMISSIONS.PROFILES_MANAGE,
    name: 'Quản lý hồ sơ & Import dữ liệu',
    module: 'profiles',
    description: 'Thêm, cập nhật hồ sơ sinh viên, giảng viên và import dữ liệu hàng loạt từ file.',
  },
  {
    code: PERMISSIONS.AUDIT_LOGS_READ,
    name: 'Xem nhật ký hệ thống',
    module: 'audit-logs',
    description: 'Tra cứu lịch sử thao tác CUD và chuyển trạng thái dữ liệu.',
  },
  {
    code: PERMISSIONS.SETTINGS_MANAGE,
    name: 'Cấu hình hệ thống',
    module: 'system-settings',
    description: 'Cấu hình tham số động (ngưỡng đạo văn, công thức điểm).',
  },

  // 2. Danh mục học thuật
  {
    code: PERMISSIONS.ACADEMIC_READ,
    name: 'Xem danh mục học thuật',
    module: 'academic',
    description: 'Tra cứu Khoa, Bộ môn, Ngành, Lớp sinh hoạt.',
  },
  {
    code: PERMISSIONS.ACADEMIC_MANAGE,
    name: 'Quản lý danh mục học thuật',
    module: 'academic',
    description: 'Thêm/sửa/xóa Khoa, Bộ môn, Ngành, Lớp.',
  },
  {
    code: PERMISSIONS.SEMESTERS_MANAGE,
    name: 'Quản lý học kỳ & mốc thời gian',
    module: 'academic',
    description: 'Cấu hình học kỳ và các mốc hạn đăng ký, nộp bài, bảo vệ.',
  },
  {
    code: PERMISSIONS.QUOTAS_MANAGE,
    name: 'Quản lý định mức hướng dẫn (Quota)',
    module: 'academic',
    description: 'Xem và thiết lập chỉ tiêu số lượng đồ án tối đa cho giảng viên theo học kỳ.',
  },

  // 3. Phân hệ 1.0 – Đề tài
  {
    code: PERMISSIONS.TOPICS_READ_APPROVED,
    name: 'Xem đề tài đã duyệt',
    module: 'topics',
    description: 'Tra cứu danh mục đề tài chính thức đã được phê duyệt.',
  },
  {
    code: PERMISSIONS.TOPICS_READ_ALL,
    name: 'Xem tất cả đề tài',
    module: 'topics',
    description: 'Xem toàn bộ đề tài theo phạm vi quản lý (Bộ môn / Khoa).',
  },
  {
    code: PERMISSIONS.TOPICS_PROPOSE,
    name: 'Đề xuất đề tài mới',
    module: 'topics',
    description: 'Giảng viên tạo đề xuất đề tài mới (BR-02).',
  },
  {
    code: PERMISSIONS.TOPICS_UPDATE_DRAFT,
    name: 'Chỉnh sửa đề tài nháp',
    module: 'topics',
    description: 'Sửa hoặc xóa đề tài nháp của chính mình.',
  },
  {
    code: PERMISSIONS.TOPICS_SUBMIT_REVIEW,
    name: 'Gửi đề tài thẩm định',
    module: 'topics',
    description: 'Gửi đề tài lên Trưởng bộ môn thẩm định.',
  },
  {
    code: PERMISSIONS.TOPICS_REVIEW_DEPARTMENT,
    name: 'Trưởng bộ môn thẩm định đề tài',
    module: 'topics',
    description: 'Thẩm định tính khả thi, trùng lặp và duyệt cấp 1 (BR-04).',
  },
  {
    code: PERMISSIONS.TOPICS_APPROVE_DEAN,
    name: 'Ban chủ nhiệm phê duyệt đề tài',
    module: 'topics',
    description: 'Ban chủ nhiệm Khoa phê duyệt ban hành cấp 2 (BR-04).',
  },
  {
    code: PERMISSIONS.TOPICS_EXPORT,
    name: 'Xuất danh mục đề tài',
    module: 'topics',
    description: 'Xuất danh sách đề tài ra định dạng Excel/PDF.',
  },

  // 4. Phân hệ 2.0 – Đăng ký
  {
    code: PERMISSIONS.REGISTRATIONS_REGISTER,
    name: 'Đăng ký đề tài',
    module: 'registrations',
    description: 'Sinh viên đăng ký đề tài trong thời hạn mở đợt (BR-01).',
  },
  {
    code: PERMISSIONS.REGISTRATIONS_CANCEL,
    name: 'Hủy đăng ký đề tài',
    module: 'registrations',
    description: 'Sinh viên hủy đăng ký đề tài trong hạn cho phép.',
  },
  {
    code: PERMISSIONS.REGISTRATIONS_READ_SELF,
    name: 'Xem đăng ký cá nhân',
    module: 'registrations',
    description: 'Sinh viên tra cứu hồ sơ và trạng thái đăng ký của mình.',
  },
  {
    code: PERMISSIONS.REGISTRATIONS_READ_SCOPE,
    name: 'Xem đăng ký theo phạm vi',
    module: 'registrations',
    description: 'Xem danh sách đăng ký theo phạm vi GVHD, Bộ môn hoặc Khoa.',
  },
  {
    code: PERMISSIONS.REGISTRATIONS_REQUEST_CHANGE,
    name: 'Yêu cầu đổi đề tài / GVHD muộn',
    module: 'registrations',
    description: 'Sinh viên nộp đơn yêu cầu thay đổi sau hạn đăng ký (BR-03).',
  },
  {
    code: PERMISSIONS.REGISTRATIONS_APPROVE_CHANGE,
    name: 'Phê duyệt thay đổi đăng ký',
    module: 'registrations',
    description: 'Ban chủ nhiệm Khoa phê duyệt đơn đổi đề tài/GVHD (BR-03).',
  },

  // 5. Phân hệ 3.0 – Theo dõi Tiến độ
  {
    code: PERMISSIONS.PROGRESS_SUBMIT_REPORT,
    name: 'Nộp báo cáo tuần',
    module: 'progress',
    description: 'Sinh viên nộp báo cáo tiến độ tuần theo hạn (BR-05).',
  },
  {
    code: PERMISSIONS.PROGRESS_UPDATE_REPORT,
    name: 'Cập nhật báo cáo tuần',
    module: 'progress',
    description: 'Sinh viên chỉnh sửa nội dung báo cáo tuần trong hạn.',
  },
  {
    code: PERMISSIONS.PROGRESS_REVIEW,
    name: 'Nhận xét báo cáo tiến độ',
    module: 'progress',
    description: 'GVHD nhận xét và đánh giá mức độ hoàn thành (BR-05).',
  },
  {
    code: PERMISSIONS.PROGRESS_READ_REPORTS,
    name: 'Xem lịch sử tiến độ',
    module: 'progress',
    description: 'Xem báo cáo tuần và nhận xét của giảng viên hướng dẫn.',
  },
  {
    code: PERMISSIONS.PROGRESS_VIEW_WARNINGS,
    name: 'Xem cảnh báo chậm tiến độ',
    module: 'progress',
    description: 'Danh sách sinh viên bị cảnh báo chậm nộp báo cáo (BR-05).',
  },

  // 6. Giai đoạn 4 – Báo cáo Toàn văn & Đạo văn
  {
    code: PERMISSIONS.THESIS_REPORTS_UPLOAD,
    name: 'Nộp báo cáo toàn văn',
    module: 'thesis-reports',
    description: 'Sinh viên nộp file tài liệu toàn văn đồ án tốt nghiệp.',
  },
  {
    code: PERMISSIONS.THESIS_REPORTS_CHECK_PLAGIARISM,
    name: 'Quét kiểm tra trùng lặp',
    module: 'thesis-reports',
    description: 'Thực thi kiểm tra tỷ lệ trùng lặp văn bản (BR-06).',
  },
  {
    code: PERMISSIONS.THESIS_REPORTS_VIEW_PLAGIARISM,
    name: 'Xem kết quả trùng lặp',
    module: 'thesis-reports',
    description: 'Xem % và chi tiết các đoạn văn bản trùng lặp (BR-06).',
  },
  {
    code: PERMISSIONS.THESIS_REPORTS_QUALIFY_DEFENSE,
    name: 'Xác nhận đủ điều kiện bảo vệ',
    module: 'thesis-reports',
    description: 'GVHD đánh giá và xác nhận đủ/không đủ điều kiện bảo vệ (BR-06).',
  },

  // 7. Phân hệ 4.0 – Hội đồng & Lịch Bảo vệ
  {
    code: PERMISSIONS.COUNCILS_READ,
    name: 'Xem thông tin hội đồng',
    module: 'councils',
    description: 'Tra cứu thông tin hội đồng, phòng và lịch bảo vệ.',
  },
  {
    code: PERMISSIONS.COUNCILS_MANAGE_SCHEDULE,
    name: 'Quản lý lịch bảo vệ',
    module: 'councils',
    description: 'Giáo vụ lập hội đồng, xếp ngày, giờ, phòng bảo vệ (BR-07).',
  },
  {
    code: PERMISSIONS.COUNCILS_PROPOSE_MEMBERS,
    name: 'Đề xuất thành viên hội đồng',
    module: 'councils',
    description: 'Trưởng bộ môn đề xuất giảng viên tham gia hội đồng.',
  },
  {
    code: PERMISSIONS.COUNCILS_APPROVE_MEMBERS,
    name: 'Phê duyệt thành viên hội đồng',
    module: 'councils',
    description: 'Ban chủ nhiệm Khoa phê duyệt quyết định thành lập HĐ (BR-07).',
  },
  {
    code: PERMISSIONS.COUNCILS_ASSIGN_STUDENTS,
    name: 'Phân công sinh viên vào HĐ',
    module: 'councils',
    description: 'Giáo vụ phân công danh sách sinh viên vào hội đồng bảo vệ.',
  },
  {
    code: PERMISSIONS.COUNCILS_EXPORT_DECISION,
    name: 'Xuất quyết định hội đồng',
    module: 'councils',
    description: 'Xuất quyết định thành lập hội đồng và biên bản PDF.',
  },

  // 8. Phân hệ 5.0 – Chấm điểm, Rubric & Phúc khảo
  {
    code: PERMISSIONS.RUBRICS_MANAGE,
    name: 'Quản lý bộ tiêu chí Rubric',
    module: 'grading',
    description: 'Thiết lập tiêu chí và tỷ lệ trọng số chấm điểm 100% (BR-08).',
  },
  {
    code: PERMISSIONS.SCORES_INPUT_ADVISOR,
    name: 'Nhập điểm GVHD',
    module: 'grading',
    description: 'Giảng viên hướng dẫn nhập điểm quá trình theo tiêu chí.',
  },
  {
    code: PERMISSIONS.SCORES_INPUT_REVIEWER,
    name: 'Nhập điểm GVPB',
    module: 'grading',
    description: 'Giảng viên phản biện nhập điểm nhận xét theo tiêu chí.',
  },
  {
    code: PERMISSIONS.SCORES_INPUT_COUNCIL,
    name: 'Nhập điểm Hội đồng',
    module: 'grading',
    description: 'Từng thành viên hội đồng nhập điểm đánh giá trực tiếp.',
  },
  {
    code: PERMISSIONS.SCORES_LOCK,
    name: 'Khóa phiếu điểm cá nhân',
    module: 'grading',
    description: 'Khóa phiếu điểm sau khi hoàn tất chấm (BR-09).',
  },
  {
    code: PERMISSIONS.SCORES_UNLOCK,
    name: 'Mở khóa phiếu điểm',
    module: 'grading',
    description: 'Ban chủ nhiệm Khoa mở khóa phiếu điểm có ghi vết log (BR-09).',
  },
  {
    code: PERMISSIONS.SCORES_CALCULATE_FINAL,
    name: 'Tính điểm tổng kết đồ án',
    module: 'grading',
    description: 'Tự động tính điểm tổng kết theo trọng số (BR-10, BR-11).',
  },
  {
    code: PERMISSIONS.SCORES_PUBLISH,
    name: 'Công bố điểm học phần',
    module: 'grading',
    description: 'Giáo vụ công bố điểm chính thức cho sinh viên.',
  },
  {
    code: PERMISSIONS.COMPLAINTS_CREATE,
    name: 'Nộp đơn phúc khảo',
    module: 'complaints',
    description: 'Sinh viên gửi đơn khiếu nại/phúc khảo điểm (BR-12).',
  },
  {
    code: PERMISSIONS.COMPLAINTS_RESOLVE,
    name: 'Giải quyết phúc khảo',
    module: 'complaints',
    description: 'Ban chủ nhiệm Khoa cập nhật điểm sau phúc khảo (BR-12).',
  },
  {
    code: PERMISSIONS.STATISTICS_VIEW,
    name: 'Xem báo cáo thống kê',
    module: 'statistics',
    description: 'Tra cứu dashboard thống kê và xuất báo cáo tổng hợp.',
  },
];

/**
 * Ma trận gán quyền mặc định cho từng Role kỹ thuật theo tài liệu RBAC_PERMISSION_MATRIX.md
 */
export const ROLE_DEFAULT_PERMISSIONS: Record<string, PermissionCode[]> = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),

  [ROLES.STUDENT]: [
    PERMISSIONS.AUTH_LOGIN,
    PERMISSIONS.AUTH_CHANGE_PASSWORD,
    PERMISSIONS.ACADEMIC_READ,
    PERMISSIONS.TOPICS_READ_APPROVED,
    PERMISSIONS.REGISTRATIONS_REGISTER,
    PERMISSIONS.REGISTRATIONS_CANCEL,
    PERMISSIONS.REGISTRATIONS_READ_SELF,
    PERMISSIONS.REGISTRATIONS_REQUEST_CHANGE,
    PERMISSIONS.PROGRESS_SUBMIT_REPORT,
    PERMISSIONS.PROGRESS_UPDATE_REPORT,
    PERMISSIONS.PROGRESS_READ_REPORTS,
    PERMISSIONS.THESIS_REPORTS_UPLOAD,
    PERMISSIONS.THESIS_REPORTS_CHECK_PLAGIARISM,
    PERMISSIONS.THESIS_REPORTS_VIEW_PLAGIARISM,
    PERMISSIONS.COUNCILS_READ,
    PERMISSIONS.COMPLAINTS_CREATE,
  ],

  [ROLES.LECTURER]: [
    PERMISSIONS.AUTH_LOGIN,
    PERMISSIONS.AUTH_CHANGE_PASSWORD,
    PERMISSIONS.ACADEMIC_READ,
    PERMISSIONS.TOPICS_READ_APPROVED,
    PERMISSIONS.TOPICS_READ_ALL,
    PERMISSIONS.TOPICS_PROPOSE,
    PERMISSIONS.TOPICS_UPDATE_DRAFT,
    PERMISSIONS.TOPICS_SUBMIT_REVIEW,
    PERMISSIONS.TOPICS_REVIEW_DEPARTMENT, // Khi có position HEAD_OF_DEPARTMENT
    PERMISSIONS.TOPICS_APPROVE_DEAN,       // Khi có position FACULTY_DEAN
    PERMISSIONS.TOPICS_EXPORT,
    PERMISSIONS.REGISTRATIONS_READ_SCOPE,
    PERMISSIONS.REGISTRATIONS_APPROVE_CHANGE, // Khi có position FACULTY_DEAN
    PERMISSIONS.PROGRESS_REVIEW,
    PERMISSIONS.PROGRESS_READ_REPORTS,
    PERMISSIONS.PROGRESS_VIEW_WARNINGS,
    PERMISSIONS.THESIS_REPORTS_CHECK_PLAGIARISM,
    PERMISSIONS.THESIS_REPORTS_VIEW_PLAGIARISM,
    PERMISSIONS.THESIS_REPORTS_QUALIFY_DEFENSE,
    PERMISSIONS.COUNCILS_READ,
    PERMISSIONS.COUNCILS_PROPOSE_MEMBERS, // Khi có position HEAD_OF_DEPARTMENT
    PERMISSIONS.COUNCILS_APPROVE_MEMBERS, // Khi có position FACULTY_DEAN
    PERMISSIONS.SCORES_INPUT_ADVISOR,
    PERMISSIONS.SCORES_INPUT_REVIEWER,
    PERMISSIONS.SCORES_INPUT_COUNCIL,
    PERMISSIONS.SCORES_LOCK,
    PERMISSIONS.SCORES_UNLOCK,           // Khi có position FACULTY_DEAN
    PERMISSIONS.COMPLAINTS_RESOLVE,      // Khi có position FACULTY_DEAN
    PERMISSIONS.PROFILES_READ,           // Khi có position HEAD_OF_DEPARTMENT hoặc FACULTY_DEAN
    PERMISSIONS.QUOTAS_MANAGE,           // Khi có position FACULTY_DEAN
    PERMISSIONS.STATISTICS_VIEW,
  ],

  [ROLES.STAFF]: [
    PERMISSIONS.AUTH_LOGIN,
    PERMISSIONS.AUTH_CHANGE_PASSWORD,
    PERMISSIONS.ACADEMIC_READ,
    PERMISSIONS.ACADEMIC_MANAGE,
    PERMISSIONS.SEMESTERS_MANAGE,
    PERMISSIONS.QUOTAS_MANAGE,
    PERMISSIONS.PROFILES_READ,
    PERMISSIONS.PROFILES_MANAGE,
    PERMISSIONS.TOPICS_READ_APPROVED,
    PERMISSIONS.TOPICS_READ_ALL,
    PERMISSIONS.TOPICS_EXPORT,
    PERMISSIONS.REGISTRATIONS_READ_SCOPE,
    PERMISSIONS.REGISTRATIONS_APPROVE_CHANGE, // Phạm vi vị trí được kiểm tra ở service
    PERMISSIONS.PROGRESS_READ_REPORTS,
    PERMISSIONS.PROGRESS_VIEW_WARNINGS,
    PERMISSIONS.THESIS_REPORTS_CHECK_PLAGIARISM,
    PERMISSIONS.THESIS_REPORTS_VIEW_PLAGIARISM,
    PERMISSIONS.COUNCILS_READ,
    PERMISSIONS.COUNCILS_MANAGE_SCHEDULE,
    PERMISSIONS.COUNCILS_ASSIGN_STUDENTS,
    PERMISSIONS.COUNCILS_EXPORT_DECISION,
    PERMISSIONS.RUBRICS_MANAGE,
    PERMISSIONS.SCORES_CALCULATE_FINAL,
    PERMISSIONS.SCORES_PUBLISH,
    PERMISSIONS.STATISTICS_VIEW,
  ],
};
