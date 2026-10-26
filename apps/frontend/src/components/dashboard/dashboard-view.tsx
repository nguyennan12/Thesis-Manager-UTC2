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
    approvalStage,
  } = useDashboard();

  const canReviewTopics = Boolean(
    user?.roles?.includes('ADMIN') ||
      user?.positions?.includes('HEAD_OF_DEPARTMENT') ||
      user?.positions?.includes('TRUONG_BO_MON') ||
      user?.positions?.includes('FACULTY_DEAN') ||
      user?.positions?.includes('BAN_CHU_NHIEM'),
  );
  const isAcademicAffairs = Boolean(
    user?.positions?.includes('ACADEMIC_AFFAIRS') || user?.roles?.includes('STAFF'),
  );
  const isFacultyDean = Boolean(
    user?.positions?.includes('FACULTY_DEAN') || user?.positions?.includes('BAN_CHU_NHIEM'),
  );
  const roleNotice = isAcademicAffairs
    ? 'Giáo vụ không duyệt nội dung đề tài. Nhiệm vụ chính là điều phối đăng ký, thành lập hội đồng, xếp lịch bảo vệ và tổng hợp/công bố kết quả.'
    : isFacultyDean
    ? 'Trưởng Khoa theo dõi và điều phối công việc ở phạm vi toàn khoa, xử lý quyết định cấp khoa và ngoại lệ. Trưởng Bộ môn chịu trách nhiệm thẩm định chuyên môn đề tài của bộ môn.'
    : undefined;

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
          canReviewTopics={canReviewTopics}
          approvalStage={approvalStage}
          roleNotice={roleNotice}
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
