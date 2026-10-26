'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { topicService } from '@/services/topic.service';
import { councilService } from '@/services/council.service';
import { TopicItem } from '@/types/topic';

export interface DepartmentLecturer {
  id: string;
  code: string;
  fullName: string;
  email: string;
  departmentName?: string;
}

export function useManagementTopics(
  approvalStage: 'HOD' | 'DEAN' | 'ADMIN',
  enabled = true,
) {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // State cho Modal Phân công Giảng viên phản biện (GVPB)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedTopicForReviewer, setSelectedTopicForReviewer] = useState<TopicItem | null>(null);
  const [selectedReviewerId, setSelectedReviewerId] = useState<string>('');

  // Fetch danh sách Giảng viên trực tiếp từ Backend (Seed tại DB, không seed ở FE)
  const { data: departmentLecturers = [] } = useQuery<DepartmentLecturer[]>({
    queryKey: ['department-lecturers'],
    queryFn: () => councilService.getLecturers(),
    enabled,
  });

  // 1. Fetch toàn bộ đề tài từ Backend
  const { data: topics = [], isLoading } = useQuery<TopicItem[]>({
    queryKey: ['management-topics'],
    queryFn: () => topicService.getTopics(),
    enabled,
  });

  // 2. Mutation Thẩm định Phê duyệt Đề tài
  const reviewMutation = useMutation({
    mutationFn: ({ topicId, status, rejectionReason, currentStatus }: {
      topicId: string;
      status: 'APPROVED' | 'REJECTED';
      rejectionReason?: string;
      currentStatus: string;
    }) => currentStatus === 'PENDING_DEAN'
      ? topicService.approveByDean(topicId, { status, rejectionReason })
      : topicService.reviewTopic(topicId, { status, rejectionReason }),
    onSuccess: (_, vars) => {
      setMessage(`Đã ${vars.status === 'APPROVED' ? 'phê duyệt' : 'từ chối'} đề tài thành công!`);
      queryClient.invalidateQueries({ queryKey: ['management-topics'] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Có lỗi xảy ra khi thẩm định đề tài.';
      setMessage(Array.isArray(msg) ? msg[0] : msg);
    },
    onSettled: () => {
      setProcessingId(null);
    },
  });

  // 3. Mutation Phân công Giảng viên phản biện (GVPB - BR-C1)
  const assignReviewerMutation = useMutation({
    mutationFn: ({ topicId, reviewerLecturerId }: { topicId: string; reviewerLecturerId: string }) =>
      councilService.assignReviewer({ topicId, reviewerLecturerId }),
    onSuccess: () => {
      setMessage('Phân công Giảng viên phản biện (GVPB) cho đề tài thành công!');
      setIsAssignModalOpen(false);
      setSelectedTopicForReviewer(null);
      queryClient.invalidateQueries({ queryKey: ['management-topics'] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Có lỗi xảy ra khi phân công Giảng viên phản biện.';
      setMessage(Array.isArray(msg) ? msg[0] : msg);
    },
  });

  const handleApprove = (topicId: string, currentStatus: string) => {
    if (window.confirm('Bạn có chắc chắn muốn phê duyệt đề tài này để công bố cho sinh viên không?')) {
      setProcessingId(topicId);
      reviewMutation.mutate({ topicId, status: 'APPROVED', currentStatus });
    }
  };

  const handleReject = (topicId: string, currentStatus: string) => {
    const reason = window.prompt('Nhập lý do yêu cầu giảng viên chỉnh sửa lại đề tài:');
    if (!reason) return;
    setProcessingId(topicId);
    reviewMutation.mutate({ topicId, status: 'REJECTED', rejectionReason: reason, currentStatus });
  };

  const handleOpenAssignReviewerModal = (topic: TopicItem) => {
    setSelectedTopicForReviewer(topic);
    // Chọn giảng viên đầu tiên không phải là GVHD của đề tài này (Check BR-C1)
    const validLecturer = departmentLecturers.find((l) => l.fullName !== topic.supervisorName);
    setSelectedReviewerId(validLecturer ? validLecturer.id : (departmentLecturers[0]?.id || ''));
    setIsAssignModalOpen(true);
  };

  const handleAssignReviewerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTopicForReviewer || !selectedReviewerId) {
      alert('Vui lòng chọn giảng viên phản biện.');
      return;
    }
    assignReviewerMutation.mutate({
      topicId: selectedTopicForReviewer.id,
      reviewerLecturerId: selectedReviewerId,
    });
  };

  const filteredTopics = useMemo(() => {
    const pendingStatus = approvalStage === 'DEAN' ? 'PENDING_DEAN' : 'PENDING_REVIEW';
    const stageTopics = approvalStage === 'ADMIN'
      ? topics
      : topics.filter((t) => t.status === pendingStatus || t.status === 'APPROVED' || t.status === 'ASSIGNED');
    if (filterStatus === 'ALL') return stageTopics;
    if (filterStatus === 'PENDING_HOD' || filterStatus === 'PENDING_REVIEW') {
      return stageTopics.filter((t) =>
        t.status === pendingStatus ||
        (approvalStage === 'ADMIN' && (t.status === 'PENDING_REVIEW' || t.status === 'PENDING_DEAN')),
      );
    }
    if (filterStatus === 'PENDING_DEAN') {
      return stageTopics.filter((t) => t.status === 'PENDING_DEAN');
    }
    if (filterStatus === 'APPROVED') {
      return topics.filter((t) => t.status === 'APPROVED' || t.status === 'ASSIGNED');
    }
    return topics.filter((t) => t.status === filterStatus);
  }, [topics, filterStatus, approvalStage]);

  const pendingStatus = approvalStage === 'DEAN' ? 'PENDING_DEAN' : 'PENDING_REVIEW';
  const pendingCount = topics.filter((t) =>
    t.status === pendingStatus || (approvalStage === 'ADMIN' && t.status === 'PENDING_DEAN'),
  ).length;
  const approvedCount = topics.filter((t) => t.status === 'APPROVED' || t.status === 'ASSIGNED').length;

  return {
    topics,
    filteredTopics,
    filterStatus,
    setFilterStatus,
    pendingCount,
    approvedCount,
    processingId,
    message,
    setMessage,
    isLoading,
    isSubmitting: reviewMutation.isPending || assignReviewerMutation.isPending,
    isAssignModalOpen,
    setIsAssignModalOpen,
    selectedTopicForReviewer,
    selectedReviewerId,
    setSelectedReviewerId,
    departmentLecturers,
    handleApprove,
    handleReject,
    approvalStage,
    canAssignReviewer: approvalStage !== 'DEAN',
    handleOpenAssignReviewerModal,
    handleAssignReviewerSubmit,
  };
}
