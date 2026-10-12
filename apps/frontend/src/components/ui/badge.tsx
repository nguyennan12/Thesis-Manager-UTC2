import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  size = 'md',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-md select-none border';

  const variants = {
    // Thành công / Đã duyệt / Hoàn thành / Đạt
    success: 'bg-[#defbe6] text-[#24a148] border-[#24a148]/20',
    // Cảnh báo / Chờ thẩm định / Chậm tiến độ
    warning: 'bg-[#fcf4d6] text-[#b28900] border-[#f1c21b]/30',
    // Từ chối / Trượt / Vi phạm đạo văn
    danger: 'bg-[#ffebee] text-[#da1e28] border-[#da1e28]/20',
    // Thông tin / Đang thực hiện / Hướng dẫn
    info: 'bg-[#edf5ff] text-[#0043ce] border-[#0043ce]/20',
    // Mặc định / Trung tính
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    // Viền trắng
    outline: 'bg-white text-slate-700 border-slate-300',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};
