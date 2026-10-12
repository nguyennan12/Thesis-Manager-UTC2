'use client';

import React from 'react';
import { useDashboard } from '@/hooks/use-dashboard';
import { WelcomeBanner } from '@/components/dashboard/welcome-banner';
import { StudentWorkspace } from '@/components/dashboard/student-workspace';
import { LecturerWorkspace } from '@/components/dashboard/lecturer-workspace';
import { ManagementWorkspace } from '@/components/dashboard/management-workspace';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';
import { EmptyState } from '@/components/feedback/empty-state';

export const DashboardView: React.FC = () => {
  const {
    user,
    roleType,
    currentSemester,
    studentData,
    lecturerData,
    managementData,
    isLoading,
    handleApproveTopic,
    handleRejectTopic,
  } = useDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Chào Mừng Cá Nhân Hóa (Welcome Banner) */}
      <WelcomeBanner user={user} currentSemester={currentSemester} />

      {/* 2. Bàn Làm Việc Thông Minh Tự Thích Ứng Theo Vai Trò */}
      {roleType === 'STUDENT' && studentData ? (
        <StudentWorkspace data={studentData} />
      ) : roleType === 'LECTURER' && lecturerData ? (
        <LecturerWorkspace data={lecturerData} />
      ) : roleType === 'MANAGEMENT' && managementData ? (
        <ManagementWorkspace
          data={managementData}
          onApproveTopic={handleApproveTopic}
          onRejectTopic={handleRejectTopic}
        />
      ) : (
        <EmptyState
          title="Chưa có dữ liệu bàn làm việc"
          description="Hệ thống đang chuẩn bị dữ liệu và lịch trình học thuật cho học kỳ hiện tại."
        />
      )}
    </div>
  );
};
