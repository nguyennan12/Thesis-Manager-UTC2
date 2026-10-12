import { apiClient } from '@/lib/api-client';
import { TopicItem, CreateTopicInput, ReviewTopicInput } from '@/types/topic';

export const topicService = {
  getTopics: async (params?: { semesterId?: string; status?: string; departmentId?: string; limit?: number; search?: string }): Promise<TopicItem[]> => {
    try {
      const res = await apiClient.get<any>('/topics', { params: { limit: 100, ...params } });
      const raw = res.data?.data?.items || res.data?.items || res.data?.data || res.data || [];
      const list = Array.isArray(raw) ? raw : [];

      return list.map((t: any) => ({
        id: t.id,
        code: t.code,
        titleVi: t.titleVi,
        titleEn: t.titleEn,
        description: t.description,
        objectives: t.objectives,
        expectedResults: t.expectedResults,
        requiredSkills: t.requirements || t.requiredSkills,
        maxStudents: t.maxStudents || 1,
        currentStudents: t._count?.registrations || t.currentStudents || 0,
        status: t.status,
        rejectionReason: t.rejectionReason,
        departmentId: t.departmentId,
        departmentName: t.department?.name || t.departmentName || 'Bộ môn',
        semesterId: t.semesterId,
        supervisorId: t.proposerLecturerId,
        supervisorName: t.proposerLecturer?.fullName || t.supervisorName || 'Giảng viên đề xuất',
        supervisorEmail: t.proposerLecturer?.email || t.supervisorEmail,
        supervisorDegree: t.proposerLecturer?.degree || t.supervisorDegree,
        reviewerId: t.reviewerLecturerId,
        reviewerName: t.reviewerLecturer?.fullName || t.reviewerName,
        createdAt: t.createdAt,
      }));
    } catch {
      return [];
    }
  },

  getTopicById: async (id: string): Promise<TopicItem | null> => {
    try {
      const res = await apiClient.get<any>(`/topics/${id}`);
      const t = res.data?.data || res.data;
      if (!t || !t.id) return null;

      return {
        id: t.id,
        code: t.code,
        titleVi: t.titleVi,
        titleEn: t.titleEn,
        description: t.description,
        objectives: t.objectives,
        expectedResults: t.expectedResults,
        requiredSkills: t.requirements || t.requiredSkills,
        maxStudents: t.maxStudents || 1,
        currentStudents: t._count?.registrations || t.currentStudents || 0,
        status: t.status,
        rejectionReason: t.rejectionReason,
        departmentId: t.departmentId,
        departmentName: t.department?.name || t.departmentName || 'Bộ môn',
        semesterId: t.semesterId,
        supervisorId: t.proposerLecturerId,
        supervisorName: t.proposerLecturer?.fullName || t.supervisorName || 'Giảng viên đề xuất',
        supervisorEmail: t.proposerLecturer?.email || t.supervisorEmail,
        supervisorDegree: t.proposerLecturer?.degree || t.supervisorDegree,
        createdAt: t.createdAt,
      };
    } catch {
      return null;
    }
  },

  createTopic: async (input: CreateTopicInput): Promise<TopicItem> => {
    const res = await apiClient.post<{ data: TopicItem }>('/topics', input);
    return res.data?.data || (res.data as unknown as TopicItem);
  },

  reviewTopic: async (id: string, input: ReviewTopicInput): Promise<void> => {
    await apiClient.patch(`/topics/${id}/review`, input);
  },
};
