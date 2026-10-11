// ==============================================================================
// QUOTA RESOLVER HELPER (Resolve Effective Advisor Quota for Semester)
// ==============================================================================

export class QuotaResolverHelper {
  /**
   * Tính toán định mức hướng dẫn hiệu lực của giảng viên trong một học kỳ cụ thể
   * Quy tắc nghiệp vụ BR-02 (A1):
   * Quota hiệu lực = Quota riêng của học kỳ (nếu đã đặt), ngược lại dùng default = 5
   * @param semesterQuota Chỉ tiêu riêng theo học kỳ từ bảng lecturer_semester_quotas
   * @param defaultQuota Cấu hình mặc định từ hệ thống (advising.default_quota, default: 5)
   */
  static resolve(semesterQuota?: number | null, defaultQuota: number = 5): number {
    if (typeof semesterQuota === 'number' && semesterQuota > 0) {
      return semesterQuota;
    }
    return Math.max(1, defaultQuota);
  }
}
