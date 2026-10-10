import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Dynamic Sidebar according to Role */}
      <aside className="w-64 border-r border-slate-200 bg-white p-4 hidden md:block">
        <div className="font-bold text-lg text-blue-600 mb-6">UTC2 - DAMS</div>
        <nav className="space-y-1 text-sm font-medium text-slate-600">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-700">Trang chủ</div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-700">Hệ thống Quản lý Đồ án</div>
          <div className="text-sm text-slate-500">Người dùng</div>
        </header>
        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}
