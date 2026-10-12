import { apiClient } from '@/lib/api-client';

export interface MyRegistrationData {
  id: string;
  topicId: string;
  topicCode: string;
  topicTitle: string;
  supervisorName: string;
  supervisorEmail: string;
  supervisorDegree: string;
  departmentName: string;
  status: string;
  registeredAt: string;
  currentWeek: number;
  totalWeeks: number;
  scoreProcess?: number;
  scoreReviewer?: number;
  scoreCouncilAvg?: number;
  scoreFinal?: number;
  gradeScale4?: number;
  gradeLetter?: string;
}

export const registrationService = {
  getMyRegistration: async (): Promise<MyRegistrationData | null> => {
    try {
      const res = await apiClient.get<any>('/registrations/my-registration');
      const data = res.data?.data || res.data;
      if (!data || !data.id) return null;

      return {
        id: data.id,
        topicId: data.topic?.id || data.topicId,
        topicCode: data.topic?.code || data.code || 'DT-KLTN',
        topicTitle: data.topic?.titleVi || data.topic?.titleEn || 'Đồ án tốt nghiệp',
        supervisorName: data.advisorLecturer?.fullName || 'Chưa phân công',
        supervisorEmail: data.advisorLecturer?.email || '',
        supervisorDegree: data.advisorLecturer?.degree || 'Giảng viên',
        departmentName: data.topic?.department?.name || data.advisorLecturer?.department?.name || 'Khoa CNTT',
        status: data.status,
        registeredAt: data.createdAt ? new Date(data.createdAt).toLocaleDateString('vi-VN') : '',
        currentWeek: data.currentWeek || 15,
        totalWeeks: 15,
        scoreProcess: data.scoreProcess !== null && data.scoreProcess !== undefined ? Number(data.scoreProcess) : undefined,
        scoreReviewer: data.scoreReviewer !== null && data.scoreReviewer !== undefined ? Number(data.scoreReviewer) : undefined,
        scoreCouncilAvg: data.scoreCouncilAvg !== null && data.scoreCouncilAvg !== undefined ? Number(data.scoreCouncilAvg) : undefined,
        scoreFinal: data.scoreFinal !== null && data.scoreFinal !== undefined ? Number(data.scoreFinal) : undefined,
        gradeScale4: data.gradeScale4 !== null && data.gradeScale4 !== undefined ? Number(data.gradeScale4) : undefined,
        gradeLetter: data.gradeLetter || undefined,
      };
    } catch {
      return null;
    }
  },

  registerTopic: async (topicId: string): Promise<void> => {
    await apiClient.post('/registrations', { topicId });
  },

  getAllRegistrations: async (params?: { semesterId?: string; status?: string; limit?: number }): Promise<any[]> => {
    try {
      const res = await apiClient.get<any>('/registrations', { params });
      const raw = res.data?.data?.items || res.data?.data || res.data?.items || (res.data as unknown as any[]) || [];
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  },
};
