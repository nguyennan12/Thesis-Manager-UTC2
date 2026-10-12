import React, { useState } from 'react';
import Link from 'next/link';
import { ManagementWorkspaceData } from '@/types/dashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

export interface ManagementWorkspaceProps {
  data: ManagementWorkspaceData;
  onApproveTopic?: (id: string) => Promise<void>;
  onRejectTopic?: (id: string, reason: string) => Promise<void>;
}

export const ManagementWorkspace: React.FC<ManagementWorkspaceProps> = ({
  data,
  onApproveTopic,
  onRejectTopic,
}) => {
  const { metrics, pendingTopics, alerts } = data;
  const regPercent = Math.round(
    (metrics.registeredStudents / metrics.totalEligibleStudents) * 100,
  );

  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    if (!onApproveTopic) return;
    setProcessingId(id);
    try {
      await onApproveTopic(id);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    const reason = window.prompt('Nhập lý do từ chối đề tài để giảng viên chỉnh sửa:');
    if (!reason || !onRejectTopic) return;
    setProcessingId(id);
    try {
      await onRejectTopic(id, reason);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* 1. HÀNG 4 THẺ ĐIỀU HÀNH TỔNG THỂ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Thẻ 1: Tổng đề tài đề xuất */}
        <Card className="border-utc2-border bg-white shadow-none">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-utc2-text-muted uppercase tracking-wider">
              <span>Đề Tài Đề Xuất</span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-bold text-utc2-text-main">
                {metrics.totalProposedTopics}
              </span>
              <span className="text-xs font-medium text-slate-500">Đề tài</span>
            </div>
            <p className="text-[11px] text-utc2-text-muted">
              Từ tất cả các bộ môn trong học kỳ
            </p>
          </CardContent>
        </Card>

        {/* Thẻ 2: Chờ Trưởng bộ môn thẩm định */}
        <Card className="border-utc2-border bg-white shadow-none">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-utc2-text-muted uppercase tracking-wider">
              <span>Chờ Thẩm Định Cấp 1</span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-bold text-utc2-text-main">
                {metrics.pendingHODReviewTopics}
              </span>
              <span className="text-xs font-medium text-[#0043ce] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                Cần duyệt
              </span>
            </div>
            <p className="text-[11px] text-utc2-text-muted">
              Chờ Trưởng bộ môn phê duyệt cấp 1
            </p>
          </CardContent>
        </Card>

        {/* Thẻ 3: Sinh viên đã hoàn tất đăng ký */}
        <Card className="border-utc2-border bg-white shadow-none">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-utc2-text-muted uppercase tracking-wider">
              <span>Sinh Viên Đã Đăng Ký</span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-bold text-utc2-text-main">
                {metrics.registeredStudents} / {metrics.totalEligibleStudents}
              </span>
              <span className="text-xs font-semibold text-[#0043ce]">
                {regPercent}% Đạt
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-[#0f62fe] rounded-full transition-all duration-300"
                style={{ width: `${regPercent}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Thẻ 4: Hội đồng đã thành lập */}
        <Card className="border-utc2-border bg-white shadow-none">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-utc2-text-muted uppercase tracking-wider">
              <span>Hội Đồng Bảo Vệ</span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-bold text-utc2-text-main">
                {metrics.establishedCouncils}
              </span>
              <span className="text-xs font-medium text-[#0043ce] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                Đã thành lập
              </span>
            </div>
            <p className="text-[11px] text-utc2-text-muted">
              Sẵn sàng cho công tác bảo vệ
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 2. CẢNH BÁO ĐIỀU PHỐI (OPERATIONAL ALERTS) */}
      {alerts && alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alt) => (
            <div
              key={alt.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border border-blue-200 bg-blue-50/50 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">• {alt.message}</span>
              </div>

              {alt.actionHref && (
                <Link
                  href={alt.actionHref}
                  className="self-end sm:self-auto shrink-0 font-medium text-white bg-[#0f62fe] hover:bg-[#0043ce] px-3 py-1 rounded transition-colors text-xs"
                >
                  {alt.actionText || 'Xử lý ngay'}
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 3. KHỐI PHÊ DUYỆT NHANH (PENDING APPROVALS) */}
      <Card className="border-utc2-border bg-white shadow-none">
        <CardHeader className="pb-3 border-b border-utc2-border flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-utc2-text-main">
              Đề Tài Chờ Trưởng Bộ Môn Thẩm Định (Cấp 1)
            </CardTitle>
            <p className="text-xs text-utc2-text-muted mt-0.5">
              Phê duyệt hoặc yêu cầu chỉnh sửa đề xuất của Giảng viên
            </p>
          </div>

          <Link
            href="/management/topics"
            className="text-xs text-[#0043ce] hover:underline font-semibold"
          >
            Quản lý toàn bộ đề tài
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên Đề Tài</TableHead>
                <TableHead>Giảng Viên Đề Xuất</TableHead>
                <TableHead>Bộ Môn</TableHead>
                <TableHead>Ngày Gửi</TableHead>
                <TableHead className="text-right">Thao Tác Duyệt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingTopics.map((top) => (
                <TableRow key={top.id}>
                  <TableCell>
                    <div className="font-semibold text-xs text-utc2-text-main line-clamp-2 max-w-md">
                      {top.titleVi}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-slate-800">
                    {top.proposerName}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {top.departmentName}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-utc2-text-muted">
                    {top.submittedAt}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        className="bg-[#0f62fe] hover:bg-[#0043ce] text-white text-xs py-1 px-2.5 rounded font-medium transition-colors disabled:opacity-50"
                        disabled={processingId === top.id}
                        onClick={() => handleApprove(top.id)}
                      >
                        {processingId === top.id ? 'Đang duyệt...' : 'Phê duyệt'}
                      </button>

                      <button
                        className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs py-1 px-2.5 rounded font-medium transition-colors disabled:opacity-50"
                        disabled={processingId === top.id}
                        onClick={() => handleReject(top.id)}
                      >
                        Từ chối
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
