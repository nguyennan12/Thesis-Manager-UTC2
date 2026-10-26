'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { academicService } from '@/services/academic.service';
import { dashboardService } from '@/services/dashboard.service';
import { useAuthStore } from '@/stores/use-auth-store';
import { safeStorage } from '@/lib/storage';
import { UserWorkspaceRole } from '@/types/dashboard';

export function useDashboard() {
  const queryClient = useQueryClient();
  const storeUser = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const isDean = Boolean(
    storeUser?.positions?.includes('FACULTY_DEAN') ||
      storeUser?.positions?.includes('BAN_CHU_NHIEM') ||
      storeUser?.positions?.includes('DEAN'),
  );
  const isHod = Boolean(
    storeUser?.positions?.includes('HEAD_OF_DEPARTMENT') ||
      storeUser?.positions?.includes('TRUONG_BO_MON'),
  );
  const approvalStage = isDean ? 'DEAN' : isHod || storeUser?.roles?.includes('ADMIN') ? 'HOD' : 'NONE';

  // 1. Fetch thông tin tài khoản người dùng hiện tại
  const {
    data: user = storeUser,
    isLoading: isUserLoading,
  } = useQuery({
    queryKey: ['auth-me'],
    queryFn: async () => {
      try {
        const u = await authService.getMe();
        if (u) {
          const token = safeStorage.getItem('access_token') || '';
          setAuth(u, token);
        }
        return u;
      } catch {
        return null;
      }
    },
    initialData: storeUser || undefined,
    retry: false,
  });

  // 2. Xác định vai trò không gian làm việc
  let roleType: UserWorkspaceRole = 'STUDENT';
  if (
    user?.positions?.includes('TRUONG_BO_MON') ||
    user?.positions?.includes('HEAD_OF_DEPARTMENT') ||
    user?.positions?.includes('BAN_CHU_NHIEM') ||
    user?.positions?.includes('FACULTY_DEAN') ||
    user?.positions?.includes('DEAN') ||
    user?.positions?.includes('ACADEMIC_AFFAIRS') ||
    user?.roles?.includes('ADMIN') ||
    user?.roles?.includes('ACADEMIC_AFFAIRS') ||
    user?.roles?.includes('STAFF')
  ) {
    roleType = 'MANAGEMENT';
  } else if (user?.roles?.includes('LECTURER') || !!user?.lecturer) {
    roleType = 'LECTURER';
  }

  // 3. Fetch học kỳ hiện tại
  const { data: currentSemester = null, isLoading: isSemesterLoading } = useQuery({
    queryKey: ['academic-current-semester'],
    queryFn: () => academicService.getCurrentSemester(),
  });

  // 4. Fetch dữ liệu bàn làm việc đặc thù theo vai trò
  const {
    data: studentData,
    isLoading: isStudentLoading,
  } = useQuery({
    queryKey: ['student-workspace', currentSemester?.id],
    queryFn: () => dashboardService.getStudentWorkspace(currentSemester?.id),
    enabled: roleType === 'STUDENT',
  });

  const {
    data: lecturerData,
    isLoading: isLecturerLoading,
  } = useQuery({
    queryKey: ['lecturer-workspace', currentSemester?.id],
    queryFn: () => dashboardService.getLecturerWorkspace(currentSemester?.id),
    enabled: roleType === 'LECTURER',
  });

  const {
    data: managementData,
    isLoading: isManagementLoading,
  } = useQuery({
    queryKey: ['management-workspace', currentSemester?.id],
    queryFn: () => dashboardService.getManagementWorkspace(currentSemester?.id, approvalStage),
    enabled: roleType === 'MANAGEMENT',
  });

  // 5. Mutation thẩm định theo bước tương ứng với chức danh hiện tại.
  const approveMutation = useMutation({
    mutationFn: (topicId: string) => isDean
      ? dashboardService.approveDeanTopic(topicId)
      : dashboardService.approveTopic(topicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['management-workspace'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ topicId, reason }: { topicId: string; reason: string }) =>
      isDean
        ? dashboardService.rejectDeanTopic(topicId, reason)
        : dashboardService.rejectTopic(topicId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['management-workspace'] });
    },
  });

  const isLoading =
    isUserLoading ||
    isSemesterLoading ||
    (roleType === 'STUDENT' && isStudentLoading) ||
    (roleType === 'LECTURER' && isLecturerLoading) ||
    (roleType === 'MANAGEMENT' && isManagementLoading);

  return {
    user,
    roleType,
    currentSemester,
    studentData,
    lecturerData,
    managementData,
    isLoading,
    handleApproveTopic: async (id: string) => approveMutation.mutateAsync(id),
    handleRejectTopic: async (id: string, reason: string) =>
      rejectMutation.mutateAsync({ topicId: id, reason }),
    approvalStage,
  };
}
