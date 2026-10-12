'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/stores/use-auth-store';
import { authService } from '@/services/auth.service';

interface SwitchProfile {
  id: string;
  username: string;
  password: string;
  label: string;
  fullName: string;
  roleBadge: string;
}

const DEMO_PROFILES: SwitchProfile[] = [
  {
    id: 'student',
    username: 'sv_6551071001',
    password: 'Utc2@123456',
    label: 'Sinh viên',
    fullName: 'Dư Nguyên An',
    roleBadge: 'MSSV: 6551071001',
  },
  {
    id: 'supervisor',
    username: 'gv_mienpt',
    password: 'Utc2@123456',
    label: 'GVHD',
    fullName: 'ThS. Phạm Thị Miên',
    roleBadge: 'GV Hướng dẫn (GV004)',
  },
  {
    id: 'hod',
    username: 'hod_cnpm',
    password: 'Utc2@123456',
    label: 'Trưởng BM',
    fullName: 'PGS.TS. Trần Văn Bình',
    roleBadge: 'Trưởng Bộ môn CNPM',
  },
  {
    id: 'staff',
    username: 'gvk_cntt',
    password: 'Utc2@123456',
    label: 'Giáo vụ',
    fullName: 'Giáo vụ Khoa CNTT',
    roleBadge: 'Cán bộ quản lý Khoa',
  },
  {
    id: 'admin',
    username: 'admin',
    password: 'Admin@123456',
    label: 'Admin',
    fullName: 'Quản trị hệ thống',
    roleBadge: 'Quản trị viên Superuser',
  },
];

export const RoleSwitcher: React.FC = () => {
  const storeUser = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);

  const [isOpen, setIsOpen] = useState(false);
  const [switchingTo, setSwitchingTo] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitch = async (profile: SwitchProfile) => {
    if (storeUser?.username === profile.username) {
      setIsOpen(false);
      return;
    }

    setSwitchingTo(profile.id);
    try {
      const data = await authService.login({
        username: profile.username,
        password: profile.password,
      });

      if (data?.accessToken && data?.user) {
        setAuth(data.user, data.accessToken);
        if (typeof window !== 'undefined' && data.refreshToken) {
          localStorage.setItem('refresh_token', data.refreshToken);
        }
        // Tải lại về Dashboard để cập nhật toàn bộ quyền và menu
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      alert(`Không thể chuyển sang tài khoản ${profile.label}: ${err?.message || 'Lỗi kết nối'}`);
      setSwitchingTo(null);
    }
  };

  const currentProfile = DEMO_PROFILES.find((p) => p.username === storeUser?.username);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50/70 hover:bg-blue-100/70 px-3 py-1.5 text-xs text-[#0043ce] transition-colors shadow-sm font-semibold"
      >
        <span>Đổi vai trò:</span>
        <b className="underline underline-offset-2">
          {currentProfile ? currentProfile.label : 'Chọn'}
        </b>
        <span className="text-[10px] text-[#0043ce]">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl border border-utc2-border bg-white p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3 py-2 border-b border-utc2-border mb-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-utc2-text-muted">
              Chuyển Nhanh Phiên Làm Việc (1-Click)
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Chọn vai trò để trải nghiệm luồng nghiệp vụ tương ứng:
            </p>
          </div>

          <div className="space-y-1">
            {DEMO_PROFILES.map((profile) => {
              const isCurrent = storeUser?.username === profile.username;
              const isProcessing = switchingTo === profile.id;

              return (
                <button
                  key={profile.id}
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleSwitch(profile)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between ${
                    isCurrent
                      ? 'bg-blue-50 text-[#0043ce] font-semibold border border-blue-200'
                      : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">[{profile.label}]</span>
                      <span>{profile.fullName}</span>
                    </div>
                    <div className="text-[10px] text-utc2-text-muted mt-0.5">
                      {profile.roleBadge}
                    </div>
                  </div>

                  <div>
                    {isProcessing ? (
                      <span className="text-[10px] text-[#0043ce] font-mono animate-pulse">
                        Đang vào...
                      </span>
                    ) : isCurrent ? (
                      <span className="text-[10px] text-[#0043ce] font-bold">
                        (Đang dùng)
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 group-hover:text-slate-600">
                        Chuyển →
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
