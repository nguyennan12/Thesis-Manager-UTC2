import { apiClient } from '@/lib/api-client';
import { CouncilItem, ReviewAssignmentItem, ScoreReviewerInput } from '@/types/council';

export const councilService = {
  getCouncils: async (params?: { semesterId?: string }): Promise<CouncilItem[]> => {
    try {
      const res = await apiClient.get<any>('/councils', { params: { limit: 50, ...params } });
      const raw = res.data?.data?.items || res.data?.items || res.data?.data || res.data || [];
      const list = Array.isArray(raw) ? raw : [];

      return list.map((c: any) => ({
        id: c.id,
        code: c.code,
        name: c.name,
        defenseDate: c.defenseDate ? new Date(c.defenseDate).toLocaleDateString('vi-VN') : 'Chưa có lịch',
        location: c.defenseRoom || 'Chưa xếp phòng',
        status: c.status || 'ESTABLISHED',
        members: Array.isArray(c.members)
          ? c.members.map((m: any) => ({
              id: m.id,
              lecturerName: m.lecturer?.fullName || 'Giảng viên',
              lecturerCode: m.lecturer?.code || '',
              role: m.role,
              departmentName: m.lecturer?.department?.name || '',
            }))
          : [],
        students: Array.isArray(c.registrations)
          ? c.registrations.map((r: any) => ({
              registrationId: r.id,
              studentName: r.student?.fullName || 'Sinh viên',
              studentCode: r.student?.code || '',
              topicTitle: r.topic?.titleVi || 'Đồ án tốt nghiệp',
              supervisorName: r.advisorLecturer?.fullName || 'GVHD',
              defenseTime: `${c.startTime || '08:00'} - ${c.endTime || '11:30'}`,
              processGrade: r.scoreProcess ? Number(r.scoreProcess) : undefined,
              reviewerGrade: r.scoreReviewer ? Number(r.scoreReviewer) : undefined,
              councilGrade: r.scoreCouncilAvg ? Number(r.scoreCouncilAvg) : undefined,
              finalGrade: r.scoreFinal ? Number(r.scoreFinal) : undefined,
              status: r.status,
            }))
          : [],
      }));
    } catch {
      return [];
    }
  },

  getReviewAssignments: async (): Promise<ReviewAssignmentItem[]> => {
    try {
      const res = await apiClient.get<{ data: ReviewAssignmentItem[] }>('/reviewers/my-assignments');
      const raw = res.data?.data || (res.data as unknown as ReviewAssignmentItem[]) || [];
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  },

  scoreReviewer: async (regId: string, input: ScoreReviewerInput): Promise<void> => {
    await apiClient.patch(`/reviewers/${regId}/score`, input);
  },

  assignReviewer: async (dto: { topicId: string; reviewerLecturerId: string }): Promise<void> => {
    await apiClient.post('/reviewers/assign', dto);
  },

  createCouncil: async (dto: any): Promise<any> => {
    const res = await apiClient.post('/councils', dto);
    return res.data?.data || res.data;
  },

  assignStudents: async (councilId: string, registrationIds: string[]): Promise<any> => {
    const res = await apiClient.post(`/councils/${councilId}/assign-students`, { registrationIds });
    return res.data?.data || res.data;
  },

  getLecturers: async (params?: { departmentId?: string; search?: string }): Promise<any[]> => {
    try {
      const res = await apiClient.get('/lecturers', { params });
      const raw = res.data?.data?.items || res.data?.data || res.data || [];
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  },
};
