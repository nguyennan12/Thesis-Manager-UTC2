'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { councilService } from '@/services/council.service';
import { evaluationService, CriterionScoreItem } from '@/services/evaluation.service';
import { CouncilItem, CouncilStudent } from '@/types/council';

export function useCouncilEvaluate() {
  const queryClient = useQueryClient();
  const [selectedStudent, setSelectedStudent] = useState<CouncilStudent | null>(null);
  const [scores, setScores] = useState<CriterionScoreItem[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  // 1. Fetch bộ tiêu chí Rubric đang áp dụng (Active) từ Backend
  const { data: activeRubric = null } = useQuery({
    queryKey: ['active-rubric-major'],
    queryFn: () => evaluationService.getActiveRubric('MAJOR', '2025-2026'),
  });

  // Khi Backend trả về criteria từ CSDL PostgreSQL, gán danh sách tiêu chí động
  useEffect(() => {
    if (activeRubric?.criteria && Array.isArray(activeRubric.criteria) && activeRubric.criteria.length > 0) {
      setScores(
        activeRubric.criteria.map((c: any) => ({
          criterionId: c.id,
          criterionName: c.name,
          weight: `${Number(c.weight).toFixed(0)}%`,
          score: 8.5,
          notes: '',
        })),
      );
    }
  }, [activeRubric]);

  // 2. Fetch danh sách hội đồng
  const { data: councils = [], isLoading } = useQuery<CouncilItem[]>({
    queryKey: ['lecturer-councils'],
    queryFn: () => councilService.getCouncils(),
  });

  const allStudents: CouncilStudent[] = councils.flatMap((c) => c.students || []);

  // 2. Mutation gửi phiếu chấm điểm Rubric
  const submitScoreMutation = useMutation({
    mutationFn: () =>
      evaluationService.submitScores({
        registrationId: selectedStudent?.registrationId || '',
        scores: scores.map((s) => ({
          criterionId: s.criterionId,
          score: Number(s.score),
          notes: s.notes,
        })),
      }),
    onSuccess: () => {
      setMessage(`Đã lưu phiếu điểm đánh giá cho sinh viên ${selectedStudent?.studentName} thành công!`);
      setSelectedStudent(null);
      queryClient.invalidateQueries({ queryKey: ['lecturer-councils'] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Có lỗi xảy ra khi lưu phiếu điểm.';
      setMessage(Array.isArray(msg) ? msg[0] : msg);
    },
  });

  // 3. Mutation chốt tính điểm tổng kết (30% GVHD + 20% GVPB + 50% Hội đồng)
  const calculateFinalMutation = useMutation({
    mutationFn: (regId: string) => evaluationService.calculateFinalGrade(regId),
    onSuccess: () => {
      setMessage('Đã tổng hợp điểm tổng kết và quy đổi điểm chữ UTC2 thành công!');
      queryClient.invalidateQueries({ queryKey: ['lecturer-councils'] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Có lỗi xảy ra khi tính điểm tổng kết.';
      setMessage(Array.isArray(msg) ? msg[0] : msg);
    },
  });

  const handleOpenScoreModal = (student: CouncilStudent) => {
    setSelectedStudent(student);
  };

  const handleScoreChange = (index: number, newScore: number) => {
    setScores((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], score: newScore };
      return updated;
    });
  };

  const handleNotesChange = (index: number, newNotes: string) => {
    setScores((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], notes: newNotes };
      return updated;
    });
  };

  const handleSaveScores = (e: React.FormEvent) => {
    e.preventDefault();
    submitScoreMutation.mutate();
  };

  const handleCalculateFinal = (regId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn chốt điểm tổng kết cho sinh viên này không?')) {
      calculateFinalMutation.mutate(regId);
    }
  };

  return {
    councils,
    allStudents,
    selectedStudent,
    setSelectedStudent,
    scores,
    message,
    setMessage,
    isLoading,
    isSubmitting: submitScoreMutation.isPending || calculateFinalMutation.isPending,
    handleOpenScoreModal,
    handleScoreChange,
    handleNotesChange,
    handleSaveScores,
    handleCalculateFinal,
  };
}
