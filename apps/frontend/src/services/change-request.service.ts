import { apiClient } from '@/lib/api-client';

export type ChangeRequestType = 'CHANGE_TOPIC' | 'CHANGE_ADVISOR' | 'CHANGE_TITLE';

export interface CreateChangeRequestInput {
  type: ChangeRequestType;
  reason: string;
  requestedData?: Record<string, any>;
}

export interface ChangeRequestItem {
  id: string;
  type: ChangeRequestType;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  createdAt: string;
  studentName?: string;
  studentCode?: string;
  requestedData?: Record<string, any>;
}

export const changeRequestService = {
  createChangeRequest: async (input: CreateChangeRequestInput): Promise<any> => {
    const res = await apiClient.post('/registrations/change-requests', input);
    return res.data?.data || res.data;
  },

  getMyChangeRequests: async (): Promise<ChangeRequestItem[]> => {
    try {
      const res = await apiClient.get<{ data: ChangeRequestItem[] }>('/registrations/change-requests');
      const raw = res.data?.data || (res.data as unknown as ChangeRequestItem[]) || [];
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  },

  reviewChangeRequest: async (id: string, dto: { isApproved: boolean; rejectionReason?: string }): Promise<any> => {
    const res = await apiClient.patch(`/registrations/change-requests/${id}/review`, dto);
    return res.data?.data || res.data;
  },
};
