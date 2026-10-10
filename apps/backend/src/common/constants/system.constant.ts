// ==============================================================================
// SYSTEM & DOMAIN CONSTANTS
// Hệ thống Web Quản lý Đồ án Tốt nghiệp UTC2 (UTC2-DAMS)
// ==============================================================================

/**
 * Quy chuẩn định dạng Email của Trường ĐH Giao thông Vận tải Phân hiệu tại TP.HCM
 */
export const EMAIL_DOMAINS = {
  STUDENT: '@st.utc2.edu.vn',   // Email sinh viên (ví dụ: 6551071001@st.utc2.edu.vn)
  LECTURER: '@utc2.edu.vn',     // Email giảng viên (ví dụ: mien.phamthi@utc2.edu.vn)
  STAFF: '@utc2.edu.vn',        // Email cán bộ nhân viên
} as const;

export const AUTH_COOKIES = {
  ACCESS_TOKEN: 'access_token',
} as const;
