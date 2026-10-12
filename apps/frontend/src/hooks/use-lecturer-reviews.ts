'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { councilService } from '@/services/council.service';
import { ReviewAssignmentItem } from '@/types/council';

export function useLecturerReviews() {
  const queryClient = useQueryClient();
  const [selectedReview, setSelectedReview] = useState<ReviewAssignmentItem | null>(null);
  const [score, setScore] = useState<number>(8.5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  // 1. Fetch danh sách phân công phản biện từ backend
  const { data: reviews = [], isLoading } = useQuery<ReviewAssignmentItem[]>({
    queryKey: ['lecturer-reviews'],
    queryFn: () => councilService.getReviewAssignments(),
  });

  // 2. Mutation nhập điểm phản biện
  const scoreMutation = useMutation({
    mutationFn: () =>
      councilService.scoreReviewer(selectedReview?.registrationId || '', {
        score: Number(score),
        comment,
      }),
    onSuccess: () => {
      setMessage(`Đã cập nhật điểm phản biện cho đề tài ${selectedReview?.topicCode} thành công!`);
      setSelectedReview(null);
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['lecturer-reviews'] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Có lỗi xảy ra khi lưu điểm phản biện.';
      setMessage(Array.isArray(msg) ? msg[0] : msg);
    },
  });

  const handleOpenScoreModal = (rev: ReviewAssignmentItem) => {
    setSelectedReview(rev);
    setScore(rev.score ?? 8.5);
    setComment(rev.comment ?? '');
  };

  const handleSaveScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (score < 0 || score > 10) {
      alert('Điểm số phải từ 0 đến 10.');
      return;
    }
    if (!comment.trim()) {
      alert('Vui lòng nhập nhận xét đánh giá của Giảng viên phản biện.');
      return;
    }
    scoreMutation.mutate();
  };

  return {
    reviews,
    selectedReview,
    setSelectedReview,
    score,
    setScore,
    comment,
    setComment,
    message,
    setMessage,
    isLoading,
    isSubmitting: scoreMutation.isPending,
    handleOpenScoreModal,
    handleSaveScore,
  };
}
