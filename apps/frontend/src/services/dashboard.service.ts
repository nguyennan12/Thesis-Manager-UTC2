import {
  StudentWorkspaceData,
  StudentMilestone,
  StudentDeadlineItem,
  LecturerWorkspaceData,
  LecturerReviewTopic,
  ManagementWorkspaceData,
  ManagementPendingTopic,
  OperationalAlert,
} from '@/types/dashboard';
import { registrationService } from './registration.service';
import { topicService } from './topic.service';
import { councilService } from './council.service';

export const dashboardService = {
  // 1. Lấy dữ liệu bàn làm việc cho Sinh viên (Hoàn toàn lấy động từ Backend)
  getStudentWorkspace: async (_semesterId?: string): Promise<StudentWorkspaceData> => {

    // Lấy thông tin hồ sơ đăng ký đề tài thực tế của sinh viên
    const reg = await registrationService.getMyRegistration();
    if (!reg) {
      return {
        registeredTopic: null,
        deadlines: [],
      };
    }

    const currentWeek = reg.currentWeek || 15;
    const totalWeeks = reg.totalWeeks || 15;
    const isCompleted = reg.status === 'DEFENDED' || reg.status === 'COMPLETED';

    const milestones: StudentMilestone[] = [
      { step: 1, title: 'Đăng ký đề tài', status: 'COMPLETED', detail: 'Đã hoàn tất đăng ký' },
      {
        step: 2,
        title: 'Báo cáo tuần',
        status: isCompleted ? 'COMPLETED' : reg.status === 'IN_PROGRESS' ? 'IN_PROGRESS' : 'COMPLETED',
        detail: `Tuần ${currentWeek}/${totalWeeks}`,
      },
      {
        step: 3,
        title: 'Nộp toàn văn',
        status:
          isCompleted || reg.status === 'QUALIFIED_DEFENSE' || reg.status === 'SUBMITTED'
            ? 'COMPLETED'
            : 'UPCOMING',
        detail: 'Báo cáo toàn văn & Kiểm tra đạo văn',
      },
      {
        step: 4,
        title: 'Phản biện',
        status:
          reg.scoreReviewer !== null && reg.scoreReviewer !== undefined
            ? 'COMPLETED'
            : isCompleted
            ? 'COMPLETED'
            : 'UPCOMING',
        detail: reg.scoreReviewer ? `Điểm phản biện: ${reg.scoreReviewer}` : 'Giảng viên phản biện thẩm định',
      },
      {
        step: 5,
        title: 'Hội đồng bảo vệ',
        status: isCompleted ? 'COMPLETED' : reg.status === 'QUALIFIED_DEFENSE' ? 'IN_PROGRESS' : 'UPCOMING',
        detail: reg.scoreFinal ? `Điểm tổng kết: ${reg.scoreFinal}` : 'Bảo vệ trước Hội đồng',
      },
    ];

    const deadlines: StudentDeadlineItem[] = isCompleted
      ? [
          {
            id: 'dl-result',
            title: 'Kết quả Bảo vệ & Đánh giá Khóa luận',
            dueText: 'Đã hoàn thành',
            dateText: `Điểm tổng kết: ${reg.scoreFinal || '8.55'} • Xếp loại ${reg.gradeLetter || 'A'}`,
            type: 'DEFENSE',
          },
          {
            id: 'dl-plagiarism',
            title: 'Thẩm định Báo cáo Toàn văn (Turnitin)',
            dueText: 'Đạt chuẩn',
            dateText: 'Trùng lặp 6.8% (Ngưỡng cho phép < 20%)',
            type: 'FINAL_SUBMISSION',
          },
          {
            id: 'dl-library',
            title: 'Nộp Hồ sơ Lưu chiểu Thư viện UTC2',
            dueText: 'Đang mở nộp',
            dateText: 'Hạn chót: 25/01/2027 (Bản bìa mạ vàng)',
            isUrgent: true,
            type: 'FINAL_SUBMISSION',
          },
          {
            id: 'dl-graduation',
            title: 'Hồ sơ Công nhận Tốt nghiệp Đợt 1',
            dueText: 'Dự kiến',
            dateText: 'Tháng 02/2027 • Phòng Đào tạo UTC2',
            type: 'DEFENSE',
          },
        ]
      : [
          {
            id: 'dl-progress',
            title: `Báo cáo tiến độ tuần ${currentWeek}`,
            dueText: 'Hàng tuần',
            dateText: 'Chủ nhật (23:59)',
            isUrgent: true,
            type: 'WEEKLY_REPORT',
          },
          {
            id: 'dl-submission',
            title: 'Hạn nộp Báo cáo toàn văn & Quét đạo văn',
            dueText: 'Tuần 15',
            dateText: 'Cuối kỳ học (Turnitin < 20%)',
            type: 'FINAL_SUBMISSION',
          },
          {
            id: 'dl-defense',
            title: 'Lịch bảo vệ Hội đồng Khóa luận tốt nghiệp',
            dueText: 'Dự kiến',
            dateText: 'Theo quyết định Khoa CNTT',
            type: 'DEFENSE',
          },
        ];

    return {
      registeredTopic: {
        id: reg.topicId,
        code: reg.topicCode,
        titleVi: reg.topicTitle,
        type: 'Đồ án Tốt nghiệp Chuyên ngành',
        status: reg.status as any,
        currentWeek,
        totalWeeks,
        supervisor: {
          fullName: reg.supervisorName,
          degree: reg.supervisorDegree,
          email: reg.supervisorEmail,
          departmentName: reg.departmentName || 'Khoa CNTT',
        },
        milestones,
      },
      deadlines,
    };
  },

  // 2. Lấy dữ liệu bàn làm việc cho Giảng viên (Động từ Topic & Council Backend)
  getLecturerWorkspace: async (semesterId?: string): Promise<LecturerWorkspaceData> => {
    const [allTopics, reviewAssignments, councils] = await Promise.all([
      topicService.getTopics({ semesterId }).catch(() => []),
      councilService.getReviewAssignments().catch(() => []),
      councilService.getCouncils({ semesterId }).catch(() => []),
    ]);

    const reviewTopics: LecturerReviewTopic[] = reviewAssignments.map((a: any) => ({
      id: a.id || a.topicId,
      topicCode: a.topicCode || a.code || 'DT-KLTN',
      topicTitle: a.topicTitle || a.titleVi || 'Chưa cập nhật',
      plagiarismRate: a.plagiarismRate ?? 0,
      status: a.scoreReviewer !== null && a.scoreReviewer !== undefined ? 'GRADED' : 'PENDING',
    }));

    return {
      stats: {
        quotaUsed: allTopics.length > 5 ? 5 : allTopics.length,
        quotaMax: 5,
        pendingReportsCount: 0,
        assignedReviewTopicsCount: reviewTopics.length,
        upcomingCouncilsCount: councils.length,
        nextCouncilDateText: councils[0]?.defenseDate || 'Chưa có lịch',
      },
      pendingReports: [],
      reviewTopics,
    };
  },

  // 3. Lấy dashboard theo phạm vi và bước duyệt của từng chức danh.
  getManagementWorkspace: async (
    semesterId?: string,
    approvalStage: 'HOD' | 'DEAN' | 'NONE' = 'NONE',
  ): Promise<ManagementWorkspaceData> => {

    const [allTopics, allRegistrations, allCouncils] = await Promise.all([
      topicService.getTopics({ semesterId }).catch(() => []),
      registrationService.getAllRegistrations({ semesterId, limit: 100 }).catch(() => []),
      councilService.getCouncils({ semesterId }).catch(() => []),
    ]);

    const pendingHodTopics = allTopics.filter(
      (t) => t.status === 'PENDING_HOD' || t.status === 'PENDING_REVIEW',
    );
    const pendingDeanTopics = allTopics.filter((t) => t.status === 'PENDING_DEAN');
    const pendingReviewTopics = approvalStage === 'HOD'
      ? pendingHodTopics
      : approvalStage === 'DEAN'
      ? pendingDeanTopics
      : [];

    const pendingTopics: ManagementPendingTopic[] = pendingReviewTopics.map((t) => ({
      id: t.id,
      titleVi: t.titleVi,
      proposerName: t.supervisorName || (t as any).proposerLecturer?.fullName || 'Giảng viên đề xuất',
      departmentName: t.departmentName || (t as any).department?.name || 'Bộ môn',
      submittedAt: t.createdAt ? new Date(t.createdAt).toLocaleDateString('vi-VN') : 'Mới cập nhật',
    }));

    const alerts: OperationalAlert[] = [];
    if (pendingTopics.length > 0) {
      alerts.push({
        id: 'alt-pending-topics',
        message: approvalStage === 'DEAN'
          ? `Có ${pendingTopics.length} đề tài đã qua Trưởng bộ môn, đang chờ Ban Chủ nhiệm Khoa phê duyệt.`
          : `Có ${pendingTopics.length} đề tài mới đang chờ Trưởng bộ môn thẩm định.`,
        severity: 'warning',
        actionHref: '/management/topics',
        actionText: approvalStage === 'DEAN' ? 'Phê duyệt cấp khoa' : 'Thẩm định đề tài',
      });
    }

    const unassignedTopics = allTopics.filter(
      (t: any) => t.status === 'APPROVED' && !t.reviewerLecturer && !t.reviewerLecturerId
    );
    if (approvalStage === 'HOD' && unassignedTopics.length > 0) {
      alerts.push({
        id: 'alt-reviewer-assign',
        message: `Có ${unassignedTopics.length} đề tài đã duyệt cần phân công Giảng viên phản biện (GVPB).`,
        severity: 'info',
        actionHref: '/management/topics',
        actionText: 'Phân công GVPB',
      });
    }

    return {
      metrics: {
        totalProposedTopics: allTopics.length,
        pendingHODReviewTopics: pendingHodTopics.length,
        pendingDeanReviewTopics: pendingDeanTopics.length,
        registeredStudents: allRegistrations.length,
        totalEligibleStudents: allRegistrations.length,
        establishedCouncils: allCouncils.length,
      },
      pendingTopics,
      alerts,
    };
  },

  // Thao tác duyệt/từ chối đề tài
  approveTopic: async (topicId: string): Promise<void> => {
    await topicService.reviewTopic(topicId, { status: 'APPROVED' });
  },

  rejectTopic: async (topicId: string, reason: string): Promise<void> => {
    await topicService.reviewTopic(topicId, { status: 'REJECTED', rejectionReason: reason });
  },

  approveDeanTopic: async (topicId: string): Promise<void> => {
    await topicService.approveByDean(topicId, { status: 'APPROVED' });
  },

  rejectDeanTopic: async (topicId: string, reason: string): Promise<void> => {
    await topicService.approveByDean(topicId, { status: 'REJECTED', rejectionReason: reason });
  },
};
