'use client';

import { useQuery } from '@tanstack/react-query';
import { registrationService } from '@/services/registration.service';
import { evaluationService } from '@/services/evaluation.service';

export interface RubricCriterion {
  id: string;
  criterion: string;
  weight: string;
  maxScore: number;
  actualScore: number | null;
  note: string;
}

export function useStudentGrades() {
  const { data: myRegistration = null, isLoading: isRegLoading } = useQuery({
    queryKey: ['student-my-reg'],
    queryFn: () => registrationService.getMyRegistration(),
  });

  const { data: activeRubric = null, isLoading: isRubricLoading } = useQuery({
    queryKey: ['active-rubric-grades'],
    queryFn: () => evaluationService.getActiveRubric('MAJOR', '2025-2026'),
  });

  const processGrade =
    myRegistration?.scoreProcess !== null && myRegistration?.scoreProcess !== undefined
      ? Number(myRegistration.scoreProcess)
      : null;

  const reviewerGrade =
    myRegistration?.scoreReviewer !== null && myRegistration?.scoreReviewer !== undefined
      ? Number(myRegistration.scoreReviewer)
      : null;

  const councilGrade =
    myRegistration?.scoreCouncilAvg !== null && myRegistration?.scoreCouncilAvg !== undefined
      ? Number(myRegistration.scoreCouncilAvg)
      : null;

  const finalGrade =
    processGrade !== null && reviewerGrade !== null && councilGrade !== null
      ? (processGrade * 0.3 + reviewerGrade * 0.2 + councilGrade * 0.5).toFixed(2)
      : myRegistration?.scoreFinal
      ? Number(myRegistration.scoreFinal).toFixed(2)
      : null;

  const status =
    finalGrade !== null
      ? Number(finalGrade) >= 5.0
        ? 'ĐỦ ĐIỀU KIỆN TỐT NGHIỆP'
        : 'CHƯA ĐẠT'
      : 'ĐANG ĐÁNH GIÁ';

  const rubrics: RubricCriterion[] =
    activeRubric?.criteria && Array.isArray(activeRubric.criteria)
      ? activeRubric.criteria.map((c: any) => ({
          id: c.id,
          criterion: c.name,
          weight: `${Number(c.weight).toFixed(0)}%`,
          maxScore: 10,
          actualScore: councilGrade !== null ? councilGrade : null,
          note: c.description || 'Đánh giá theo chuẩn Rubric bảo vệ UTC2',
        }))
      : [];

  return {
    myRegistration,
    processGrade,
    reviewerGrade,
    councilGrade,
    finalGrade,
    status,
    rubrics,
    isLoading: isRegLoading || isRubricLoading,
  };
}
