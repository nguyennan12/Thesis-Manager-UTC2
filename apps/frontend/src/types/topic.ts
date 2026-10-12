export interface TopicItem {
  id: string;
  code: string;
  titleVi: string;
  titleEn?: string;
  description?: string;
  objectives?: string;
  expectedResults?: string;
  requiredSkills?: string;
  maxStudents: number;
  currentStudents?: number;
  status: 'DRAFT' | 'PENDING_HOD' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'ASSIGNED';
  rejectionReason?: string;
  departmentId?: string;
  departmentName?: string;
  semesterId?: string;
  supervisorId?: string;
  supervisorName?: string;
  supervisorEmail?: string;
  supervisorDegree?: string;
  reviewerId?: string;
  reviewerName?: string;
  createdAt?: string;
}

export interface CreateTopicInput {
  titleVi: string;
  titleEn?: string;
  description: string;
  objectives: string;
  expectedResults: string;
  requiredSkills?: string;
  maxStudents: number;
  departmentId?: string;
}

export interface ReviewTopicInput {
  status: 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
}
