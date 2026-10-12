'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { changeRequestService, ChangeRequestType, ChangeRequestItem } from '@/services/change-request.service';
import { registrationService } from '@/services/registration.service';

export function useChangeRequests() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestType, setRequestType] = useState<ChangeRequestType>('CHANGE_TITLE');
  const [reason, setReason] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  // 1. Fetch đề tài hiện tại của sinh viên
  const { data: myRegistration = null } = useQuery({
    queryKey: ['student-my-reg'],
    queryFn: () => registrationService.getMyRegistration(),
  });

  // 2. Fetch danh sách đơn đã nộp
  const { data: requests = [], isLoading } = useQuery<ChangeRequestItem[]>({
    queryKey: ['student-change-requests'],
    queryFn: () => changeRequestService.getMyChangeRequests(),
  });

  // 3. Mutation tạo đơn mới
  const createMutation = useMutation({
    mutationFn: () =>
      changeRequestService.createChangeRequest({
        type: requestType,
        reason,
        requestedData: { newTitle },
      }),
    onSuccess: () => {
      setMessage('Nộp đơn xin điều chỉnh thành công! Hồ sơ đã gửi đến Trưởng bộ môn & GVHD.');
      setIsModalOpen(false);
      setReason('');
      setNewTitle('');
      queryClient.invalidateQueries({ queryKey: ['student-change-requests'] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Có lỗi xảy ra khi nộp đơn.';
      setMessage(Array.isArray(msg) ? msg[0] : msg);
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Vui lòng nhập lý do xin thay đổi đề tài/giảng viên.');
      return;
    }
    createMutation.mutate();
  };

  return {
    myRegistration,
    requests,
    isModalOpen,
    setIsModalOpen,
    requestType,
    setRequestType,
    reason,
    setReason,
    newTitle,
    setNewTitle,
    message,
    setMessage,
    isLoading,
    isSubmitting: createMutation.isPending,
    handleCreate,
  };
}
