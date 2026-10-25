'use client';

import React from 'react';
import Link from 'next/link';
import { LecturerWorkspaceData } from '@/types/dashboard';
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
  Users,
  Clock,
  BookOpen,
  Award,
  PlusCircle,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileText,
  UserCheck,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export interface LecturerWorkspaceProps {
  data: LecturerWorkspaceData;
}

export const LecturerWorkspace: React.FC<LecturerWorkspaceProps> = ({ data }) => {
  const { stats, pendingReports, reviewTopics } = data;
  const quotaPercent = Math.min(100, Math.round((stats.quotaUsed / (stats.quotaMax || 1)) * 100));

  return (
    <div className="space-y-6">
      {/* 1. HÀNG 4 THẺ CHỈ SỐ TRỌNG TÂM */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Thẻ 1: Chỉ tiêu hướng dẫn */}
        <Card className="border-t-4 border-t-[#0f62fe] border-slate-200 bg-white shadow-xs hover-lift transition-all">
          <CardContent className="p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Chỉ Tiêu Hướng Dẫn
              </span>
              <div className="p-2 rounded-lg bg-blue-50 text-[#0043ce]">
                <Users className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                {stats.quotaUsed} <span className="text-sm font-normal text-slate-400">/ {stats.quotaMax}</span>
              </span>
              <span className="text-xs font-semibold text-[#0043ce] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-full">
                {quotaPercent}% Quota
              </span>
            </div>

            {/* Thanh Progress Bar */}
            <div className="space-y-1">
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#0f62fe] to-[#0043ce] rounded-full transition-all duration-500"
                  style={{ width: `${quotaPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                {stats.quotaMax - stats.quotaUsed > 0
                  ? `Còn nhận tối đa ${stats.quotaMax - stats.quotaUsed} sinh viên`
                  : 'Đã đạt tối đa chỉ tiêu hướng dẫn'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Thẻ 2: Báo cáo tuần chờ duyệt */}
        <Card className="border-t-4 border-t-amber-500 border-slate-200 bg-white shadow-xs hover-lift transition-all">
          <CardContent className="p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Báo Cáo Chờ Duyệt
              </span>
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                {stats.pendingReportsCount}
              </span>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                Cần phản hồi
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              Tiến độ tuần sinh viên nộp chờ GVHD xác nhận
            </p>
          </CardContent>
        </Card>

        {/* Thẻ 3: Đề tài phân công phản biện */}
        <Card className="border-t-4 border-t-teal-500 border-slate-200 bg-white shadow-xs hover-lift transition-all">
          <CardContent className="p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Phân Công Phản Biện
              </span>
              <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                {stats.assignedReviewTopicsCount}
              </span>
              <span className="text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                Đề tài
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              Nhiệm vụ chấm phản biện từ Trưởng bộ môn
            </p>
          </CardContent>
        </Card>

        {/* Thẻ 4: Lịch Hội đồng bảo vệ */}
        <Card className="border-t-4 border-t-indigo-600 border-slate-200 bg-white shadow-xs hover-lift transition-all">
          <CardContent className="p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Hội Đồng Bảo Vệ
              </span>
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <Award className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                {stats.upcomingCouncilsCount}{' '}
                <span className="text-sm font-normal text-slate-400">hội đồng</span>
              </span>
              <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                Sắp tới
              </span>
            </div>

            <p className="text-[11px] text-slate-500 truncate" title={stats.nextCouncilDateText}>
              Gần nhất: <span className="font-medium text-slate-700">{stats.nextCouncilDateText}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 2. LỐI TẮT THAO TÁC (QUICK SHORTCUTS BAR) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-blue-50/80 via-white to-slate-50 p-4 rounded-xl border border-blue-100 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#0f62fe] text-white">
            <PlusCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Thao Tác Nghiệp Vụ Giảng Viên
            </span>
            <span className="text-[11px] text-slate-500">
              Đề xuất đề tài đợt mới, quản lý nhóm hướng dẫn hoặc tra cứu lịch bảo vệ
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/lecturer/topics"
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r from-[#0f62fe] to-[#0043ce] hover:from-[#0043ce] hover:to-[#002d9c] text-white px-4 py-2 rounded-lg shadow-xs hover:shadow transition-all"
          >
            <span>+ Đề Xuất Đề Tài Mới</span>
          </Link>

          <Link
            href="/lecturer/councils"
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3.5 py-2 rounded-lg shadow-xs transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Lịch Chấm Hội Đồng</span>
          </Link>
        </div>
      </div>

      {/* 3. BẢNG DANH SÁCH CẦN XỬ LÝ NGAY (ACTION REQUIRED SECTIONS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Khối Báo cáo tuần chờ nhận xét (Chiếm 2/3) */}
        <div className="lg:col-span-2">
          <Card className="border-slate-200 bg-white shadow-xs overflow-hidden">
            <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-row items-center justify-between bg-slate-50/50">
              <div>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0043ce]" />
                  Báo Cáo Tiến Độ Chờ Nhận Xét
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sinh viên thuộc nhóm hướng dẫn nộp báo cáo tiến độ định kỳ
                </p>
              </div>

              <Link
                href="/lecturer/topics"
                className="text-xs text-[#0043ce] hover:text-[#002d9c] font-semibold flex items-center gap-1"
              >
                <span>Xem tất cả ({pendingReports.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>

            <CardContent className="p-0">
              {pendingReports.length === 0 ? (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="text-xs font-medium text-slate-600">
                    Tuyệt vời! Hiện tại không có báo cáo tuần nào đang tồn đọng.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                      <TableHead className="font-bold text-slate-600 text-xs">Sinh Viên</TableHead>
                      <TableHead className="font-bold text-slate-600 text-xs">Tên Đề Tài</TableHead>
                      <TableHead className="font-bold text-slate-600 text-xs">Tuần</TableHead>
                      <TableHead className="font-bold text-slate-600 text-xs">Ngày Nộp</TableHead>
                      <TableHead className="text-right font-bold text-slate-600 text-xs">Thao Tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingReports.map((r) => (
                      <TableRow key={r.id} className="hover:bg-blue-50/30 transition-colors">
                        <TableCell>
                          <div className="font-bold text-xs text-slate-900">
                            {r.studentName}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {r.studentCode}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-slate-800 line-clamp-2 max-w-sm font-medium leading-relaxed">
                            {r.topicTitle}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-[11px] text-[#0043ce] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-md inline-block">
                            Tuần {r.weekNumber}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                          {r.submittedAt}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <Link
                            href={`/lecturer/topics?reportId=${r.id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-gradient-to-r from-[#0f62fe] to-[#0043ce] hover:from-[#0043ce] hover:to-[#002d9c] px-3 py-1.5 rounded-md shadow-xs transition-all"
                          >
                            <span>Nhận xét</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Khối Bài phản biện cần chấm (Chiếm 1/3) */}
        <div>
          <Card className="border-slate-200 bg-white shadow-xs h-full flex flex-col">
            <CardHeader className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-600" />
                Nhiệm Vụ Phản Biện
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Đề tài được Trưởng BM phân công thẩm định & chấm điểm
              </p>
            </CardHeader>

            <CardContent className="p-4 space-y-3.5 flex-1">
              {reviewTopics.length === 0 ? (
                <div className="p-6 text-center text-slate-400 space-y-2">
                  <CheckCircle2 className="w-7 h-7 text-teal-500 mx-auto" />
                  <p className="text-xs font-medium text-slate-600">
                    Không có đề tài phản biện nào đang chờ chấm điểm.
                  </p>
                </div>
              ) : (
                reviewTopics.map((rev) => {
                  const isHighPlagiarism = (rev.plagiarismRate || 0) > 20;

                  return (
                    <div
                      key={rev.id}
                      className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-4 space-y-2.5 hover:border-blue-300 hover:bg-blue-50/20 transition-all shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-bold text-[#0043ce] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-md">
                          {rev.topicCode}
                        </span>

                        {isHighPlagiarism ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                            <ShieldAlert className="w-3 h-3 text-rose-600" />
                            Đạo văn: {rev.plagiarismRate}%
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Đạo văn: {rev.plagiarismRate}%
                          </span>
                        )}
                      </div>

                      <h5 className="text-xs font-semibold text-slate-900 line-clamp-2 leading-relaxed">
                        {rev.topicTitle}
                      </h5>

                      <Link
                        href={`/lecturer/reviews?topicId=${rev.id}`}
                        className="inline-flex items-center justify-center gap-1.5 w-full text-xs font-semibold text-[#0043ce] bg-white hover:bg-blue-50 border border-blue-200 hover:border-blue-300 px-3 py-2 rounded-lg transition-all shadow-2xs"
                      >
                        <span>Chấm Điểm Phản Biện</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
