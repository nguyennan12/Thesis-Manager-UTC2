'use client';

import React from 'react';
import { useStudentGrades } from '@/hooks/use-student-grades';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

export default function StudentGradesPage() {
  const {
    myRegistration,
    processGrade,
    reviewerGrade,
    councilGrade,
    finalGrade,
    status,
    rubrics,
    isLoading,
  } = useStudentGrades();

  if (isLoading) {
    return (
      <div className="p-8 text-center text-xs text-utc2-text-muted">
        Đang tải kết quả đánh giá từ máy chủ...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-utc2-border bg-white p-5">
        <div>
          <h1 className="text-xl font-semibold text-utc2-text-main">
            Bảng Điểm & Kết Quả Đồ Án Tốt Nghiệp
          </h1>
          <p className="text-xs text-utc2-text-muted mt-0.5">
            Điểm quá trình GVHD, Điểm phản biện GVPB và Điểm đánh giá Hội đồng bảo vệ
          </p>
        </div>

        <div className="text-xs font-semibold text-[#0043ce] bg-blue-50 border border-blue-200 px-3 py-1.5 rounded self-start sm:self-auto">
          {status}
        </div>
      </div>

      {/* 2. Thẻ Tổng Hợp Điểm Số (4 Thẻ Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Điểm GVHD */}
        <Card className="border-utc2-border bg-white shadow-none">
          <CardContent className="p-4 space-y-1.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-utc2-text-muted">
              Điểm GV Hướng Dẫn (30%)
            </div>
            <div className="text-2xl font-bold text-utc2-text-main">
              {processGrade !== null ? processGrade.toFixed(1) : '—'}
            </div>
            <p className="text-[11px] text-utc2-text-muted">
              Đánh giá quá trình 15 tuần làm việc
            </p>
          </CardContent>
        </Card>

        {/* Điểm GVPB */}
        <Card className="border-utc2-border bg-white shadow-none">
          <CardContent className="p-4 space-y-1.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-utc2-text-muted">
              Điểm GV Phản Biện (20%)
            </div>
            <div className="text-2xl font-bold text-utc2-text-main">
              {reviewerGrade !== null ? reviewerGrade.toFixed(1) : '—'}
            </div>
            <p className="text-[11px] text-utc2-text-muted">
              Thẩm định thuyết minh & mã nguồn
            </p>
          </CardContent>
        </Card>

        {/* Điểm Hội Đồng */}
        <Card className="border-utc2-border bg-white shadow-none">
          <CardContent className="p-4 space-y-1.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-utc2-text-muted">
              Điểm Hội Đồng (50%)
            </div>
            <div className="text-2xl font-bold text-utc2-text-main">
              {councilGrade !== null ? councilGrade.toFixed(1) : '—'}
            </div>
            <p className="text-[11px] text-utc2-text-muted">
              Điểm trung bình các thành viên HĐ
            </p>
          </CardContent>
        </Card>

        {/* Điểm Tổng Kết */}
        <Card className="border-blue-200 bg-blue-50/40 shadow-none">
          <CardContent className="p-4 space-y-1.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0043ce]">
              Điểm Tổng Kết (Thang 10)
            </div>
            <div className="text-2xl font-bold text-[#0043ce]">
              {finalGrade !== null ? `${finalGrade} / 10` : 'Đang chấm'}
            </div>
            <p className="text-[11px] text-slate-600 font-medium">
              {myRegistration?.gradeLetter
                ? `Điểm chữ: ${myRegistration.gradeLetter}`
                : finalGrade !== null
                ? Number(finalGrade) >= 8.5
                  ? 'Xếp loại: Giỏi (Thang 4: 3.7 / Điểm chữ: A)'
                  : 'Xếp loại: Đạt'
                : 'Đang tổng hợp'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Chi Tiết Phiếu Đánh Giá Rubric */}
      <Card className="border-utc2-border bg-white shadow-none">
        <CardHeader className="pb-3 border-b border-utc2-border">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-utc2-text-main">
            Chi Tiết Tiêu Chí Đánh Giá Chuẩn Rubric UTC2
          </CardTitle>
          <p className="text-xs text-utc2-text-muted mt-0.5">
            Theo Quy chế Đào tạo và Quản lý Đồ án Tốt nghiệp Phân hiệu Trường ĐH Giao thông Vận tải tại TP.HCM
          </p>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tiêu Chí Đánh Giá</TableHead>
                <TableHead className="w-24 text-center">Trọng Số</TableHead>
                <TableHead className="w-24 text-center">Điểm Đạt</TableHead>
                <TableHead>Nhận Xét Chi Tiết Của Hội Đồng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rubrics.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium text-xs text-slate-900">
                    {r.criterion}
                  </TableCell>
                  <TableCell className="text-center text-xs font-mono text-slate-600">
                    {r.weight}
                  </TableCell>
                  <TableCell className="text-center font-bold text-xs text-[#0043ce]">
                    {r.actualScore !== null ? `${r.actualScore.toFixed(1)} / ${r.maxScore}` : '—'}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">
                    {r.note}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
