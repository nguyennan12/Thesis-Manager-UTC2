'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { councilService } from '@/services/council.service';
import { topicService } from '@/services/topic.service';
import { registrationService } from '@/services/registration.service';
import { CouncilItem } from '@/types/council';

export function useManagementCouncils() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<string | null>(null);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [targetCouncil, setTargetCouncil] = useState<CouncilItem | null>(null);

  // Form thành lập Hội đồng
  const [councilCode, setCouncilCode] = useState('HD-CNPM-02');
  const [councilName, setCouncilName] = useState('Hội đồng Chấm KLTN Bộ môn CNPM số 2');
  const [defenseDate, setDefenseDate] = useState('2026-06-25');
  const [defenseRoom, setDefenseRoom] = useState('Phòng C103');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('11:30');

  // Form phân công sinh viên
  const [selectedRegIds, setSelectedRegIds] = useState<string[]>([]);

  // Giảng viên được chọn cho Hội đồng
  const [chairmanId, setChairmanId] = useState('');
  const [secretaryId, setSecretaryId] = useState('');
  const [memberId, setMemberId] = useState('');

  // 1. Fetch danh sách Hội đồng từ Backend
  const { data: councils = [], isLoading } = useQuery<CouncilItem[]>({
    queryKey: ['management-councils'],
    queryFn: () => councilService.getCouncils(),
  });

  // 2. Fetch danh sách giảng viên để lập Hội đồng
  const { data: lecturers = [] } = useQuery({
    queryKey: ['management-lecturers-for-councils'],
    queryFn: () => councilService.getLecturers(),
  });

  // 3. Fetch danh sách sinh viên đăng ký đề tài
  const { data: registrations = [] } = useQuery({
    queryKey: ['management-registrations-for-councils'],
    queryFn: () => registrationService.getAllRegistrations({ limit: 100 }),
  });

  // 4. Fetch danh sách đề tài
  const { data: topics = [] } = useQuery({
    queryKey: ['management-topics-for-councils'],
    queryFn: () => topicService.getTopics(),
  });

  // 5. Mutation tạo Hội đồng
  const createMutation = useMutation({
    mutationFn: (dto: any) => councilService.createCouncil(dto),
    onSuccess: () => {
      setMessage('Thành lập Hội đồng bảo vệ đồ án tốt nghiệp thành công!');
      setIsCreateModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['management-councils'] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Có lỗi xảy ra khi thành lập Hội đồng.';
      setMessage(Array.isArray(msg) ? msg[0] : msg);
    },
  });

  // 6. Mutation phân công sinh viên vào Hội đồng
  const assignMutation = useMutation({
    mutationFn: ({ councilId, regIds }: { councilId: string; regIds: string[] }) =>
      councilService.assignStudents(councilId, regIds),
    onSuccess: () => {
      setMessage('Phân công sinh viên vào Hội đồng bảo vệ thành công!');
      setIsAssignModalOpen(false);
      setSelectedRegIds([]);
      queryClient.invalidateQueries({ queryKey: ['management-councils'] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Có lỗi xảy ra khi phân công sinh viên.';
      setMessage(Array.isArray(msg) ? msg[0] : msg);
    },
  });

  const handleOpenAssignModal = (council: CouncilItem) => {
    setTargetCouncil(council);
    setIsAssignModalOpen(true);
  };

  const handleCreateCouncil = (e: React.FormEvent) => {
    e.preventDefault();
    const finalChairman = chairmanId || lecturers[0]?.id;
    const finalSecretary = secretaryId || lecturers[1]?.id;
    const finalMember = memberId || lecturers[2]?.id;

    if (!finalChairman || !finalSecretary || !finalMember) {
      alert('Vui lòng chọn đủ 3 giảng viên (Chủ tịch, Thư ký, Ủy viên).');
      return;
    }
    if (new Set([finalChairman, finalSecretary, finalMember]).size < 3) {
      alert('Các thành viên hội đồng phải là 3 giảng viên khác nhau.');
      return;
    }

    const deptId = lecturers.find((l: any) => l.id === finalChairman)?.departmentId || '00000000-0000-0000-0000-000000000001';

    createMutation.mutate({
      code: councilCode,
      name: councilName,
      departmentId: deptId,
      defenseDate,
      defenseRoom,
      startTime,
      endTime,
      members: [
        { lecturerId: finalChairman, role: 'CHAIRMAN' },
        { lecturerId: finalSecretary, role: 'SECRETARY' },
        { lecturerId: finalMember, role: 'MEMBER' },
      ],
    });
  };

  const handleAssignStudents = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCouncil || selectedRegIds.length === 0) {
      alert('Vui lòng chọn ít nhất 1 sinh viên để phân công.');
      return;
    }
    assignMutation.mutate({
      councilId: targetCouncil.id,
      regIds: selectedRegIds,
    });
  };

  return {
    councils,
    topics,
    lecturers,
    registrations,
    message,
    setMessage,
    isLoading,
    isSubmitting: createMutation.isPending || assignMutation.isPending,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isAssignModalOpen,
    setIsAssignModalOpen,
    targetCouncil,
    councilCode,
    setCouncilCode,
    councilName,
    setCouncilName,
    defenseDate,
    setDefenseDate,
    defenseRoom,
    setDefenseRoom,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    chairmanId: chairmanId || (lecturers[0]?.id ?? ''),
    setChairmanId,
    secretaryId: secretaryId || (lecturers[1]?.id ?? ''),
    setSecretaryId,
    memberId: memberId || (lecturers[2]?.id ?? ''),
    setMemberId,
    selectedRegIds,
    setSelectedRegIds,
    handleOpenAssignModal,
    handleCreateCouncil,
    handleAssignStudents,
  };
}
