import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-utc2-border bg-white text-xs text-utc2-text-muted mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Thông tin trường */}
          <div className="space-y-1 text-center md:text-left">
            <p className="font-bold text-utc2-dark uppercase">
              Phân hiệu Trường Đại học Giao thông Vận tải tại TP. Hồ Chí Minh
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-2 gap-y-1 text-[11px] text-slate-500">
              <span>Số 450-451 Lê Văn Việt, Phường Tăng Nhơn Phú A, TP. Thủ Đức, TP.HCM</span>
              <span>•</span>
              <span>(028) 3896 6798</span>
              <span>•</span>
              <a href="mailto:bdt@utc2.edu.vn" className="hover:text-[#0043ce] hover:underline">
                bdt@utc2.edu.vn
              </a>
            </div>
          </div>

          {/* Bản quyền */}
          <div className="text-center md:text-right shrink-0">
            <p className="font-medium text-slate-600">
              © {new Date().getFullYear()} UTC2 - Thesis Management System (DAMS)
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Phát triển bởi Khoa Công Nghệ Thông Tin UTC2
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
