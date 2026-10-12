import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-utc2-surface p-4 text-center">
      <div className="rounded-lg border border-utc2-border bg-white p-8 max-w-md w-full shadow-none text-center">
        <div className="text-3xl font-bold font-mono text-[#0043ce] mb-2">
          404
        </div>

        <h1 className="text-base sm:text-lg font-semibold text-slate-900">
          Chưa Tìm Thấy Trang Này
        </h1>

        <p className="mt-2 text-xs text-utc2-text-muted leading-relaxed">
          Đường dẫn bạn vừa chọn đang được phát triển trong các giai đoạn tiếp theo hoặc không tồn tại trên hệ thống.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto text-xs font-semibold text-white bg-[#0f62fe] hover:bg-[#0043ce] px-4 py-2 rounded transition-colors"
          >
            Về Bàn Làm Việc (/dashboard)
          </Link>
        </div>
      </div>
    </div>
  );
}
