'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/use-auth-store';
import {
  LayoutDashboard,
  BookOpen,
  FileCheck2,
  UploadCloud,
  Award,
  FileText,
  Users,
  Scale,
  GraduationCap,
  Building2,
  CheckCircle2,
  Compass,
  FileEdit,
  ShieldCheck,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
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
    { label: 'Tổng quan không gian', href: '/dashboard', icon: LayoutDashboard },
  ];

  const studentItems: NavItem[] = [
    { label: 'Đăng ký đề tài', href: '/student/topics', icon: BookOpen },
    { label: 'Báo cáo tiến độ', href: '/student/progress', icon: FileCheck2 },
    { label: 'Nộp toàn văn & Đạo văn', href: '/student/submission', icon: UploadCloud },
    { label: 'Bảng điểm & Kết quả', href: '/student/grades', icon: Award },
    { label: 'Đơn xin điều chỉnh', href: '/student/change-requests', icon: FileEdit },
  ];

  const lecturerItems: NavItem[] = [
    { label: 'Đề tài & Hướng dẫn', href: '/lecturer/topics', icon: BookOpen },
    { label: 'Duyệt điều kiện bảo vệ', href: '/lecturer/qualify', icon: CheckCircle2 },
    { label: 'Chấm điểm phản biện', href: '/lecturer/reviews', icon: Scale },
    { label: 'Hội đồng bảo vệ', href: '/lecturer/councils', icon: Users },
    { label: 'Phiếu điểm hội đồng', href: '/lecturer/councils/evaluate', icon: Award },
  ];

  let menuItems = [...commonItems];
  if (role === 'STUDENT') {
    menuItems = [...menuItems, ...studentItems];
  } else if (role === 'LECTURER') {
    menuItems = [...menuItems, ...lecturerItems];
    if (isHOD) {
      menuItems.push({ label: 'Thẩm định đề tài', href: '/management/topics', icon: Compass });
    }
  } else if (role === 'ADMIN' || role === 'STAFF') {
    if (role === 'ADMIN' || storeUser?.positions?.includes('ACADEMIC_AFFAIRS')) {
      menuItems.push({ label: 'Phân công Hội đồng bảo vệ', href: '/management/councils', icon: Users });
    }
    if (role === 'ADMIN') {
      menuItems.push({ label: 'Thẩm định đề tài', href: '/management/topics', icon: Compass });
    }
  }

  const roleMeta =
    role === 'ADMIN'
      ? { label: 'Ban Quản trị', color: 'bg-red-50 text-red-700 border-red-200', icon: ShieldCheck }
      : role === 'STAFF'
      ? { label: 'Giáo vụ Khoa', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: Building2 }
      : role === 'LECTURER'
      ? { label: 'Giảng viên', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: Building2 }
      : { label: 'Sinh viên K65', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: GraduationCap };

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200/80 bg-white/90 backdrop-blur-md min-h-[calc(100vh-3.5rem)] p-3.5 hidden md:flex md:flex-col justify-between">
      <div>
        {/* Workspace Identifier Header */}
        <div className="mb-3 px-2 py-2 rounded-xl bg-slate-50/80 border border-slate-200/60 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-slate-200 text-[#0043ce] shadow-2xs">
            <roleMeta.icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Không gian làm việc</div>
            <div className="text-xs font-bold text-slate-800 truncate">{roleMeta.label}</div>
          </div>
        </div>

        <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Chức năng nghiệp vụ
        </div>

        {/* Navigation list */}
        <nav className="space-y-1 mt-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const ItemIcon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-xl transition-all duration-150',
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50/70 font-semibold text-[#0043ce] border border-blue-200/80 shadow-xs shadow-blue-500/5'
                    : 'text-slate-600 hover:text-[#0043ce] hover:bg-slate-50',
                )}
              >
                <ItemIcon
                  className={cn(
                    'h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-110',
                    isActive ? 'text-[#0043ce]' : 'text-slate-400 group-hover:text-[#0043ce]',
                  )}
                />
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <span className="ml-auto flex h-1.5 w-1.5 rounded-full bg-[#0043ce]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* System Status Footer */}
      <div className="pt-3 border-t border-slate-100 px-2">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-700">UTC2-DAMS v2.4</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Sprint 2</span>
        </div>
      </div>
    </aside>
  );
};
