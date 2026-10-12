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

export interface LecturerWorkspaceProps {
  data: LecturerWorkspaceData;
}

export const LecturerWorkspace: React.FC<LecturerWorkspaceProps> = ({ data }) => {
  const { stats, pendingReports, reviewTopics } = data;
  const quotaPercent = Math.round((stats.quotaUsed / stats.quotaMax) * 100);

  return (
    <div className="space-y-5">
      {/* 1. HÀNG 4 THẺ CHỈ SỐ TRỌNG TÂM */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Thẻ 1: Chỉ tiêu hướng dẫn */}
        <Card className="border-utc2-border bg-white shadow-none">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-utc2-text-muted uppercase tracking-wider">
              <span>Chỉ Tiêu Hướng Dẫn</span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-bold text-utc2-text-main">
                {stats.quotaUsed} / {stats.quotaMax}
              </span>
              <span className="text-xs font-semibold text-[#0043ce] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                {quotaPercent}% Quota
              </span>
            </div>
            {/* Thanh Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-[#0f62fe] rounded-full transition-all duration-300"
                style={{ width: `${quotaPercent}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Thẻ 2: Báo cáo tuần chờ duyệt */}
        <Card className="border-utc2-border bg-white shadow-none">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-utc2-text-muted uppercase tracking-wider">
              <span>Báo Cáo Chờ Duyệt</span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-bold text-utc2-text-main">
                {stats.pendingReportsCount}
              </span>
              <span className="text-xs font-medium text-[#0043ce] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                Cần xử lý
              </span>
            </div>
            <p className="text-[11px] text-utc2-text-muted">
              Báo cáo tiến độ tuần sinh viên vừa nộp
            </p>
          </CardContent>
        </Card>

        {/* Thẻ 3: Đề tài phân công phản biện */}
        <Card className="border-utc2-border bg-white shadow-none">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-utc2-text-muted uppercase tracking-wider">
              <span>Phân Công Phản Biện</span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-bold text-utc2-text-main">
                {stats.assignedReviewTopicsCount}
              </span>
              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                Đề tài
              </span>
            </div>
            <p className="text-[11px] text-utc2-text-muted">
              Được phân công từ Trưởng bộ môn
            </p>
          </CardContent>
        </Card>

        {/* Thẻ 4: Lịch Hội đồng bảo vệ */}
        <Card className="border-utc2-border bg-white shadow-none">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-utc2-text-muted uppercase tracking-wider">
              <span>Hội Đồng Bảo Vệ</span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-bold text-utc2-text-main">
                {stats.upcomingCouncilsCount} HĐ
              </span>
              <span className="text-xs font-medium text-[#0043ce] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                Sắp tới
              </span>
            </div>
            <p className="text-[11px] text-utc2-text-muted">
              Lịch gần nhất: {stats.nextCouncilDateText}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 2. LỐI TẮT THAO TÁC (QUICK SHORTCUTS) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-utc2-border">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-utc2-text-main uppercase tracking-wider">
            Thao Tác Nghiệp Vụ:
          </span>
          <span className="text-xs text-utc2-text-muted hidden sm:inline">
            Khởi tạo hoặc tra cứu nhiệm vụ học thuật
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/lecturer/topics"
            className="text-xs font-semibold bg-[#0f62fe] hover:bg-[#0043ce] text-white px-3.5 py-1.5 rounded transition-colors"
          >
            + Đề Xuất Đề Tài Mới
          </Link>

          <Link
            href="/lecturer/councils"
            className="text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3.5 py-1.5 rounded transition-colors"
          >
            Xem Lịch Chấm Hội Đồng
          </Link>
        </div>
      </div>

      {/* 3. BẢNG DANH SÁCH CẦN XỬ LÝ NGAY (ACTION REQUIRED TABLE) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Khối Báo cáo tuần chờ nhận xét (2/3) */}
        <div className="lg:col-span-2">
          <Card className="border-utc2-border bg-white shadow-none">
            <CardHeader className="pb-3 border-b border-utc2-border flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-utc2-text-main">
                  Báo Cáo Tiến Độ Chờ Nhận Xét
                </CardTitle>
                <p className="text-xs text-utc2-text-muted mt-0.5">
                  Sinh viên đang hướng dẫn nộp báo cáo tuần định kỳ
                </p>
              </div>

              <Link
                href="/lecturer/topics"
                className="text-xs text-[#0043ce] hover:underline font-semibold"
              >
                Xem tất cả
              </Link>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sinh Viên</TableHead>
                    <TableHead>Đề Tài</TableHead>
                    <TableHead>Tuần</TableHead>
                    <TableHead>Ngày Nộp</TableHead>
                    <TableHead className="text-right">Hành Động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingReports.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <div className="font-semibold text-xs text-utc2-text-main">
                          {r.studentName}
                        </div>
                        <div className="text-[11px] text-utc2-text-muted font-mono">
                          {r.studentCode}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-slate-800 line-clamp-1 max-w-xs font-medium">
                          {r.topicTitle}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-[11px] text-[#0043ce] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                          Tuần {r.weekNumber}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-utc2-text-muted">
                        {r.submittedAt}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link
                          href={`/lecturer/topics?reportId=${r.id}`}
                          className="inline-block text-xs font-medium text-white bg-[#0f62fe] hover:bg-[#0043ce] px-2.5 py-1 rounded transition-colors"
                        >
                          Nhận xét
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Khối Bài phản biện cần chấm (1/3) */}
        <div>
          <Card className="border-utc2-border bg-white shadow-none h-full">
            <CardHeader className="pb-3 border-b border-utc2-border">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-utc2-text-main">
                Nhiệm Vụ Phản Biện
              </CardTitle>
              <p className="text-xs text-utc2-text-muted mt-0.5">
                Đề tài cần thẩm định & chấm điểm GVPB
              </p>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              {reviewTopics.map((rev) => (
                <div
                  key={rev.id}
                  className="rounded-lg border border-utc2-border bg-slate-50/50 p-3.5 space-y-2 hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-[#0043ce] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                      {rev.topicCode}
                    </span>
                    <span className="text-[11px] text-slate-600 font-medium">
                      Đạo văn: <b className="text-slate-900">{rev.plagiarismRate}%</b>
                    </span>
                  </div>

                  <h5 className="text-xs font-medium text-utc2-text-main line-clamp-2 leading-relaxed">
                    {rev.topicTitle}
                  </h5>

                  <Link
                    href={`/lecturer/reviews?topicId=${rev.id}`}
                    className="block text-center text-xs font-medium text-[#0043ce] bg-white hover:bg-blue-50 border border-blue-200 px-3 py-1.5 rounded transition-colors"
                  >
                    Chấm Điểm Phản Biện
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
