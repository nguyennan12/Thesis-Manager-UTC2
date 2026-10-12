import React from 'react';
import { UserProfile } from '@/types/auth';
import { CurrentSemester } from '@/types/academic';

export interface WelcomeBannerProps {
  user: UserProfile | null;
  currentSemester: CurrentSemester | null;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  user,
  currentSemester,
}) => {
  const fullName =
    user?.student?.fullName ||
    user?.lecturer?.fullName ||
    user?.username ||
    'Quý Thầy/Cô và Sinh viên';

  let subtitle = '';
  const isStudent = user?.roles?.includes('STUDENT') || !!user?.student;
  const isLecturer = user?.roles?.includes('LECTURER') || !!user?.lecturer;
  const isHOD = user?.positions?.includes('TRUONG_BO_MON');
  const isDean = user?.positions?.includes('BAN_CHU_NHIEM');

  if (isStudent) {
    const rawClass = user?.student?.className || 'CQ.65.CNTT';
    const cleanClass = rawClass.startsWith('Lớp ') ? rawClass : `Lớp ${rawClass}`;
    subtitle = `Sinh viên ngành Kỹ thuật Phần mềm • ${cleanClass} • MSSV: ${user?.student?.code || user?.username}`;
  } else if (isLecturer) {
    const title = isDean
      ? 'Ban Chủ Nhiệm Khoa'
      : isHOD
      ? 'Trưởng Bộ Môn CNPM'
      : 'Giảng viên';
    const degree = user?.lecturer?.degree ? `${user.lecturer.degree} ` : '';
    subtitle = `${degree}${title} • Mã GV: ${user?.lecturer?.code || user?.username}`;
  } else {
    subtitle = `Quản trị viên Hệ thống • Tài khoản: ${user?.username}`;
  }

  const semesterLabel = currentSemester
    ? `${currentSemester.name} - Năm học ${currentSemester.academicYear}`
    : 'Học kỳ 1 (2026 - 2027)';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-utc2-border bg-white p-5">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-utc2-text-main">
          Xin chào, {fullName}
        </h1>
        <p className="text-xs text-utc2-text-muted">
          {subtitle}
        </p>
      </div>

      <div className="self-start sm:self-auto shrink-0">
        <span className="inline-block text-xs font-medium text-[#0043ce] bg-blue-50 border border-blue-200 px-3 py-1 rounded">
          {semesterLabel} • Đang diễn ra
        </span>
      </div>
    </div>
  );
};
