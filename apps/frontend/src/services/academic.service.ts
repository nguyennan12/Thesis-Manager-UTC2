import { apiClient } from '@/lib/api-client';
import { CurrentSemester } from '@/types/academic';

export const academicService = {
  getCurrentSemester: async (): Promise<CurrentSemester | null> => {
    try {
      const res = await apiClient.get<{ data: CurrentSemester }>('/academic/semesters/current');
      return res.data?.data || (res.data as unknown as CurrentSemester);
    } catch (error) {
      // Fallback fallback metadata if no active semester configured in DB yet
      return {
        id: 'sem-current',
        code: '2026_2027_HK1',
        name: 'Học kỳ 1',
        academicYear: '2026-2027',
        startDate: '2026-09-01',
        endDate: '2027-01-15',
        isCurrent: true,
      };
    }
  },
};
