'use client';

import React from 'react';

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-800">UTC2 THESIS PORTAL</h1>
        <p className="text-sm text-slate-500 mt-1">Đăng nhập vào Hệ thống Quản lý Đồ án</p>
      </div>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Tên đăng nhập / MSSV / Mã GV</label>
          <input
            type="text"
            placeholder="admin, 6551071001, gv_mienpt..."
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Mật khẩu</label>
          <input
            type="password"
            placeholder="••••••••"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <button
          type="button"
          className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 transition"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
