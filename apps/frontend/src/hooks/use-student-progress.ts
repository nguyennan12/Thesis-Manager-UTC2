'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { registrationService } from '@/services/registration.service';
import { progressService } from '@/services/progress.service';
import { ProgressReportItem } from '@/types/progress';

export function useStudentProgress() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weekNumber, setWeekNumber] = useState(9);
  const [completedTasks, setCompletedTasks] = useState('');
  const [plannedTasks, setPlannedTasks] = useState('');
  const [difficulties, setDifficulties] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  // 1. Fetch thông tin đề tài của sinh viên
  const { data: myRegistration = null, isLoading: isRegLoading } = useQuery({
    queryKey: ['student-my-reg'],
    queryFn: () => registrationService.getMyRegistration(),
  });

  // 2. Fetch danh sách báo cáo tuần đã nộp từ backend
  const { data: reports = [], isLoading: isReportsLoading } = useQuery<ProgressReportItem[]>({
    queryKey: ['student-weekly-reports', myRegistration?.id],
    queryFn: () => progressService.getReportsByRegistrationId(myRegistration?.id || ''),
    enabled: !!myRegistration?.id,
  });

  // 3. Mutation nộp báo cáo tuần mới
  const submitMutation = useMutation({
    mutationFn: () =>
      progressService.createReport({
        registrationId: myRegistration?.id || '',
        weekNumber: Number(weekNumber),
        completedTasks,
        plannedTasks,
        difficulties,
        attachmentUrl,
      }),
    onSuccess: () => {
      setMessage('Nộp báo cáo tuần thành công! Giảng viên hướng dẫn sẽ nhận xét sớm.');
      setIsModalOpen(false);
      setCompletedTasks('');
      setPlannedTasks('');
      setDifficulties('');
      setAttachmentUrl('');
      queryClient.invalidateQueries({ queryKey: ['student-weekly-reports'] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Có lỗi xảy ra khi nộp báo cáo tuần.';
      setMessage(Array.isArray(msg) ? msg[0] : msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completedTasks.trim() || !plannedTasks.trim()) {
      alert('Vui lòng điền nội dung công việc đã hoàn thành và kế hoạch tuần tới.');
      return;
    }
    submitMutation.mutate();
  };

  return {
    myRegistration,
    reports,
    isModalOpen,
    setIsModalOpen,
    weekNumber,
    setWeekNumber,
    completedTasks,
    setCompletedTasks,
    plannedTasks,
    setPlannedTasks,
    difficulties,
    setDifficulties,
    attachmentUrl,
    setAttachmentUrl,
    message,
    setMessage,
    isLoading: isRegLoading || isReportsLoading,
    isSubmitting: submitMutation.isPending,
    handleSubmit,
  };
}
