'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from './logo';
import { AccountSwitcher } from './account-switcher';
import { useAuthStore } from '@/stores/use-auth-store';
import { authService } from '@/services/auth.service';
import {
  Calendar,
  LogOut,
  Bell,
  Sparkles,
  Shield,
  Briefcase,
  GraduationCap,
  User as UserIcon,
} from 'lucide-react';

export interface HeaderProps {
  user?: {
    fullName: string;
    username: string;
    roleName: string;
  };
  currentSemesterName?: string;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user: propUser,
  currentSemesterName = 'Học kỳ 1 (2026 - 2027)',
  onLogout,
}) => {
  const storeUser = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const isAdmin = storeUser?.roles?.includes('ADMIN');
  const isDean = storeUser?.positions?.includes('FACULTY_DEAN');
  const isHOD = storeUser?.positions?.includes('HEAD_OF_DEPARTMENT');
  const isAcademicAffairs = storeUser?.positions?.includes('ACADEMIC_AFFAIRS');
  const isLecturer = storeUser?.roles?.includes('LECTURER');
  const isStudent = storeUser?.roles?.includes('STUDENT');

  const displayUser = propUser || {
    fullName:
      storeUser?.student?.fullName ||
      storeUser?.lecturer?.fullName ||
      storeUser?.username ||
      'Người dùng UTC2',
    username:
      storeUser?.student?.code ||
      storeUser?.lecturer?.code ||
      storeUser?.username ||
      '6551071001',
    roleName: isAdmin
      ? 'Quản trị viên Hệ thống'
      : isDean
      ? 'Trưởng Khoa CNTT'
      : isHOD
      ? 'Trưởng Bộ môn'
      : isAcademicAffairs
      ? 'Giáo vụ Khoa CNTT'
      : storeUser?.roles?.includes('STAFF')
      ? 'Chuyên viên QLĐT'
      : isLecturer
      ? 'Giảng viên Hướng dẫn'
      : 'Sinh viên Khóa luận',
  };

  const getRoleBadgeStyle = () => {
    if (isAdmin) return 'bg-red-50 text-red-700 border-red-200';
    if (isDean) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (isHOD) return 'bg-teal-50 text-teal-700 border-teal-200';
    if (isAcademicAffairs) return 'bg-purple-50 text-purple-700 border-purple-200';
    if (isLecturer) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
      return;
    }
    try {
      await authService.logout();
    } catch {
      // ignore
    } finally {
      clearAuth();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-4 md:px-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
      {/* Khối Trái: Logo & Tên trường */}
      <div className="flex items-center gap-4">
        <Logo size="sm" subtitle="CỔNG QUẢN LÝ ĐỒ ÁN TỐT NGHIỆP" />

        <div className="hidden lg:block h-6 w-px bg-slate-200" />

        {/* Học kỳ hiện tại */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-full">
          <Calendar className="w-3.5 h-3.5 text-[#0043ce]" />
          <span>{currentSemesterName}</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
      </div>

      {/* Khối Phải: Học kỳ, Chuyển nhanh vai trò & Thông tin tài khoản */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Nút chuyển đổi tài khoản nhanh */}
        {process.env.NODE_ENV !== 'production' && <AccountSwitcher />}

        {/* Thông báo mẫu */}
        <button
          type="button"
          title="Thông báo mới"
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        <div className="h-6 w-px bg-slate-200" />

        {/* Thông tin người dùng & Avatar */}
        <div className="flex items-center gap-2.5">
          {/* Avatar tròn với chữ viết tắt */}
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#0043ce] to-[#0f62fe] text-white font-bold text-xs flex items-center justify-center ring-2 ring-blue-100 shadow-sm shrink-0">
            {getInitials(displayUser.fullName)}
          </div>

          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-slate-900 leading-tight">
              {displayUser.fullName}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${getRoleBadgeStyle()}`}>
                {displayUser.roleName}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                • {displayUser.username}
              </span>
            </div>
          </div>
        </div>

        {/* Nút Đăng xuất */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 px-2.5 py-1.5 rounded-lg transition-all duration-150"
          title="Đăng xuất khỏi hệ thống"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Đăng xuất</span>
        </button>
      </div>
    </header>
  );
};
