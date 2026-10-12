import { apiClient } from '@/lib/api-client';
import { ProgressReportItem, CreateReportInput, ReviewReportInput } from '@/types/progress';

export const progressService = {
  getReportsByRegistrationId: async (regId: string): Promise<ProgressReportItem[]> => {
    try {
      const res = await apiClient.get<any>(`/progress/registrations/${regId}/reports`);
      const raw = res.data?.data || res.data || [];
      const list = Array.isArray(raw) ? raw : [];

      return list.map((r: any) => ({
        id: r.id,
        weekNumber: r.weekNumber,
        completedTasks: r.tasksCompleted || r.completedTasks || '',
        plannedTasks: r.nextWeekPlan || r.plannedTasks || '',
        difficulties: r.difficulties || '',
        attachmentUrl: r.attachmentUrl,
        submittedAt: r.reportDate
          ? new Date(r.reportDate).toLocaleDateString('vi-VN')
          : r.createdAt
          ? new Date(r.createdAt).toLocaleDateString('vi-VN')
          : 'Đã nộp',
        status:
          r.status === 'APPROVED' ||
          r.completionLevel === 'ĐẠT' ||
          r.completionLevel === 'TỐT' ||
          r.completionLevel === 'KHÁ' ||
          Boolean(r.advisorFeedback && r.advisorFeedback.trim().length > 0)
            ? 'APPROVED'
            : r.status === 'REJECTED'
            ? 'REJECTED'
            : 'PENDING',
        supervisorComment: r.advisorFeedback || r.supervisorComment || '',
        reviewedAt: r.reviewedAt ? new Date(r.reviewedAt).toLocaleDateString('vi-VN') : undefined,
      }));
    } catch {
      return [];
    }
  },

  createReport: async (input: CreateReportInput): Promise<ProgressReportItem> => {
    const res = await apiClient.post<any>('/progress/reports', {
      weekNumber: Number(input.weekNumber),
      tasksCompleted: input.completedTasks,
      nextWeekPlan: input.plannedTasks,
      attachmentUrl: input.attachmentUrl || undefined,
    });
    return res.data?.data || res.data;
  },

  reviewReport: async (reportId: string, input: ReviewReportInput): Promise<void> => {
    await apiClient.patch(`/progress/reports/${reportId}/review`, input);
  },
};
