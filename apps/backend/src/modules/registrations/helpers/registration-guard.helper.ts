// ==============================================================================
// REGISTRATION GUARD HELPER (Strict Business Rule Validations: BR-01, BR-02, BR-03, BR-04)
// ==============================================================================

import { StudentStatus, Prisma } from '@prisma/client';

export interface StudentEligibilityInput {
  status: StudentStatus;
  gpaCumulative: number | Prisma.Decimal;
  creditsAccumulated: number;
}

export interface SemesterRegistrationDatesInput {
  isCurrent: boolean;
  topicRegistrationStart?: Date | string | null;
  topicRegistrationEnd?: Date | string | null;
}

export class RegistrationGuardHelper {
  private static readonly MIN_GPA = 2.0;
  private static readonly MIN_CREDITS = 105;

  /**
   * BR-01: Kiểm tra sinh viên có đủ điều kiện làm đồ án tốt nghiệp
   */
  static validateStudentEligibility(student: StudentEligibilityInput): string[] {
    const errors: string[] = [];

    if (student.status !== StudentStatus.STUDYING) {
      errors.push('Sinh viên không ở trạng thái đang học (STUDYING) để được phép đăng ký đồ án.');
    }

    const gpa = Number(student.gpaCumulative);
    if (gpa < this.MIN_GPA) {
      errors.push(`Điểm trung bình tích lũy hiện tại (${gpa.toFixed(2)}) không đạt điều kiện tối thiểu ${this.MIN_GPA.toFixed(2)}.`);
    }

    if (student.creditsAccumulated < this.MIN_CREDITS) {
      errors.push(`Số tín chỉ tích lũy (${student.creditsAccumulated}) chưa đạt mức tối thiểu ${this.MIN_CREDITS} tín chỉ theo quy định.`);
    }

    return errors;
  }

  /**
   * BR-03: Kiểm tra thời hạn mở cổng đăng ký đề tài trong học kỳ
   */
  static validateSemesterTimeline(
    semester: SemesterRegistrationDatesInput,
    currentDate: Date = new Date(),
  ): string | null {
    if (!semester.isCurrent) {
      return 'Học kỳ được chọn hiện không phải là học kỳ đang mở hoạt động (isCurrent = false).';
    }

    if (!semester.topicRegistrationStart || !semester.topicRegistrationEnd) {
      return 'Học kỳ hiện tại chưa được thiết lập khung thời gian mở cổng đăng ký đề tài.';
    }

    const start = new Date(semester.topicRegistrationStart);
    const end = new Date(semester.topicRegistrationEnd);
    const now = currentDate.getTime();

    if (now < start.getTime()) {
      return `Cổng đăng ký đề tài chưa mở. Thời gian mở đăng ký bắt đầu từ: ${start.toLocaleString('vi-VN')}.`;
    }

    if (now > end.getTime()) {
      return `Cổng đăng ký đề tài đã kết thúc lúc: ${end.toLocaleString('vi-VN')}. Bạn không thể đăng ký hoặc hủy đăng ký.`;
    }

    return null;
  }

  /**
   * BR-02: Kiểm tra định mức hướng dẫn của Giảng viên (Quota)
   */
  static validateAdvisorQuota(currentAdvisedCount: number, maxQuota: number): string | null {
    if (currentAdvisedCount >= maxQuota) {
      return `Giảng viên hướng dẫn đã nhận đủ chỉ tiêu hướng dẫn (${currentAdvisedCount}/${maxQuota} sinh viên) trong học kỳ này.`;
    }
    return null;
  }

  /**
   * BR-04: Kiểm tra số lượng sinh viên tối đa của đề tài
   */
  static validateTopicCapacity(currentStudentCount: number, maxStudents: number): string | null {
    if (currentStudentCount >= maxStudents) {
      return `Đề tài đã đủ số lượng sinh viên tham gia (${currentStudentCount}/${maxStudents} sinh viên).`;
    }
    return null;
  }
}
