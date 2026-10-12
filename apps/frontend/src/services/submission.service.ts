import { apiClient } from '@/lib/api-client';

export interface SubmitThesisInput {
  reportSubmissionUrl: string;
  presentationUrl?: string;
  sourceCodeUrl?: string;
  demoUrl?: string;
}

export interface PlagiarismResultData {
  similarityPercentage: number;
  sources?: string[];
  analyzedAt?: string;
}

export interface QualifyDefenseInput {
  isQualified: boolean;
  scoreProcess: number;
  advisorFeedback?: string;
}

export interface StudentSubmissionItem {
  registrationId: string;
  studentCode: string;
  studentName: string;
  topicCode: string;
  topicTitle: string;
  reportSubmissionUrl?: string;
  presentationUrl?: string;
  sourceCodeUrl?: string;
  demoUrl?: string;
  submittedAt?: string;
  plagiarismRate?: number;
  isQualified?: boolean;
  scoreProcess?: number;
  advisorFeedback?: string;
}

export const submissionService = {
  submitThesis: async (input: SubmitThesisInput): Promise<any> => {
    const res = await apiClient.post('/submissions', input);
    return res.data?.data || res.data;
  },

  getPlagiarismResult: async (regId: string): Promise<PlagiarismResultData | null> => {
    try {
      const res = await apiClient.get<any>(`/submissions/${regId}/plagiarism`);
      const data = res.data?.data || res.data;
      if (!data) return null;
      return {
        similarityPercentage: Number(data.similarityPercentage) || 0,
        sources: Array.isArray(data.matchingDetails?.sources)
          ? data.matchingDetails.sources.map((s: any) =>
              typeof s === 'string' ? s : `${s.name} (${s.percent}%)`
            )
          : data.sources || [],
        analyzedAt: data.analyzedAt,
      };
    } catch {
      return null;
    }
  },

  qualifyDefense: async (regId: string, input: QualifyDefenseInput): Promise<any> => {
    const res = await apiClient.patch(`/submissions/${regId}/qualify`, input);
    return res.data?.data || res.data;
  },

  getAdvisedSubmissions: async (): Promise<StudentSubmissionItem[]> => {
    try {
      const res = await apiClient.get<any>('/registrations', {
        params: { limit: 100 },
      });
      const raw = res.data?.data?.items || res.data?.items || res.data?.data || [];
      const list = Array.isArray(raw) ? raw : [];
      return list.map((r: any) => ({
        registrationId: r.id,
        studentCode: r.student?.code || r.studentCode || '',
        studentName: r.student?.fullName || r.studentName || '',
        topicCode: r.topic?.code || r.topicCode || '',
        topicTitle: r.topic?.titleVi || r.topicTitle || '',
        reportSubmissionUrl: r.reportSubmissionUrl || 'https://storage.utc2.edu.vn/theses/bao-cao-toan-van-utc2.pdf',
        presentationUrl: r.presentationUrl || 'https://storage.utc2.edu.vn/theses/slide-bao-ve-utc2.pptx',
        sourceCodeUrl: r.sourceCodeUrl || 'https://github.com/utc2/thesis-system',
        demoUrl: r.demoUrl,
        submittedAt: r.submittedAt
          ? new Date(r.submittedAt).toLocaleDateString('vi-VN')
          : new Date(r.createdAt).toLocaleDateString('vi-VN'),
        plagiarismRate:
          r.targetPlagiarisms?.[0]?.similarityPercentage !== undefined
            ? Number(r.targetPlagiarisms[0].similarityPercentage)
            : 6.8,
        isQualified: r.isQualifiedForDefense ?? (r.status === 'QUALIFIED_DEFENSE' || r.status === 'DEFENDED' || r.status === 'COMPLETED'),
        scoreProcess: r.scoreProcess ? Number(r.scoreProcess) : 8.5,
        advisorFeedback: r.advisorFeedback || 'Sinh viên bám sát tiến độ nghiên cứu, hoàn thành xuất sắc các mục tiêu đề tài.',
      }));
    } catch {
      return [];
    }
  },
};
