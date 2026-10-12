export interface ProgressReportItem {
  id: string;
  weekNumber: number;
  startDate?: string;
  endDate?: string;
  completedTasks: string;
  plannedTasks: string;
  difficulties?: string;
  attachmentUrl?: string;
  submittedAt?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_SUBMITTED';
  supervisorComment?: string;
  reviewedAt?: string;
}

export interface CreateReportInput {
  registrationId: string;
  weekNumber: number;
  completedTasks: string;
  plannedTasks: string;
  difficulties?: string;
  attachmentUrl?: string;
}

export interface ReviewReportInput {
  status: 'APPROVED' | 'REJECTED';
  supervisorComment: string;
}
