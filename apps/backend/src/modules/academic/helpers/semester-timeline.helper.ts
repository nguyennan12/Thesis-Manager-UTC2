// ==============================================================================
// SEMESTER TIMELINE HELPER (Strict Business Validation for 7 Defense Milestones)
// ==============================================================================

export interface SemesterDatesInput {
  startDate: string | Date;
  endDate: string | Date;
  topicRegistrationStart?: string | Date | null;
  topicRegistrationEnd?: string | Date | null;
  executionStart?: string | Date | null;
  executionEnd?: string | Date | null;
  thesisSubmissionEnd?: string | Date | null;
  defenseStart?: string | Date | null;
  defenseEnd?: string | Date | null;
}

export class SemesterTimelineHelper {
  /**
   * Kiểm tra tính hợp lệ và thứ tự thời gian tuần tự của các mốc đồ án
   * Quy tắc chuỗi bất đẳng thức:
   * 1. startDate < endDate
   * 2. topicRegistrationStart < topicRegistrationEnd <= executionStart (nếu có đủ)
   * 3. executionStart < executionEnd <= thesisSubmissionEnd < defenseStart <= defenseEnd (nếu có đủ)
   * 4. startDate <= executionStart (nếu có)
   * 5. defenseEnd <= endDate (nếu có)
   */
  static validate(input: SemesterDatesInput): string[] {
    const errors: string[] = [];

    const start = new Date(input.startDate);
    const end = new Date(input.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      errors.push('Ngày bắt đầu hoặc ngày kết thúc học kỳ không hợp lệ.');
      return errors;
    }

    if (start >= end) {
      errors.push('Ngày kết thúc học kỳ (endDate) phải diễn ra sau ngày bắt đầu (startDate).');
    }

    const regStart = input.topicRegistrationStart ? new Date(input.topicRegistrationStart) : null;
    const regEnd = input.topicRegistrationEnd ? new Date(input.topicRegistrationEnd) : null;
    const execStart = input.executionStart ? new Date(input.executionStart) : null;
    const execEnd = input.executionEnd ? new Date(input.executionEnd) : null;
    const subEnd = input.thesisSubmissionEnd ? new Date(input.thesisSubmissionEnd) : null;
    const defStart = input.defenseStart ? new Date(input.defenseStart) : null;
    const defEnd = input.defenseEnd ? new Date(input.defenseEnd) : null;

    if (regStart && regEnd && regStart >= regEnd) {
      errors.push('Thời hạn đóng đăng ký đề tài (topicRegistrationEnd) phải sau thời điểm mở đăng ký (topicRegistrationStart).');
    }

    if (regEnd && execStart && regEnd > execStart) {
      errors.push('Thời điểm bắt đầu thực hiện đồ án (executionStart) phải sau hoặc trùng với ngày đóng đăng ký đề tài.');
    }

    if (execStart && execEnd && execStart >= execEnd) {
      errors.push('Thời điểm kết thúc thực hiện đồ án (executionEnd) phải sau ngày bắt đầu thực hiện.');
    }

    if (execEnd && subEnd && execEnd > subEnd) {
      errors.push('Hạn nộp báo cáo toàn văn (thesisSubmissionEnd) phải sau hoặc trùng với thời điểm kết thúc làm đồ án.');
    }

    if (subEnd && defStart && subEnd >= defStart) {
      errors.push('Ngày bắt đầu bảo vệ đồ án (defenseStart) phải sau hạn nộp báo cáo toàn văn để có thời gian phản biện.');
    }

    if (defStart && defEnd && defStart > defEnd) {
      errors.push('Ngày kết thúc bảo vệ (defenseEnd) phải sau hoặc trùng với ngày bắt đầu bảo vệ (defenseStart).');
    }

    if (execStart && start > execStart) {
      errors.push('Thời điểm bắt đầu thực hiện đồ án (executionStart) không được diễn ra trước ngày khai giảng học kỳ (startDate).');
    }

    if (defEnd && defEnd > end) {
      errors.push('Ngày kết thúc bảo vệ đồ án (defenseEnd) không được vượt quá ngày kết thúc học kỳ (endDate).');
    }

    return errors;
  }
}
