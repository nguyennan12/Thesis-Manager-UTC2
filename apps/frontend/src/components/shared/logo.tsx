import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  subtitle?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className,
  size = 'md',
  showText = true,
  subtitle = 'PHÂN HIỆU TẠI TP. HỒ CHÍ MINH',
}) => {
  const dimensions = {
    sm: { width: 36, height: 36, titleSize: 'text-xs', subSize: 'text-[10px]' },
    md: { width: 44, height: 44, titleSize: 'text-sm', subSize: 'text-[11px]' },
    lg: { width: 64, height: 64, titleSize: 'text-base', subSize: 'text-xs' },
  };

  const { width, height, titleSize, subSize } = dimensions[size];

  return (
    <div className={cn('flex items-center gap-3 select-none', className)}>
      <div className="relative shrink-0 overflow-hidden rounded-full">
        <Image
          src="/images/utc2-logo.png"
          alt="UTC2 Logo"
          width={width}
          height={height}
          priority
          className="object-contain"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={cn('font-bold leading-tight tracking-tight text-utc2-dark uppercase', titleSize)}>
            TRƯỜNG ĐẠI HỌC GIAO THÔNG VẬN TẢI
          </span>
          <span className={cn('font-semibold text-slate-500 uppercase tracking-wide', subSize)}>
            {subtitle}
          </span>
        </div>
      )}
    </div>
  );
};
