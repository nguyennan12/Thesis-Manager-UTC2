import { apiClient } from '@/lib/api-client';

export interface CriterionScoreItem {
  criterionId: string;
  criterionName?: string;
  weight?: string;
  score: number;
  notes?: string;
}

export interface SubmitScoresInput {
  registrationId: string;
  scores: CriterionScoreItem[];
}

export const evaluationService = {
  submitScores: async (input: SubmitScoresInput): Promise<any> => {
    const res = await apiClient.post('/evaluation/scores', input);
    return res.data?.data || res.data;
  },

  calculateFinalGrade: async (regId: string): Promise<any> => {
    const res = await apiClient.post(`/evaluation/${regId}/calculate-final`);
    return res.data?.data || res.data;
  },

  getActiveRubric: async (topicType: string = 'MAJOR', academicYear: string = '2025-2026'): Promise<any> => {
    try {
      const res = await apiClient.get('/grading/rubrics/active', {
        params: { topicType, academicYear },
      });
      return res.data?.data || res.data;
    } catch {
      return null;
    }
  },
};
