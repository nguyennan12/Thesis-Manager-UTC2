'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { topicService } from '@/services/topic.service';
import { registrationService } from '@/services/registration.service';
import { TopicItem } from '@/types/topic';

export function useStudentTopics() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // 1. Fetch danh sách đề tài mở từ Backend
  const { data: topics = [], isLoading: isTopicsLoading } = useQuery<TopicItem[]>({
    queryKey: ['student-available-topics'],
    queryFn: () => topicService.getTopics({ status: 'APPROVED' }),
  });

  // 2. Fetch thông tin đăng ký hiện tại của sinh viên
  const { data: myRegistration = null, isLoading: isRegLoading } = useQuery({
    queryKey: ['student-my-reg'],
    queryFn: () => registrationService.getMyRegistration(),
  });

  // 3. Mutation Đăng ký đề tài
  const regMutation = useMutation({
    mutationFn: (topicId: string) => registrationService.registerTopic(topicId),
    onSuccess: () => {
      setMessage('Đăng ký đề tài thành công! Chờ Giảng viên hướng dẫn xác nhận.');
      queryClient.invalidateQueries({ queryKey: ['student-my-reg'] });
      queryClient.invalidateQueries({ queryKey: ['student-available-topics'] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Không thể đăng ký đề tài này. Vui lòng thử lại sau.';
      setMessage(Array.isArray(msg) ? msg[0] : msg);
    },
    onSettled: () => {
      setRegisteringId(null);
    },
  });

  const handleRegister = (topicId: string) => {
    if (myRegistration) {
      alert('Bạn đã có đề tài được ghi nhận trong học kỳ này.');
      return;
    }
    if (window.confirm('Bạn có chắc chắn muốn đăng ký tham gia đề tài này không?')) {
      setRegisteringId(topicId);
      regMutation.mutate(topicId);
    }
  };

  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      const matchSearch =
        t.titleVi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.supervisorName && t.supervisorName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchDept =
        selectedDept === 'ALL' ||
        (t.departmentName && t.departmentName.toLowerCase().includes(selectedDept.toLowerCase()));
      return matchSearch && matchDept;
    });
  }, [topics, searchTerm, selectedDept]);

  return {
    topics,
    filteredTopics,
    myRegistration,
    searchTerm,
    setSearchTerm,
    selectedDept,
    setSelectedDept,
    registeringId,
    message,
    setMessage,
    isLoading: isTopicsLoading || isRegLoading,
    isSubmitting: regMutation.isPending,
    handleRegister,
  };
}
