'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/stores/use-auth-store';
import { authService } from '@/services/auth.service';
import { safeStorage } from '@/lib/storage';
import {
  Users,
  Check,
  Loader2,
  ChevronDown,
  ShieldCheck,
  GraduationCap,
  Building2,
  BookOpen,
  UserCheck,
} from 'lucide-react';

export interface PresetAccount {
  id: string;
  username: string;
  password: string;
  name: string;
  roleTitle: string;
  badgeColor: string;
  icon: 'admin' | 'staff' | 'dean' | 'hod' | 'lecturer' | 'student';
}

export const PRESET_ACCOUNTS: PresetAccount[] = [
  {
    id: 'admin',
    username: 'admin',
    password: 'Admin@123456',
    name: 'Quản trị viên Hệ thống',
    roleTitle: 'ADMIN (Toàn quyền)',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
    icon: 'admin',
  },
  {
    id: 'gvk',
    username: 'gvk_cntt',
    password: 'Utc2@123456',
    name: 'Giáo vụ Khoa CNTT',
    roleTitle: 'ACADEMIC_AFFAIRS (Giáo vụ)',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: 'staff',
  },
  {
    id: 'dean',
    username: 'dean_cntt',
    password: 'Utc2@123456',
    name: 'TS. Nguyễn Văn An',
    roleTitle: 'FACULTY_DEAN (Trưởng Khoa)',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: 'dean',
  },
  {
    id: 'hod_cnpm',
    username: 'hod_cnpm',
    password: 'Utc2@123456',
    name: 'PGS.TS. Trần Văn Bình',
    roleTitle: 'HOD (Trưởng BM Phần mềm)',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: 'hod',
  },
  {
    id: 'hod_httt',
    username: 'hod_httt',
    password: 'Utc2@123456',
    name: 'TS. Lê Thị Cẩm',
    roleTitle: 'HOD (Trưởng BM Hệ thống TT)',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    icon: 'hod',
  },
  {
    id: 'lecturer',
    username: 'gv_mienpt',
    password: 'Utc2@123456',
    name: 'ThS. Phạm Thị Miên',
    roleTitle: 'LECTURER (Giảng viên HD/PB)',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: 'lecturer',
  },
  {
    id: 'student_full',
    username: 'sv_6551071001',
    password: 'Utc2@123456',
    name: 'Dư Nguyên An (K65)',
    roleTitle: 'STUDENT (Đã bảo vệ • Điểm 8.55 A)',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: 'student',
  },
  {
    id: 'student_disqualified',
    username: 'sv_6551071013',
    password: 'Utc2@123456',
    name: 'SV Đạo văn 32.4%',
    roleTitle: 'STUDENT (Bị cấm bảo vệ • Đạo văn)',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: 'student',
  },
  {
    id: 'student_overdue',
    username: 'sv_6551071014',
    password: 'Utc2@123456',
    name: 'SV Nợ báo cáo tuần',
    roleTitle: 'STUDENT (Cảnh báo học vụ • Quá hạn)',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: 'student',
  },
  {
    id: 'student_appeal',
    username: 'sv_6551071019',
    password: 'Utc2@123456',
    name: 'SV Nộp đơn phúc khảo',
    roleTitle: 'STUDENT (Khiếu nại điểm • Chờ BCN)',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: 'student',
  },
];

export function AccountSwitcher() {
  if (process.env.NODE_ENV === 'production') return null;

  const [isOpen, setIsOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentUser = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitch = async (account: PresetAccount) => {
    if (loadingUser) return;
    setLoadingUser(account.username);
    try {
      const data = await authService.login({
        username: account.username,
        password: account.password,
      });

      setAuth(data.user, data.accessToken);
      if (data.refreshToken) {
        safeStorage.setItem('refresh_token', data.refreshToken);
      }

      setIsOpen(false);
      // Reload lại trang dashboard để nạp lại đúng quyền và dữ liệu của vai trò mới
      window.location.href = '/dashboard';
    } catch (err: any) {
      console.error('Chuyển tài khoản thất bại:', err);
      alert(
        `Chuyển tài khoản thất bại: ${
          err?.response?.data?.message || err?.message || 'Không thể kết nối đến máy chủ'
        }`,
      );
      setLoadingUser(null);
    }
  };

  const renderIcon = (type: PresetAccount['icon']) => {
    switch (type) {
      case 'admin':
        return <ShieldCheck className="h-4 w-4 text-red-600" />;
      case 'staff':
        return <Building2 className="h-4 w-4 text-purple-600" />;
      case 'dean':
        return <UserCheck className="h-4 w-4 text-blue-600" />;
      case 'hod':
        return <BookOpen className="h-4 w-4 text-emerald-600" />;
      case 'lecturer':
        return <BookOpen className="h-4 w-4 text-amber-600" />;
      case 'student':
        return <GraduationCap className="h-4 w-4 text-sky-600" />;
      default:
        return <Users className="h-4 w-4 text-slate-600" />;
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Nút Trigger Switcher */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-lg border border-utc2-border bg-slate-50 px-2.5 py-1 text-xs font-medium text-utc2-text-main shadow-sm hover:bg-slate-100 hover:border-slate-300 transition-colors"
        title="Chuyển đổi nhanh vai trò tài khoản để kiểm thử"
      >
        <Users className="h-3.5 w-3.5 text-[#0043ce]" />
        <span className="hidden sm:inline">Chuyển tài khoản</span>
        <ChevronDown className="h-3 w-3 text-slate-400" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50 animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="px-2.5 py-1.5 border-b border-slate-100 mb-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#0043ce]">
              Chuyển đổi tài khoản (Role Switcher)
            </div>
            <div className="text-[10px] text-slate-500">
              Chọn nhanh vai trò để test tính năng & phân quyền
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-1 py-1">
            {PRESET_ACCOUNTS.map((acc) => {
              const isCurrent =
                currentUser?.username === acc.username ||
                currentUser?.student?.code === acc.username ||
                currentUser?.lecturer?.code === acc.username;
              const isLoading = loadingUser === acc.username;

              return (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleSwitch(acc)}
                  disabled={Boolean(loadingUser)}
                  className={`w-full flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-all ${
                    isCurrent
                      ? 'bg-blue-50/80 border border-blue-200'
                      : 'hover:bg-slate-50 border border-transparent'
                  } ${loadingUser ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white border border-slate-200 shadow-2xs">
                      {isLoading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-[#0043ce]" />
                      ) : (
                        renderIcon(acc.icon)
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-800 truncate leading-snug">
                          {acc.name}
                        </span>
                        {isCurrent && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-blue-700 bg-blue-100 px-1 py-0.2 rounded-full">
                            <Check className="h-2.5 w-2.5" /> Đang dùng
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate leading-snug">
                        {acc.roleTitle} • <span className="font-mono text-slate-600">{acc.username}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold border ${acc.badgeColor}`}
                  >
                    {acc.id.toUpperCase()}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-1 pt-1.5 border-t border-slate-100 px-2 text-[10px] text-slate-400 text-center">
            Mật khẩu mặc định: <span className="font-mono text-slate-600">Admin@123456</span> / <span className="font-mono text-slate-600">Utc2@123456</span>
          </div>
        </div>
      )}
    </div>
  );
}
