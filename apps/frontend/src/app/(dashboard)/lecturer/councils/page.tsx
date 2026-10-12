'use client';

import React from 'react';
import { useLecturerCouncils } from '@/hooks/use-lecturer-councils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { EmptyState } from '@/components/feedback/empty-state';

export default function LecturerCouncilsPage() {
  const { councils, isLoading } = useLecturerCouncils();

  return (
    <div className="space-y-5">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-utc2-border bg-white p-5">
        <div>
          <h1 className="text-xl font-semibold text-utc2-text-main">
            Lịch Chấm Hội Đồng Bảo Vệ Đồ Án
          </h1>
          <p className="text-xs text-utc2-text-muted mt-0.5">
            Danh sách các hội đồng đánh giá khóa luận tốt nghiệp bạn được phân công tham gia
          </p>
        </div>

        <div className="text-xs font-mono font-medium text-[#0043ce] bg-blue-50 border border-blue-200 px-3 py-1.5 rounded self-start sm:self-auto">
          {councils.length} Hội đồng được triệu tập
        </div>
      </div>

      {/* 2. Danh Sách Hội Đồng */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-utc2-text-muted">
          Đang tải thông tin hội đồng bảo vệ từ máy chủ...
        </div>
      ) : councils.length === 0 ? (
        <EmptyState
          title="Chưa có lịch hội đồng"
          description="Hiện tại bạn chưa được phân công tham gia hội đồng chấm khóa luận nào trong đợt này."
        />
      ) : (
        <div className="space-y-5">
          {councils.map((c) => (
            <Card key={c.id} className="border-utc2-border bg-white shadow-none">
              <CardHeader className="pb-3 border-b border-utc2-border">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-xs text-[#0043ce] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                      {c.code}
                    </span>
                    <span className="text-xs font-medium text-slate-700">
                      Phòng: {c.location}
                    </span>
                  </div>

                  <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded">
                    Thời gian: {c.defenseDate}
                  </span>
                </div>

                <CardTitle className="text-base font-semibold text-utc2-text-main leading-snug">
                  {c.name}
                </CardTitle>

                {/* Danh sách thành viên Hội đồng */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 text-xs">
                  {c.members.map((m) => (
                    <div key={m.id} className="flex items-center gap-1.5 text-slate-700">
                      <span className="font-semibold text-slate-900">
                        {m.role === 'PRESIDENT'
                          ? 'Chủ tịch:'
                          : m.role === 'SECRETARY'
                          ? 'Thư ký:'
                          : 'Ủy viên:'}
                      </span>
                      <span>{m.lecturerName}</span>
                    </div>
                  ))}
                </div>
              </CardHeader>

              {/* Bảng Danh sách Sinh viên bảo vệ */}
              <CardContent className="p-0">
                <div className="px-4 py-2 bg-slate-50 border-b border-utc2-border text-[11px] font-bold uppercase tracking-wider text-utc2-text-muted">
                  Danh Sách Sinh Viên Bảo Vệ ({c.students?.length || 0} sinh viên)
                </div>

                {(!c.students || c.students.length === 0) ? (
                  <div className="p-4 text-center text-xs text-utc2-text-muted">
                    Chưa phân công sinh viên vào hội đồng này.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-28">Ca Bảo Vệ</TableHead>
                        <TableHead>Sinh Viên</TableHead>
                        <TableHead>Đề Tài Tốt Nghiệp</TableHead>
                        <TableHead className="w-36">GV Hướng Dẫn</TableHead>
                        <TableHead className="w-28 text-center">Điểm QT / PB</TableHead>
                        <TableHead className="w-28 text-right">Trạng Thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {c.students.map((s) => (
                        <TableRow key={s.registrationId}>
                          <TableCell className="font-mono text-xs text-slate-700">
                            {s.defenseTime || '08:00 - 08:45'}
                          </TableCell>
                          <TableCell>
                            <div className="font-semibold text-xs text-utc2-text-main">
                              {s.studentName}
                            </div>
                            <div className="font-mono text-[11px] text-utc2-text-muted">
                              {s.studentCode}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-slate-800 font-medium">
                            {s.topicTitle}
                          </TableCell>
                          <TableCell className="text-xs text-slate-600">
                            {s.supervisorName}
                          </TableCell>
                          <TableCell className="text-center font-mono text-xs text-slate-700">
                            {s.processGrade?.toFixed(1) || '-'} / {s.reviewerGrade?.toFixed(1) || '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="text-xs font-medium text-[#0043ce] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                              {s.status || 'Chờ bảo vệ'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
