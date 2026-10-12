'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { topicService } from '@/services/topic.service';
import { TopicItem } from '@/types/topic';

export function useLecturerTopics() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [titleVi, setTitleVi] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [description, setDescription] = useState('');
  const [objectives, setObjectives] = useState('');
  const [expectedResults, setExpectedResults] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [maxStudents, setMaxStudents] = useState(2);
  const [message, setMessage] = useState<string | null>(null);

  // 1. Fetch danh sách đề tài của giảng viên
  const { data: topics = [], isLoading } = useQuery<TopicItem[]>({
    queryKey: ['lecturer-my-topics'],
    queryFn: () => topicService.getTopics(),
  });

  // 2. Mutation tạo đề xuất đề tài mới
  const createMutation = useMutation({
    mutationFn: () =>
      topicService.createTopic({
        titleVi,
        titleEn,
        description,
        objectives,
        expectedResults,
        requiredSkills,
        maxStudents: Number(maxStudents),
      }),
    onSuccess: () => {
      setMessage('Đề xuất đề tài mới thành công! Hồ sơ đã gửi đến Trưởng Bộ môn thẩm định.');
      setIsModalOpen(false);
      setTitleVi('');
      setTitleEn('');
      setDescription('');
      setObjectives('');
      setExpectedResults('');
      setRequiredSkills('');
      queryClient.invalidateQueries({ queryKey: ['lecturer-my-topics'] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Có lỗi xảy ra khi tạo đề tài.';
      setMessage(Array.isArray(msg) ? msg[0] : msg);
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleVi.trim() || !description.trim() || !objectives.trim()) {
      alert('Vui lòng điền đầy đủ các thông tin bắt buộc (*).');
      return;
    }
    createMutation.mutate();
  };

  return {
    topics,
    isModalOpen,
    setIsModalOpen,
    titleVi,
    setTitleVi,
    titleEn,
    setTitleEn,
    description,
    setDescription,
    objectives,
    setObjectives,
    expectedResults,
    setExpectedResults,
    requiredSkills,
    setRequiredSkills,
    maxStudents,
    setMaxStudents,
    message,
    setMessage,
    isLoading,
    isSubmitting: createMutation.isPending,
    handleCreate,
  };
}
