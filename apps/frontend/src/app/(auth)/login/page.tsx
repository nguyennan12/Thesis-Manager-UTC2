'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const {
    register,
    errors,
    isSubmitting,
    serverError,
    showPassword,
    toggleShowPassword,
    onSubmit,
  } = useAuth();

  return (
    <div className="w-full max-w-md rounded-lg border border-utc2-border bg-white p-6 sm:p-8 shadow-sm">
      {/* 1. Header Card: Logo trường & Tiêu đề nhận diện UTC2 */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="relative mb-3 flex items-center justify-center">
          <Image
            src="/images/utc2-logo.png"
            alt="Logo UTC2"
            width={80}
            height={80}
            priority
            className="h-20 w-20 object-contain select-none rounded-full"
          />
        </div>

        <h1 className="text-base sm:text-lg font-bold uppercase tracking-tight text-[#0043ce]">
          TRƯỜNG ĐẠI HỌC GIAO THÔNG VẬN TẢI
        </h1>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-utc2-text-muted">
          PHÂN HIỆU TẠI TP. HỒ CHÍ MINH • CỔNG QUẢN LÝ ĐỒ ÁN
        </p>
      </div>

      {/* Thông báo lỗi từ máy chủ nếu có */}
      {serverError && (
        <div className="mb-4 rounded border border-blue-200 bg-blue-50/70 p-3 text-xs text-[#0043ce]">
          <span className="font-medium leading-relaxed">• {serverError}</span>
        </div>
      )}

      {/* 2. Form Nhập Liệu */}
      <form method="post" onSubmit={onSubmit} className="space-y-4" noValidate>
        {/* Ô 1: Tên đăng nhập / MSSV / Mã Giảng viên */}
        <Input
          label="Tên đăng nhập / MSSV / Mã Giảng viên"
          id="username"
          type="text"
          placeholder="Nhập mã số sinh viên hoặc tài khoản"
          autoComplete="username"
          error={errors.username?.message}
          {...register('username')}
        />

        {/* Ô 2: Mật khẩu với nút bật/tắt hiển thị */}
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
              className="text-xs font-medium text-slate-500 hover:text-[#0043ce] focus:outline-none transition-colors px-1 py-0.5"
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? 'Ẩn' : 'Hiện'}
            </button>
          }
          error={errors.password?.message}
          {...register('password')}
        />

        {/* Tùy chọn: Ghi nhớ đăng nhập & Quên mật khẩu */}
        <div className="flex items-center justify-between pt-0.5 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none text-utc2-text-muted hover:text-utc2-text-main">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-utc2-border text-[#0f62fe] focus:ring-[#0f62fe]/20 accent-[#0f62fe] cursor-pointer"
              {...register('rememberMe')}
            />
            <span>Ghi nhớ đăng nhập</span>
          </label>

          <Link
            href="/forgot-password"
            className="font-medium text-[#0043ce] hover:underline transition-colors"
          >
            Quên mật khẩu?
          </Link>
        </div>

        {/* Nút Đăng nhập Full-width */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2 font-semibold bg-[#0f62fe] hover:bg-[#0043ce] text-white transition duration-150 shadow-none"
          isLoading={isSubmitting}
        >
          {isSubmitting ? 'Đang xác thực...' : 'Đăng Nhập'}
        </Button>
      </form>

      {/* 3. Phần chân: Hỗ trợ kỹ thuật */}
      <div className="mt-6 border-t border-utc2-border pt-4 text-center">
        <p className="text-xs leading-relaxed text-utc2-text-muted">
          Sinh viên & Giảng viên dùng tài khoản được trường cấp để đăng nhập.
        </p>
        <p className="mt-1 text-xs text-utc2-text-muted">
          Hỗ trợ kỹ thuật:{' '}
          <a
            href="mailto:bdt@utc2.edu.vn"
            className="font-medium text-[#0043ce] hover:underline"
          >
            bdt@utc2.edu.vn
          </a>
        </p>
      </div>
    </div>
  );
}
