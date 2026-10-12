'use client';

import React from 'react';
import { useLecturerTopics } from '@/hooks/use-lecturer-topics';
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

export default function LecturerTopicsPage() {
  const {
    topics,
    isModalOpen,
    setIsModalOpen,
    titleVi,
    setTitleVi,
    titleEn,
    setTitleEn,
    description,
    setDescription,
    objectives,
    setObjectives,
    expectedResults,
    setExpectedResults,
    requiredSkills,
    setRequiredSkills,
    maxStudents,
    setMaxStudents,
    message,
    setMessage,
    isLoading,
    isSubmitting,
    handleCreate,
  } = useLecturerTopics();

  return (
    <div className="space-y-5">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-utc2-border bg-white p-5">
        <div>
          <h1 className="text-xl font-semibold text-utc2-text-main">
            Quản Lý Đề Tài & Hướng Dẫn Tốt Nghiệp
          </h1>
          <p className="text-xs text-utc2-text-muted mt-0.5">
            Đề xuất đề tài mới cho học kỳ, theo dõi tiến độ thẩm định của Bộ môn và danh sách sinh viên đăng ký
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="text-xs font-semibold text-white bg-[#0f62fe] hover:bg-[#0043ce] px-3.5 py-2 rounded transition-colors self-start sm:self-auto shrink-0"
        >
          + Đề Xuất Đề Tài Mới
        </button>
      </div>

      {/* Thông báo */}
      {message && (
        <div className="rounded border border-blue-200 bg-blue-50 p-3 text-xs text-[#0043ce] flex items-center justify-between">
          <span>• {message}</span>
          <button onClick={() => setMessage(null)} className="font-bold text-xs hover:underline">
            Đóng
          </button>
        </div>
      )}

      {/* 2. Bảng Danh Sách Đề Tài Đề Xuất */}
      <Card className="border-utc2-border bg-white shadow-none">
        <CardHeader className="pb-3 border-b border-utc2-border flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-utc2-text-main">
              Danh Sách Đề Tài Của Bạn ({topics.length} đề tài)
            </CardTitle>
            <p className="text-xs text-utc2-text-muted mt-0.5">
              Học kỳ 1 - Năm học 2026-2027
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-center text-xs text-utc2-text-muted">
              Đang tải danh sách đề tài từ máy chủ...
            </div>
          ) : topics.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="Chưa có đề tài nào"
                description="Bạn chưa tạo đề xuất đề tài nào trong học kỳ này. Bấm nút '+ Đề Xuất Đề Tài Mới' để khởi tạo."
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-28">Mã Đề Tài</TableHead>
                  <TableHead>Tên Đề Tài</TableHead>
                  <TableHead className="w-32 text-center">Chỉ Tiêu SV</TableHead>
                  <TableHead className="w-40 text-center">Trạng Thái Thẩm Định</TableHead>
                  <TableHead className="w-32 text-right">Ngày Tạo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topics.map((t) => {
                  const isApproved = t.status === 'APPROVED';
                  const isPending = t.status === 'PENDING_HOD';
                  const isRejected = t.status === 'REJECTED';

                  return (
                    <TableRow key={t.id}>
                      <TableCell className="font-mono font-semibold text-xs text-[#0043ce]">
                        {t.code}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-xs text-slate-900 leading-snug">
                          {t.titleVi}
                        </div>
                        {t.titleEn && (
                          <div className="text-[11px] text-utc2-text-muted italic mt-0.5">
                            {t.titleEn}
                          </div>
                        )}
                        {isRejected && t.rejectionReason && (
                          <div className="text-[11px] text-slate-700 bg-slate-50 border border-slate-200 p-1.5 rounded mt-1.5">
                            Lý do yêu cầu sửa: {t.rejectionReason}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center font-mono text-xs text-slate-700">
                        {t.currentStudents || 0} / {t.maxStudents} SV
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded ${
                            isApproved
                              ? 'text-[#0043ce] bg-blue-50 border border-blue-200'
                              : isPending
                              ? 'text-slate-700 bg-slate-100 border border-slate-200'
                              : 'text-slate-600 bg-slate-100'
                          }`}
                        >
                          {isApproved
                            ? 'Đã duyệt'
                            : isPending
                            ? 'Chờ TBM duyệt'
                            : 'Cần chỉnh sửa'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-xs text-utc2-text-muted">
                        {t.createdAt || '15/10/2026'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 3. Modal Đề Xuất Đề Tài Mới */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-lg border border-utc2-border bg-white p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-utc2-border pb-3">
              <h3 className="text-base font-semibold text-slate-900">
                Đề Xuất Đề Tài Tốt Nghiệp Mới
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tên đề tài (Tiếng Việt) *
                </label>
                <input
                  type="text"
                  required
                  value={titleVi}
                  onChange={(e) => setTitleVi(e.target.value)}
                  placeholder="Ví dụ: Xây dựng hệ thống quản lý dữ liệu lớn trên nền tảng đám mây..."
                  className="w-full rounded border border-utc2-border px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-[#0f62fe]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tên đề tài (Tiếng Anh)
                </label>
                <input
                  type="text"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="Ví dụ: Big Data Management System on Cloud Platform..."
                  className="w-full rounded border border-utc2-border px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-[#0f62fe]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mô tả tóm tắt nội dung đề tài *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tóm tắt bối cảnh, lý do chọn đề tài và phạm vi nghiên cứu..."
                  className="w-full rounded border border-utc2-border px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-[#0f62fe]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mục tiêu cần đạt được *
                </label>
                <textarea
                  rows={2}
                  required
                  value={objectives}
                  onChange={(e) => setObjectives(e.target.value)}
                  placeholder="Mục tiêu lý thuyết, mục tiêu sản phẩm ứng dụng..."
                  className="w-full rounded border border-utc2-border px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-[#0f62fe]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Sản phẩm / Kết quả dự kiến bàn giao
                </label>
                <input
                  type="text"
                  value={expectedResults}
                  onChange={(e) => setExpectedResults(e.target.value)}
                  placeholder="Ví dụ: 01 báo cáo thuyết minh ĐATN, 01 ứng dụng Web/Mobile..."
                  className="w-full rounded border border-utc2-border px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-[#0f62fe]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Yêu cầu kỹ năng & Công nghệ
                  </label>
                  <input
                    type="text"
                    value={requiredSkills}
                    onChange={(e) => setRequiredSkills(e.target.value)}
                    placeholder="React, Next.js, Python, Docker..."
                    className="w-full rounded border border-utc2-border px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-[#0f62fe]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Số lượng sinh viên tối đa *
                  </label>
                  <select
                    value={maxStudents}
                    onChange={(e) => setMaxStudents(Number(e.target.value))}
                    className="w-full rounded border border-utc2-border px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-[#0f62fe]"
                  >
                    <option value={1}>1 Sinh viên</option>
                    <option value={2}>2 Sinh viên (Tối đa)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-utc2-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded bg-[#0f62fe] hover:bg-[#0043ce] text-white font-semibold disabled:opacity-50"
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi Thẩm Định'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
