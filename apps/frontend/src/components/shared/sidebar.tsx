'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/use-auth-store';

export interface NavItem {
  label: string;
  href: string;
}

export interface SidebarProps {
  role?: 'STUDENT' | 'LECTURER' | 'ADMIN' | 'STAFF';
  isHOD?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ role: propRole, isHOD: propIsHOD }) => {
  const pathname = usePathname();
  const storeUser = useAuthStore((s) => s.user);

  const role: 'STUDENT' | 'LECTURER' | 'ADMIN' | 'STAFF' =
    propRole ||
    (storeUser?.roles?.includes('ADMIN')
      ? 'ADMIN'
      : storeUser?.roles?.includes('STAFF') || storeUser?.roles?.includes('ACADEMIC_AFFAIRS')
      ? 'STAFF'
      : storeUser?.roles?.includes('LECTURER') || !!storeUser?.lecturer
      ? 'LECTURER'
      : 'STUDENT');

  const isHOD =
    propIsHOD !== undefined
      ? propIsHOD
      : storeUser?.positions?.includes('HEAD_OF_DEPARTMENT') ||
        storeUser?.positions?.includes('TRUONG_BO_MON') ||
        false;

  const commonItems: NavItem[] = [
    { label: 'Tổng quan', href: '/dashboard' },
  ];

  const studentItems: NavItem[] = [
    { label: 'Đăng ký đề tài', href: '/student/topics' },
    { label: 'Báo cáo tiến độ', href: '/student/progress' },
    { label: 'Nộp toàn văn & Đạo văn', href: '/student/submission' },
    { label: 'Bảng điểm & Kết quả', href: '/student/grades' },
    { label: 'Đơn xin điều chỉnh', href: '/student/change-requests' },
  ];

  const lecturerItems: NavItem[] = [
    { label: 'Đề tài & Hướng dẫn', href: '/lecturer/topics' },
    { label: 'Duyệt điều kiện bảo vệ', href: '/lecturer/qualify' },
    { label: 'Chấm điểm phản biện', href: '/lecturer/reviews' },
    { label: 'Hội đồng bảo vệ', href: '/lecturer/councils' },
    { label: 'Phiếu điểm hội đồng', href: '/lecturer/councils/evaluate' },
  ];

  let menuItems = [...commonItems];
  if (role === 'STUDENT') {
    menuItems = [...menuItems, ...studentItems];
  } else if (role === 'LECTURER') {
    menuItems = [...menuItems, ...lecturerItems];
    if (isHOD) {
      menuItems.push({ label: 'Thẩm định đề tài', href: '/management/topics' });
    }
  } else if (role === 'ADMIN' || role === 'STAFF') {
    if (role === 'ADMIN' || storeUser?.positions?.includes('ACADEMIC_AFFAIRS')) {
      menuItems.push({ label: 'Phân công Hội đồng bảo vệ', href: '/management/councils' });
    }
    if (role === 'ADMIN') {
      menuItems.push({ label: 'Thẩm định đề tài', href: '/management/topics' });
    }
  }

  return (
    <aside className="w-56 shrink-0 border-r border-utc2-border bg-white min-h-[calc(100vh-3.5rem)] p-3 hidden md:flex md:flex-col">
      <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-utc2-text-muted">
        Chức năng
      </div>

      <nav className="space-y-0.5 mt-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'block px-3 py-2 text-xs transition-colors rounded',
                isActive
                  ? 'bg-blue-50/80 font-semibold text-[#0043ce] border-l-2 border-[#0043ce]'
                  : 'text-utc2-text-muted hover:text-[#0043ce] hover:bg-slate-50',
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
