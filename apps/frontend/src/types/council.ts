export interface CouncilMember {
  id: string;
  lecturerName: string;
  lecturerCode: string;
  role: 'PRESIDENT' | 'SECRETARY' | 'MEMBER' | 'REVIEWER';
  departmentName?: string;
}

export interface CouncilStudent {
  registrationId: string;
  studentName: string;
  studentCode: string;
  topicTitle: string;
  supervisorName: string;
  defenseTime?: string;
  processGrade?: number;
  reviewerGrade?: number;
  councilGrade?: number;
  finalGrade?: number;
  status?: string;
}

export interface CouncilItem {
  id: string;
  code: string;
  name: string;
  defenseDate: string;
  location: string;
  status: 'ESTABLISHED' | 'COMPLETED' | 'CANCELLED';
  members: CouncilMember[];
  students: CouncilStudent[];
}

export interface ReviewAssignmentItem {
  id: string;
  registrationId: string;
  topicCode: string;
  topicTitle: string;
  studentName: string;
  studentCode: string;
  supervisorName: string;
  plagiarismRate?: number;
  score?: number;
  comment?: string;
  submittedAt?: string;
  status: 'PENDING' | 'GRADED';
}

export interface ScoreReviewerInput {
  score: number;
  comment: string;
}
