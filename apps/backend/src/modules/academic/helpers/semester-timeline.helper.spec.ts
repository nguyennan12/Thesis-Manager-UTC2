import { describe, it, expect } from 'vitest';
import { SemesterTimelineHelper, SemesterDatesInput } from './semester-timeline.helper';

describe('SemesterTimelineHelper', () => {
  it('should return no errors for valid sequential timeline', () => {
    const validTimeline: SemesterDatesInput = {
      startDate: '2026-09-01T00:00:00.000Z',
      endDate: '2027-01-31T23:59:59.000Z',
      topicRegistrationStart: '2026-09-05T00:00:00.000Z',
      topicRegistrationEnd: '2026-09-20T23:59:59.000Z',
      executionStart: '2026-09-21T00:00:00.000Z',
      executionEnd: '2026-12-15T23:59:59.000Z',
      thesisSubmissionEnd: '2026-12-20T23:59:59.000Z',
      defenseStart: '2026-12-28T00:00:00.000Z',
      defenseEnd: '2027-01-10T23:59:59.000Z',
    };

    const errors = SemesterTimelineHelper.validate(validTimeline);
    expect(errors).toHaveLength(0);
  });

  it('should detect invalid date format', () => {
    const invalidTimeline: SemesterDatesInput = {
      startDate: 'invalid-date',
      endDate: '2027-01-31',
    };

    const errors = SemesterTimelineHelper.validate(invalidTimeline);
    expect(errors).toContain('Ngày bắt đầu hoặc ngày kết thúc học kỳ không hợp lệ.');
  });

  it('should detect when endDate is before startDate', () => {
    const invalidTimeline: SemesterDatesInput = {
      startDate: '2027-01-31T00:00:00.000Z',
      endDate: '2026-09-01T00:00:00.000Z',
    };

    const errors = SemesterTimelineHelper.validate(invalidTimeline);
    expect(errors).toContain('Ngày kết thúc học kỳ (endDate) phải diễn ra sau ngày bắt đầu (startDate).');
  });

  it('should detect registration end before registration start', () => {
    const invalidTimeline: SemesterDatesInput = {
      startDate: '2026-09-01T00:00:00.000Z',
      endDate: '2027-01-31T23:59:59.000Z',
      topicRegistrationStart: '2026-09-20T00:00:00.000Z',
      topicRegistrationEnd: '2026-09-10T00:00:00.000Z',
    };

    const errors = SemesterTimelineHelper.validate(invalidTimeline);
    expect(errors).toContain('Thời hạn đóng đăng ký đề tài (topicRegistrationEnd) phải sau thời điểm mở đăng ký (topicRegistrationStart).');
  });

  it('should detect execution start before registration end', () => {
    const invalidTimeline: SemesterDatesInput = {
      startDate: '2026-09-01T00:00:00.000Z',
      endDate: '2027-01-31T23:59:59.000Z',
      topicRegistrationStart: '2026-09-05T00:00:00.000Z',
      topicRegistrationEnd: '2026-09-20T23:59:59.000Z',
      executionStart: '2026-09-15T00:00:00.000Z', // Before regEnd
    };

    const errors = SemesterTimelineHelper.validate(invalidTimeline);
    expect(errors).toContain('Thời điểm bắt đầu thực hiện đồ án (executionStart) phải sau hoặc trùng với ngày đóng đăng ký đề tài.');
  });

  it('should detect defense start before submission end', () => {
    const invalidTimeline: SemesterDatesInput = {
      startDate: '2026-09-01T00:00:00.000Z',
      endDate: '2027-01-31T23:59:59.000Z',
      executionStart: '2026-09-21T00:00:00.000Z',
      executionEnd: '2026-12-15T23:59:59.000Z',
      thesisSubmissionEnd: '2026-12-25T23:59:59.000Z',
      defenseStart: '2026-12-20T00:00:00.000Z', // Before subEnd
    };

    const errors = SemesterTimelineHelper.validate(invalidTimeline);
    expect(errors).toContain('Ngày bắt đầu bảo vệ đồ án (defenseStart) phải sau hạn nộp báo cáo toàn văn để có thời gian phản biện.');
  });

  it('should detect defense end after semester end', () => {
    const invalidTimeline: SemesterDatesInput = {
      startDate: '2026-09-01T00:00:00.000Z',
      endDate: '2027-01-15T23:59:59.000Z',
      defenseStart: '2027-01-10T00:00:00.000Z',
      defenseEnd: '2027-01-20T23:59:59.000Z', // Exceeds endDate
    };

    const errors = SemesterTimelineHelper.validate(invalidTimeline);
    expect(errors).toContain('Ngày kết thúc bảo vệ đồ án (defenseEnd) không được vượt quá ngày kết thúc học kỳ (endDate).');
  });
});
