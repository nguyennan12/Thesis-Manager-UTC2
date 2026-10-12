'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export interface FeaturePlaceholderProps {
  title: string;
  moduleName: string;
  description: string;
}

export const FeaturePlaceholder: React.FC<FeaturePlaceholderProps> = ({
  title,
  moduleName,
  description,
}) => {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card className="border-utc2-border bg-white shadow-none text-center p-6 sm:p-8">
        <CardHeader className="flex flex-col items-center pb-2">
          <div className="mb-2">
            <span className="text-xs font-medium text-[#0043ce] bg-blue-50 border border-blue-200 px-3 py-1 rounded">
              Phân Hệ {moduleName} • Đang Phát Triển
            </span>
          </div>

          <CardTitle className="text-lg sm:text-xl font-bold text-utc2-text-main mt-1">
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 pt-2">
          <p className="text-xs text-utc2-text-muted max-w-lg mx-auto leading-relaxed">
            {description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              className="text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 px-3.5 py-2 rounded transition-colors"
              onClick={() => router.back()}
            >
              Quay Lại Trang Trước
            </button>

            <Link
              href="/dashboard"
              className="text-xs font-semibold text-white bg-[#0f62fe] hover:bg-[#0043ce] px-3.5 py-2 rounded transition-colors"
            >
              Về Bàn Làm Việc
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
