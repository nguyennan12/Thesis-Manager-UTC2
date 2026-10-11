import { describe, it, expect } from 'vitest';
import { RegistrationGuardHelper } from './registration-guard.helper';
import { StudentStatus, Prisma } from '@prisma/client';

describe('RegistrationGuardHelper (BR-01, BR-02, BR-03, BR-04)', () => {
  describe('BR-01: validateStudentEligibility', () => {
    it('should pass when student meets all criteria', () => {
      const student = {
        status: StudentStatus.STUDYING,
        gpaCumulative: new Prisma.Decimal('2.85'),
        creditsAccumulated: 120,
      };
      const errors = RegistrationGuardHelper.validateStudentEligibility(student);
      expect(errors).toHaveLength(0);
    });

    it('should reject student with low GPA (< 2.00)', () => {
      const student = {
        status: StudentStatus.STUDYING,
        gpaCumulative: new Prisma.Decimal('1.85'),
        creditsAccumulated: 120,
      };
      const errors = RegistrationGuardHelper.validateStudentEligibility(student);
      expect(errors.some((e) => e.includes('Điểm trung bình tích lũy hiện tại (1.85) không đạt'))).toBe(true);
    });

    it('should reject student with insufficient credits (< 105)', () => {
      const student = {
        status: StudentStatus.STUDYING,
        gpaCumulative: new Prisma.Decimal('3.20'),
        creditsAccumulated: 98,
      };
      const errors = RegistrationGuardHelper.validateStudentEligibility(student);
      expect(errors.some((e) => e.includes('chưa đạt mức tối thiểu 105 tín chỉ'))).toBe(true);
    });

    it('should reject student not in STUDYING status', () => {
      const student = {
        status: StudentStatus.RESERVED,
        gpaCumulative: new Prisma.Decimal('2.50'),
        creditsAccumulated: 110,
      };
      const errors = RegistrationGuardHelper.validateStudentEligibility(student);
      expect(errors.some((e) => e.includes('không ở trạng thái đang học'))).toBe(true);
    });
  });

  describe('BR-03: validateSemesterTimeline', () => {
    const semester = {
      isCurrent: true,
      topicRegistrationStart: '2026-09-01T00:00:00.000Z',
      topicRegistrationEnd: '2026-09-15T23:59:59.000Z',
    };

    it('should pass when current date is within registration window', () => {
      const duringRegistration = new Date('2026-09-10T10:00:00.000Z');
      expect(RegistrationGuardHelper.validateSemesterTimeline(semester, duringRegistration)).toBeNull();
    });

    it('should reject when registration portal has not opened yet', () => {
      const beforeRegistration = new Date('2026-08-25T10:00:00.000Z');
      const err = RegistrationGuardHelper.validateSemesterTimeline(semester, beforeRegistration);
      expect(err).toContain('Cổng đăng ký đề tài chưa mở');
    });

    it('should reject when registration deadline has passed', () => {
      const afterRegistration = new Date('2026-09-20T10:00:00.000Z');
      const err = RegistrationGuardHelper.validateSemesterTimeline(semester, afterRegistration);
      expect(err).toContain('Cổng đăng ký đề tài đã kết thúc');
    });

    it('should reject when semester is not current', () => {
      const nonCurrentSemester = { ...semester, isCurrent: false };
      const err = RegistrationGuardHelper.validateSemesterTimeline(nonCurrentSemester);
      expect(err).toContain('isCurrent = false');
    });
  });

  describe('BR-02: validateAdvisorQuota', () => {
    it('should pass when advisor has remaining quota slots', () => {
      expect(RegistrationGuardHelper.validateAdvisorQuota(3, 5)).toBeNull();
      expect(RegistrationGuardHelper.validateAdvisorQuota(0, 5)).toBeNull();
    });

    it('should reject when advisor has reached maximum quota', () => {
      const err = RegistrationGuardHelper.validateAdvisorQuota(5, 5);
      expect(err).toContain('Giảng viên hướng dẫn đã nhận đủ chỉ tiêu');
    });

    it('should reject when advisor is overloaded', () => {
      const err = RegistrationGuardHelper.validateAdvisorQuota(6, 5);
      expect(err).toContain('Giảng viên hướng dẫn đã nhận đủ chỉ tiêu');
    });
  });

  describe('BR-04: validateTopicCapacity', () => {
    it('should pass when topic has available seats', () => {
      expect(RegistrationGuardHelper.validateTopicCapacity(0, 1)).toBeNull();
      expect(RegistrationGuardHelper.validateTopicCapacity(1, 2)).toBeNull();
    });

    it('should reject when topic is fully assigned', () => {
      const err = RegistrationGuardHelper.validateTopicCapacity(1, 1);
      expect(err).toContain('Đề tài đã đủ số lượng sinh viên tham gia');
    });
  });
});
