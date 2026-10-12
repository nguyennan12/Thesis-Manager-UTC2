'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { submissionService, StudentSubmissionItem } from '@/services/submission.service';

export function useLecturerQualify() {
  const queryClient = useQueryClient();
  const [selectedStudent, setSelectedStudent] = useState<StudentSubmissionItem | null>(null);
  const [isQualified, setIsQualified] = useState<boolean>(true);
  const [scoreProcess, setScoreProcess] = useState<number>(8.5);
  const [advisorFeedback, setAdvisorFeedback] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);

  // 1. Fetch danh sách sinh viên đang hướng dẫn
  const { data: submissions = [], isLoading } = useQuery<StudentSubmissionItem[]>({
    queryKey: ['lecturer-submissions'],
    queryFn: () => submissionService.getAdvisedSubmissions(),
  });

  // 2. Mutation chốt điều kiện bảo vệ & điểm quá trình
  const qualifyMutation = useMutation({
    mutationFn: () =>
      submissionService.qualifyDefense(selectedStudent?.registrationId || '', {
        isQualified,
        scoreProcess: Number(scoreProcess),
        advisorFeedback,
      }),
    onSuccess: () => {
      setMessage(`Đã cập nhật xét duyệt điều kiện bảo vệ cho sinh viên ${selectedStudent?.studentName} thành công!`);
      setSelectedStudent(null);
      setAdvisorFeedback('');
      queryClient.invalidateQueries({ queryKey: ['lecturer-submissions'] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Có lỗi xảy ra khi xét điều kiện bảo vệ.';
      setMessage(Array.isArray(msg) ? msg[0] : msg);
    },
  });

  const handleOpenModal = (sub: StudentSubmissionItem) => {
    setSelectedStudent(sub);
    setIsQualified(sub.isQualified ?? true);
    setScoreProcess(sub.scoreProcess ?? 8.5);
    setAdvisorFeedback(sub.advisorFeedback ?? 'Sinh viên tích cực hoàn thành tốt các mục tiêu đề tài.');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (scoreProcess < 0 || scoreProcess > 10) {
      alert('Điểm quá trình phải từ 0 đến 10.');
      return;
    }
    qualifyMutation.mutate();
  };

  return {
    submissions,
    selectedStudent,
    setSelectedStudent,
    isQualified,
    setIsQualified,
    scoreProcess,
    setScoreProcess,
    advisorFeedback,
    setAdvisorFeedback,
    message,
    setMessage,
    isLoading,
    isSubmitting: qualifyMutation.isPending,
    handleOpenModal,
    handleSave,
  };
}
