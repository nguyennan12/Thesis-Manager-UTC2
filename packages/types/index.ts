// ==============================================================================
// SHARED TYPES & ENUMS: UTC2 THESIS MANAGEMENT SYSTEM (UTC2-DAMS)
// Re-exported for shared usage across Backend (NestJS) and Frontend (Next.js)
// ==============================================================================

export {
  Gender,
  StudentStatus,
  TopicType,
  TopicStatus,
  RegistrationStatus,
  ProgressStatus,
  CouncilStatus,
  CouncilRole,
  ChangeRequestType,
  ChangeRequestStatus,
  AppealStatus,
  NotificationType,
  SettingDataType,
} from '@prisma/client';

export * from '../../apps/backend/src/common/interfaces/api-response.interface';
export * from '../../apps/backend/src/common/interfaces/jwt-payload.interface';
export * from '../../apps/backend/src/common/constants';
