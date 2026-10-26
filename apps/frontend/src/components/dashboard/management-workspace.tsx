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
import {
  BookOpen,
  Clock,
  Users,
  Scale,
  CheckCircle2,
  XCircle,
  BellRing,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export interface ManagementWorkspaceProps {
  data: ManagementWorkspaceData;
  canReviewTopics?: boolean;
  approvalStage?: 'HOD' | 'DEAN' | 'NONE';
  roleNotice?: string;
  onApproveTopic?: (id: string) => Promise<void>;
  onRejectTopic?: (id: string, reason: string) => Promise<void>;
}

export const ManagementWorkspace: React.FC<ManagementWorkspaceProps> = ({
  data,
  canReviewTopics = false,
  approvalStage = 'NONE',
  roleNotice,
  onApproveTopic,
  onRejectTopic,
}) => {
  const { metrics, pendingTopics, alerts } = data;
  const regPercent = Math.round(
    (metrics.registeredStudents / (metrics.totalEligibleStudents || 1)) * 100,
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
    <div className="space-y-6">
      {/* 1. HÀNG 4 THẺ CHỈ SỐ QUẢN TRỊ CAO CẤP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Thẻ 1: Tổng đề tài đề xuất */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 border-t-4 border-t-blue-600">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Đề tài đề xuất
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {metrics.totalProposedTopics}
            </span>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
              Học kỳ 1
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">
            Từ tất cả các bộ môn trực thuộc
          </p>
        </div>

        {/* Thẻ 2: Chờ Trưởng bộ môn thẩm định */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 border-t-4 border-t-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {approvalStage === 'DEAN' ? 'Chờ phê duyệt cấp 2' : 'Chờ thẩm định cấp 1'}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {approvalStage === 'DEAN' ? metrics.pendingDeanReviewTopics : metrics.pendingHODReviewTopics}
            </span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/80 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
              Cần duyệt
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">
            {approvalStage === 'DEAN'
              ? 'Đã qua Trưởng bộ môn, chờ Ban Chủ nhiệm Khoa'
              : 'Chờ Trưởng bộ môn thẩm định'}
          </p>
        </div>

        {/* Thẻ 3: Sinh viên đã hoàn tất đăng ký */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 border-t-4 border-t-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Sinh viên đăng ký
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {metrics.registeredStudents}
              <span className="text-lg font-normal text-slate-400">/{metrics.totalEligibleStudents}</span>
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {regPercent}%
            </span>
          </div>
          <div className="mt-3 w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, regPercent)}%` }}
            />
          </div>
        </div>

        {/* Thẻ 4: Hội đồng đã thành lập */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 border-t-4 border-t-purple-600">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Hội đồng bảo vệ
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Scale className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {metrics.establishedCouncils}
            </span>
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              Đã thành lập
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">
            Sẵn sàng tổ chức chấm điểm KLTN
          </p>
        </div>
      </div>

      {roleNotice && (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs leading-relaxed text-slate-600">
          {roleNotice}
        </div>
      )}

      {/* 2. CẢNH BÁO ĐIỀU PHỐI (OPERATIONAL ALERTS) */}
      {canReviewTopics && alerts && alerts.length > 0 && (
        <div className="space-y-2.5">
          {alerts.map((alt) => (
            <div
              key={alt.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-blue-200/80 bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-white text-xs shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-[#0043ce]">
                  <BellRing className="h-4 w-4 animate-bounce" />
                </div>
                <span className="font-semibold text-slate-800 text-xs sm:text-sm">{alt.message}</span>
              </div>

              {alt.actionHref && (
                <Link
                  href={alt.actionHref}
                  className="inline-flex items-center gap-1.5 self-end sm:self-auto shrink-0 font-semibold text-white bg-[#0f62fe] hover:bg-[#0043ce] px-3.5 py-1.5 rounded-lg shadow-xs hover:shadow transition-all text-xs"
                >
                  <span>{alt.actionText || 'Xử lý ngay'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 3. KHỐI PHÊ DUYỆT NHANH (PENDING APPROVALS) */}
      {canReviewTopics && <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gradient-to-r from-slate-50/50 to-white">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-amber-500" />
              {approvalStage === 'DEAN'
                ? 'Đề tài chờ Ban Chủ nhiệm Khoa phê duyệt (Cấp 2)'
                : 'Đề tài chờ Trưởng Bộ môn thẩm định (Cấp 1)'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {approvalStage === 'DEAN'
                ? 'Phê duyệt ban hành hoặc từ chối đề tài đã qua thẩm định bộ môn'
                : 'Thẩm định chuyên môn hoặc yêu cầu Giảng viên chỉnh sửa đề cương'}
            </p>
          </div>

          <Link
            href="/management/topics"
            className="inline-flex items-center gap-1 text-xs text-[#0043ce] hover:text-[#0b3fa9] font-bold hover:underline"
          >
            <span>Quản lý toàn bộ đề tài</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/70">
              <TableRow>
                <TableHead className="text-xs font-bold text-slate-600">Tên Đề Tài</TableHead>
                <TableHead className="text-xs font-bold text-slate-600">Giảng Viên Đề Xuất</TableHead>
                <TableHead className="text-xs font-bold text-slate-600">Bộ Môn</TableHead>
                <TableHead className="text-xs font-bold text-slate-600">Ngày Gửi</TableHead>
                <TableHead className="text-xs font-bold text-slate-600 text-right">Thao Tác Duyệt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingTopics.map((top) => (
                <TableRow key={top.id} className="hover:bg-blue-50/30 transition-colors">
                  <TableCell>
                    <div className="font-semibold text-xs text-slate-800 line-clamp-2 max-w-md">
                      {top.titleVi}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-slate-700 whitespace-nowrap">
                    {top.proposerName}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                      {top.departmentName}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                    {top.submittedAt}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        className="inline-flex items-center gap-1 bg-[#0f62fe] hover:bg-[#0043ce] text-white text-xs py-1.5 px-3 rounded-lg font-semibold shadow-xs hover:shadow transition-all disabled:opacity-50"
                        disabled={processingId === top.id}
                        onClick={() => handleApprove(top.id)}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{processingId === top.id ? 'Đang duyệt...' : 'Phê duyệt'}</span>
                      </button>

                      <button
                        className="inline-flex items-center gap-1 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-xs py-1.5 px-3 rounded-lg font-semibold transition-all disabled:opacity-50"
                        disabled={processingId === top.id}
                        onClick={() => handleReject(top.id)}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Từ chối</span>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>}
    </div>
  );
};
