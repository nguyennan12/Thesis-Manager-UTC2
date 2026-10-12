import { CurrentSemester } from './academic';
import { UserProfile } from './auth';

export type UserWorkspaceRole = 'STUDENT' | 'LECTURER' | 'MANAGEMENT';

// ----------------------------------------------------
// SINH VIÊN WORKSPACE TYPES
// ----------------------------------------------------
export interface StudentMilestone {
  step: number;
  title: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING';
  detail?: string;
}

export interface StudentRegisteredTopic {
  id: string;
  code: string;
  titleVi: string;
  type: string;
  status: 'REGISTERED' | 'IN_PROGRESS' | 'QUALIFIED_DEFENSE' | 'COMPLETED';
  currentWeek: number;
  totalWeeks: number;
  supervisor: {
    fullName: string;
    degree?: string;
    email: string;
    departmentName: string;
  };
  milestones: StudentMilestone[];
}

export interface StudentDeadlineItem {
  id: string;
  title: string;
  dueText: string;
  dateText: string;
  isUrgent?: boolean;
  type: 'WEEKLY_REPORT' | 'FINAL_SUBMISSION' | 'DEFENSE';
}

export interface StudentWorkspaceData {
  registeredTopic: StudentRegisteredTopic | null;
  deadlines: StudentDeadlineItem[];
}

// ----------------------------------------------------
// GIẢNG VIÊN WORKSPACE TYPES
// ----------------------------------------------------
export interface LecturerStats {
  quotaUsed: number;
  quotaMax: number;
  pendingReportsCount: number;
  assignedReviewTopicsCount: number;
  upcomingCouncilsCount: number;
  nextCouncilDateText: string;
}

export interface LecturerPendingReport {
  id: string;
  studentName: string;
  studentCode: string;
  topicTitle: string;
  weekNumber: number;
  submittedAt: string;
  status: 'PENDING_REVIEW' | 'REVIEWED';
}

export interface LecturerReviewTopic {
  id: string;
  topicCode: string;
  topicTitle: string;
  plagiarismRate: number; // Tỷ lệ đạo văn %
  status: 'PENDING' | 'GRADED';
}

export interface LecturerWorkspaceData {
  stats: LecturerStats;
  pendingReports: LecturerPendingReport[];
  reviewTopics: LecturerReviewTopic[];
}

// ----------------------------------------------------
// BAN CHỦ NHIỆM / TRƯỞNG BỘ MÔN / GIÁO VỤ TYPES
// ----------------------------------------------------
export interface ManagementMetrics {
  totalProposedTopics: number;
  pendingHODReviewTopics: number;
  registeredStudents: number;
  totalEligibleStudents: number;
  establishedCouncils: number;
}

export interface ManagementPendingTopic {
  id: string;
  titleVi: string;
  proposerName: string;
  departmentName: string;
  submittedAt: string;
}

export interface OperationalAlert {
  id: string;
  message: string;
  severity: 'warning' | 'danger' | 'info';
  actionHref?: string;
  actionText?: string;
}

export interface ManagementWorkspaceData {
  metrics: ManagementMetrics;
  pendingTopics: ManagementPendingTopic[];
  alerts: OperationalAlert[];
}

// ----------------------------------------------------
// MAIN DASHBOARD RESPONSE
// ----------------------------------------------------
export interface DashboardData {
  user: UserProfile;
  roleType: UserWorkspaceRole;
  currentSemester: CurrentSemester | null;
  studentData?: StudentWorkspaceData;
  lecturerData?: LecturerWorkspaceData;
  managementData?: ManagementWorkspaceData;
}
