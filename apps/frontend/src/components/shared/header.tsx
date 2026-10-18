'use client';

import React from 'react';
import { Logo } from './logo';
import { useAuthStore } from '@/stores/use-auth-store';
import { authService } from '@/services/auth.service';

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
    roleName: storeUser?.roles?.includes('ADMIN')
      ? 'Quản trị viên'
      : storeUser?.positions?.includes('HEAD_OF_DEPARTMENT')
      ? 'Trưởng Bộ môn'
      : storeUser?.positions?.includes('ACADEMIC_AFFAIRS')
      ? 'Giáo vụ Khoa'
      : storeUser?.roles?.includes('STAFF')
      ? 'Nhân viên quản lý'
      : storeUser?.roles?.includes('LECTURER')
      ? 'Giảng viên'
      : 'Sinh viên',
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
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-utc2-border bg-white px-4 md:px-6">
      {/* Khối Trái: Logo & Tên trường */}
      <div className="flex items-center gap-3">
        <Logo size="sm" subtitle="CỔNG QUẢN LÝ ĐỒ ÁN TỐT NGHIỆP" />
      </div>

      {/* Khối Phải: Học kỳ, Chuyển nhanh vai trò & Thông tin tài khoản */}
      <div className="flex items-center gap-3">
        {/* Học kỳ hiện tại */}
        <div className="hidden lg:inline-block text-xs font-medium text-[#0043ce] bg-blue-50/70 border border-blue-200/60 px-2.5 py-1 rounded">
          {currentSemesterName}
        </div>

        {/* Thông tin người dùng */}
        <div className="text-right hidden sm:block">
          <div className="text-xs font-semibold text-utc2-text-main leading-tight">
            {displayUser.fullName}
          </div>
          <div className="text-[11px] text-utc2-text-muted leading-tight">
            {displayUser.roleName} • {displayUser.username}
          </div>
        </div>

        {/* Nút Đăng xuất dạng text phẳng tối giản */}
        <button
          onClick={handleLogout}
          className="text-xs font-medium text-utc2-text-muted hover:text-red-600 border border-utc2-border hover:border-red-200 px-2.5 py-1 rounded transition-colors"
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
};
