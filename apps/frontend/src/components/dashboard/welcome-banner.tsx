import React from 'react';
import { UserProfile } from '@/types/auth';
import { CurrentSemester } from '@/types/academic';
import {
  GraduationCap,
  Building2,
  ShieldCheck,
  UserCheck,
  Calendar,
  Sparkles,
  Layers,
} from 'lucide-react';

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

  const isStudent = user?.roles?.includes('STUDENT') || !!user?.student;
  const isLecturer = user?.roles?.includes('LECTURER') || !!user?.lecturer;
  const isHOD = user?.positions?.includes('HEAD_OF_DEPARTMENT') || user?.positions?.includes('TRUONG_BO_MON');
  const isDean =
    user?.positions?.includes('BAN_CHU_NHIEM') ||
    user?.positions?.includes('FACULTY_DEAN') ||
    user?.positions?.includes('DEAN');
  const isAdmin = user?.roles?.includes('ADMIN');
  const isAcademicAffairs =
    user?.positions?.includes('ACADEMIC_AFFAIRS') ||
    user?.roles?.includes('ACADEMIC_AFFAIRS') ||
    user?.roles?.includes('STAFF');

  let roleLabel = 'Quản trị viên Hệ thống';
  let detailLabel = `Tài khoản: ${user?.username}`;
  let RoleIcon = ShieldCheck;
  let roleBadgeClass = 'bg-red-500/20 text-red-100 border-red-400/30';

  if (isAdmin) {
    roleLabel = 'Quản trị viên Hệ thống';
    RoleIcon = ShieldCheck;
    roleBadgeClass = 'bg-red-500/20 text-red-100 border-red-400/30';
  } else if (isAcademicAffairs) {
    roleLabel = 'Giáo vụ Khoa CNTT';
    RoleIcon = Building2;
    roleBadgeClass = 'bg-violet-400/20 text-violet-100 border-violet-300/30';
  } else if (isStudent) {
    const rawClass = user?.student?.className || 'CQ.65.CNTT';
    const cleanClass = rawClass.startsWith('Lớp ') ? rawClass : `Lớp ${rawClass}`;
    roleLabel = 'Sinh viên Khóa 65';
    detailLabel = `${cleanClass} • MSSV: ${user?.student?.code || user?.username}`;
    RoleIcon = GraduationCap;
    roleBadgeClass = 'bg-sky-400/20 text-sky-100 border-sky-300/30';
  } else if (isLecturer) {
    const title = isDean
      ? 'Trưởng Khoa CNTT'
      : isHOD
      ? `Trưởng Bộ môn${user?.lecturer?.departmentName ? ` ${user.lecturer.departmentName}` : ''}`
      : 'Giảng viên Hướng dẫn & Phản biện';
    const degree = user?.lecturer?.degree ? `${user.lecturer.degree} ` : '';
    roleLabel = `${degree}${title}`;
    detailLabel = `Mã GV: ${user?.lecturer?.code || user?.username}`;
    RoleIcon = isDean ? UserCheck : Building2;
    roleBadgeClass = 'bg-emerald-400/20 text-emerald-100 border-emerald-300/30';
  }

  const semesterLabel = currentSemester
    ? `${currentSemester.name} (${currentSemester.academicYear})`
    : 'Học kỳ 1 (2026 - 2027)';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#072468] via-[#0043ce] to-[#1264fe] text-white p-6 sm:p-7 shadow-xl shadow-blue-900/10 border border-blue-400/20">
      {/* Decorative Glow & Geometry Elements */}
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-400/15 blur-3xl pointer-events-none" />
      <div className="absolute right-40 -bottom-20 h-48 w-48 rounded-full bg-indigo-400/15 blur-2xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left Side: Avatar, Salutation & Details */}
        <div className="space-y-3 max-w-2xl">
          {/* Small Top Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-blue-100 border border-white/15">
            <Sparkles className="h-3 w-3 text-amber-300 animate-pulse" />
            <span>TRƯỜNG ĐẠI HỌC GIAO THÔNG VẬN TẢI • CỔNG ĐỒ ÁN TỐT NGHIỆP</span>
          </div>

          {/* Main Greeting */}
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
              Xin chào, {fullName}
            </h1>
            <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${roleBadgeClass}`}>
              <RoleIcon className="h-3.5 w-3.5" />
              {roleLabel}
            </span>
          </div>

          {/* Subtitle / Department / Student info */}
          <p className="text-xs sm:text-sm text-blue-100/90 font-medium flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="inline-flex sm:hidden items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border backdrop-blur-sm ${roleBadgeClass}">
              <RoleIcon className="h-3 w-3" />
              {roleLabel}
            </span>
            <span>{detailLabel}</span>
          </p>
        </div>

        {/* Right Side: Semester & System Health Pill Card */}
        <div className="self-start lg:self-auto shrink-0 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-3.5 shadow-inner flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white shadow-xs">
              <Calendar className="h-5 w-5 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                  Đang diễn ra
                </span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-white leading-tight mt-0.5">
                {semesterLabel}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
