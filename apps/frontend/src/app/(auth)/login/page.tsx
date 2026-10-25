'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PRESET_ACCOUNTS, PresetAccount } from '@/components/shared/account-switcher';
import {
  ShieldCheck,
  CheckCircle2,
  Award,
  BookOpen,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Lock,
  User,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export default function LoginPage() {
  const {
    register,
    setValue,
    errors,
    isSubmitting,
    serverError,
    showPassword,
    toggleShowPassword,
    onSubmit,
  } = useAuth();

  const handleQuickFill = (acc: PresetAccount) => {
    setValue('username', acc.username);
    setValue('password', acc.password);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* CỘT TRÁI: Academic Hero Showcase (Hiện trên màn hình lớn lg trở lên) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-gradient-to-br from-[#071329] via-[#0b2447] to-[#0043ce] text-white overflow-hidden">
        {/* Lớp nền hiệu ứng ánh sáng trang trí */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Khối Trên: Brand Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="relative p-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
              <Image
                src="/images/utc2-logo.png"
                alt="UTC2 Logo"
                width={56}
                height={56}
                priority
                className="h-14 w-14 object-contain rounded-xl select-none"
              />
            </div>
            <div>
              <div className="text-[11px] font-bold tracking-widest uppercase text-blue-200">
                Bộ Giao Thông Vận Tải
              </div>
              <h1 className="text-base font-bold tracking-tight text-white leading-tight">
                TRƯỜNG ĐẠI HỌC GIAO THÔNG VẬN TẢI
              </h1>
              <p className="text-xs text-blue-200/80 font-medium">
                Phân hiệu tại TP. Hồ Chí Minh
              </p>
            </div>
          </div>
        </div>

        {/* Khối Giữa: Giới thiệu hệ thống & Giá trị cốt lõi */}
        <div className="relative z-10 max-w-xl space-y-7 my-auto py-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-blue-100 font-medium shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Cổng Quản Lý Đồ Án Tốt Nghiệp • Năm học 2026 - 2027</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight text-white">
              Nền tảng số hóa quản lý & thẩm định Khóa luận Tốt nghiệp
            </h2>
            <p className="text-sm text-blue-100/90 leading-relaxed">
              Giải pháp toàn trình chuẩn hóa quy trình phân công hướng dẫn, giám sát tiến độ tuần, kiểm tra trùng lặp báo cáo và điều hành hội đồng chấm bảo vệ trực tiếp.
            </p>
          </div>

          {/* 3 Trụ cột nghiệp vụ */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-300 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Chuẩn Hóa Phê Duyệt 3 Cấp</h4>
                <p className="text-[11px] text-blue-200/80 mt-0.5">
                  Đề xuất & kiểm duyệt minh bạch: Giảng viên HD → Trưởng Bộ Môn → Giáo Vụ Khoa.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Kiểm Tra Đạo Văn & Báo Cáo Định Kỳ</h4>
                <p className="text-[11px] text-blue-200/80 mt-0.5">
                  Giám sát tiến độ 10 tuần, phát hiện tỉ lệ trùng lặp học thuật vượt ngưỡng 20%.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Hội Đồng Bảo Vệ Đa Chiều</h4>
                <p className="text-[11px] text-blue-200/80 mt-0.5">
                  Tổng hợp điểm Chủ tịch, Thư ký, Phản biện và Uỷ viên tức thời, minh bạch và an toàn.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Khối Dưới: Thông tin liên hệ & Hỗ trợ */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/10 text-xs text-blue-200/70">
          <span>Khoa Công Nghệ Thông Tin UTC2</span>
          <span>Hotline hỗ trợ: (028) 3896 6798</span>
        </div>
      </div>

      {/* CỘT PHẢI: Khối Đăng Nhập & Chọn Nhanh Tài Khoản Demo */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Header Mobile Only */}
          <div className="flex lg:hidden flex-col items-center text-center pb-2">
            <div className="p-2 rounded-2xl bg-white border border-slate-200 shadow-sm mb-3">
              <Image
                src="/images/utc2-logo.png"
                alt="UTC2 Logo"
                width={56}
                height={56}
                priority
                className="h-14 w-14 object-contain"
              />
            </div>
            <h1 className="text-base font-bold uppercase text-[#0043ce]">
              ĐẠI HỌC GIAO THÔNG VẬN TẢI - UTC2
            </h1>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-0.5">
              Cổng Quản Lý Đồ Án Tốt Nghiệp
            </p>
          </div>

          {/* Form Card chính */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-9 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Đăng nhập hệ thống
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Sử dụng tài khoản nội bộ UTC2 (Cán bộ / Giảng viên / Sinh viên)
              </p>
            </div>

            {/* Thông báo lỗi server nếu có */}
            {serverError && (
              <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50/80 p-3.5 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span className="font-medium leading-relaxed">{serverError}</span>
              </div>
            )}

            {/* Form */}
            <form method="post" onSubmit={onSubmit} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <Input
                  label="Tên đăng nhập / MSSV / Mã Cán Bộ"
                  id="username"
                  type="text"
                  placeholder="Nhập mã số sinh viên hoặc tài khoản"
                  autoComplete="username"
                  error={errors.username?.message}
                  {...register('username')}
                />
              </div>

              <div className="space-y-1.5">
                <Input
                  label="Mật khẩu"
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  rightElement={
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      className="text-xs font-semibold text-slate-500 hover:text-[#0043ce] focus:outline-none transition-colors px-1 py-0.5"
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? 'Ẩn' : 'Hiện'}
                    </button>
                  }
                  error={errors.password?.message}
                  {...register('password')}
                />
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 hover:text-slate-900">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-[#0f62fe] focus:ring-[#0f62fe]/20 accent-[#0f62fe] cursor-pointer"
                    {...register('rememberMe')}
                  />
                  <span>Ghi nhớ phiên đăng nhập</span>
                </label>

                <Link
                  href="/forgot-password"
                  className="font-medium text-[#0043ce] hover:underline transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-3 font-semibold bg-gradient-to-r from-[#0f62fe] to-[#0043ce] hover:from-[#0043ce] hover:to-[#002d9c] text-white shadow-md hover:shadow-lg transition-all duration-200 py-2.5 rounded-lg"
                isLoading={isSubmitting}
              >
                {isSubmitting ? 'Đang xác thực thông tin...' : 'Đăng Nhập Vào Hệ Thống'}
              </Button>
            </form>

            {/* Chỉ cung cấp tài khoản mẫu trong môi trường phát triển local. */}
            {process.env.NODE_ENV !== 'production' && (
            <div className="mt-7 pt-5 border-t border-dashed border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Chọn nhanh tài khoản demo:
                </span>
                <span className="text-[10px] text-slate-400 font-mono">1-click test</span>
              </div>

              {/* Nhóm Ban Quản Lý & Khoa */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Ban Quản Lý & Bộ Môn
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickFill(PRESET_ACCOUNTS[0])}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-red-50/80 hover:bg-red-100/90 text-red-800 border border-red-200/80 text-[11px] font-semibold text-left transition-colors"
                  >
                    <span>🛡️</span>
                    <span className="truncate">Admin (Toàn quyền)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill(PRESET_ACCOUNTS[1])}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-purple-50/80 hover:bg-purple-100/90 text-purple-800 border border-purple-200/80 text-[11px] font-semibold text-left transition-colors"
                  >
                    <span>🏢</span>
                    <span className="truncate">Giáo vụ Khoa</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill(PRESET_ACCOUNTS[2])}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-blue-50/80 hover:bg-blue-100/90 text-blue-800 border border-blue-200/80 text-[11px] font-semibold text-left transition-colors"
                  >
                    <span>👔</span>
                    <span className="truncate">Trưởng Khoa CNTT</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill(PRESET_ACCOUNTS[3])}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-emerald-50/80 hover:bg-emerald-100/90 text-emerald-800 border border-emerald-200/80 text-[11px] font-semibold text-left transition-colors"
                  >
                    <span>💻</span>
                    <span className="truncate">Trưởng BM Phần mềm</span>
                  </button>
                </div>
              </div>

              {/* Nhóm Giảng viên & Sinh viên */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Giảng Viên & Sinh Viên
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickFill(PRESET_ACCOUNTS[5])}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-amber-50/80 hover:bg-amber-100/90 text-amber-800 border border-amber-200/80 text-[11px] font-semibold text-left transition-colors col-span-2"
                  >
                    <span>👨‍🏫</span>
                    <span className="truncate">ThS. Phạm Thị Miên (Giảng viên HD & PB)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickFill(PRESET_ACCOUNTS[6])}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-emerald-50/80 hover:bg-emerald-100/90 text-emerald-800 border border-emerald-200/80 text-[11px] font-semibold text-left transition-colors"
                  >
                    <span>🎓</span>
                    <span className="truncate">SV: Đạt 8.55 (A)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill(PRESET_ACCOUNTS[7])}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-rose-50/80 hover:bg-rose-100/90 text-rose-800 border border-rose-200/80 text-[11px] font-semibold text-left transition-colors"
                  >
                    <span>⚠️</span>
                    <span className="truncate">SV: Đạo văn 32.4%</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill(PRESET_ACCOUNTS[8])}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-amber-50/80 hover:bg-amber-100/90 text-amber-800 border border-amber-200/80 text-[11px] font-semibold text-left transition-colors"
                  >
                    <span>⏰</span>
                    <span className="truncate">SV: Nợ báo cáo tuần</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill(PRESET_ACCOUNTS[9])}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-indigo-50/80 hover:bg-indigo-100/90 text-indigo-800 border border-indigo-200/80 text-[11px] font-semibold text-left transition-colors"
                  >
                    <span>📝</span>
                    <span className="truncate">SV: Nộp phúc khảo</span>
                  </button>
                </div>
              </div>
            </div>
            )}
          </div>

          {/* Footer thông tin hỗ trợ */}
          <div className="text-center text-xs text-slate-500 space-y-1">
            <p>
              Cần trợ giúp truy cập tài khoản?{' '}
              <a href="mailto:support@utc2.edu.vn" className="text-[#0043ce] font-semibold hover:underline">
                Liên hệ Trung tâm CNTT
              </a>
            </p>
            <p className="text-[11px] text-slate-400">
              © {new Date().getFullYear()} UTC2 • Hệ Thống Quản Lý Đồ Án Tốt Nghiệp DAMS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
