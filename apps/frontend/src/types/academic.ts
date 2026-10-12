export interface SemesterDeadlines {
  topicRegistrationStart?: string;
  topicRegistrationEnd?: string;
  topicReviewDeadline?: string;
  midtermReportDeadline?: string;
  finalReportDeadline?: string;
  defenseStart?: string;
  defenseEnd?: string;
}

export interface CurrentSemester {
  id: string;
  code: string;
  name: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  deadlines?: SemesterDeadlines;
}
