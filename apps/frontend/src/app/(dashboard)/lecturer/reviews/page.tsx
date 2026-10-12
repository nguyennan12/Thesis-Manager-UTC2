'use client';

import React from 'react';
import { useLecturerReviews } from '@/hooks/use-lecturer-reviews';
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

export default function LecturerReviewsPage() {
  const {
    reviews,
    selectedReview,
    setSelectedReview,
    score,
    setScore,
    comment,
    setComment,
    message,
    setMessage,
    isLoading,
    isSubmitting,
    handleOpenScoreModal,
    handleSaveScore,
  } = useLecturerReviews();

  return (
    <div className="space-y-5">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-utc2-border bg-white p-5">
        <div>
          <h1 className="text-xl font-semibold text-utc2-text-main">
            Nhiệm Vụ Chấm Điểm Phản Biện (GVPB)
          </h1>
          <p className="text-xs text-utc2-text-muted mt-0.5">
            Thẩm định báo cáo toàn văn, tỷ lệ đạo văn và đánh giá điểm phản biện (chiếm 20% tổng điểm)
          </p>
        </div>

        <div className="text-xs font-mono font-medium text-[#0043ce] bg-blue-50 border border-blue-200 px-3 py-1.5 rounded self-start sm:self-auto">
          Phân công: {reviews.length} đề tài
        </div>
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

      {/* 2. Bảng Danh Sách Đề Tài Phản Biện */}
      <Card className="border-utc2-border bg-white shadow-none">
        <CardHeader className="pb-3 border-b border-utc2-border">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-utc2-text-main">
            Danh Sách Đề Tài Được Phân Công Phản Biện
          </CardTitle>
          <p className="text-xs text-utc2-text-muted mt-0.5">
            Do Trưởng Bộ môn phân công theo quy định BR-C1 (chống trùng lặp với GVHD)
          </p>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-center text-xs text-utc2-text-muted">
              Đang tải danh sách phân công phản biện từ máy chủ...
            </div>
          ) : reviews.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="Chưa có đề tài phản biện"
                description="Hiện tại bạn chưa có đề tài nào được phân công phản biện trong học kỳ này."
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-28">Mã Đề Tài</TableHead>
                  <TableHead>Tên Đề Tài & Sinh Viên</TableHead>
                  <TableHead className="w-40">GV Hướng Dẫn</TableHead>
                  <TableHead className="w-28 text-center">Đạo Văn</TableHead>
                  <TableHead className="w-28 text-center">Điểm GVPB</TableHead>
                  <TableHead className="w-32 text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((rev) => {
                  const isGraded = rev.status === 'GRADED';

                  return (
                    <TableRow key={rev.id}>
                      <TableCell className="font-mono font-semibold text-xs text-[#0043ce]">
                        {rev.topicCode}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-xs text-slate-900 leading-snug">
                          {rev.topicTitle}
                        </div>
                        <div className="text-[11px] text-utc2-text-muted mt-0.5">
                          Sinh viên: <b className="text-slate-700">{rev.studentName}</b> ({rev.studentCode})
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-700">
                        {rev.supervisorName}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-mono font-medium text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {rev.plagiarismRate || 0}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {isGraded ? (
                          <span className="font-bold font-mono text-xs text-[#0043ce] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                            {rev.score?.toFixed(1)} / 10
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            Chưa chấm
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenScoreModal(rev)}
                          className="text-xs font-semibold text-white bg-[#0f62fe] hover:bg-[#0043ce] px-2.5 py-1 rounded transition-colors"
                        >
                          {isGraded ? 'Sửa Điểm' : 'Chấm Điểm'}
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 3. Modal Chấm Điểm Phản Biện */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg border border-utc2-border bg-white p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-utc2-border pb-3">
              <h3 className="text-base font-semibold text-slate-900">
                Phiếu Đánh Giá Điểm Phản Biện
              </h3>
              <button
                type="button"
                onClick={() => setSelectedReview(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-1 bg-slate-50 p-3 rounded border border-slate-200">
              <div>
                Đề tài: <b className="text-slate-900">{selectedReview.topicTitle}</b>
              </div>
              <div className="text-slate-600">
                Sinh viên thực hiện: {selectedReview.studentName} ({selectedReview.studentCode})
              </div>
              <div className="text-slate-600">
                Tỷ lệ kiểm tra trùng lặp (Đạo văn): <b>{selectedReview.plagiarismRate}%</b>
              </div>
            </div>

            <form onSubmit={handleSaveScore} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Điểm Phản Biện (Thang 10, bước nhảy 0.1) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  required
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="w-full rounded border border-utc2-border px-3 py-2 bg-white text-slate-800 font-mono text-sm focus:outline-none focus:border-[#0f62fe]"
                />
                <span className="text-[11px] text-utc2-text-muted mt-1 block">
                  Điểm phản biện chiếm tỷ trọng 20% trong điểm tổng kết cuối cùng của sinh viên.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nhận xét chi tiết của Giảng viên phản biện *
                </label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Nhận xét về tính cấp thiết, phương pháp giải quyết, kết quả đạt được, ưu điểm và tồn tại của đồ án..."
                  className="w-full rounded border border-utc2-border px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-[#0f62fe]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-utc2-border">
                <button
                  type="button"
                  onClick={() => setSelectedReview(null)}
                  className="px-3.5 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded bg-[#0f62fe] hover:bg-[#0043ce] text-white font-semibold disabled:opacity-50"
                >
                  {isSubmitting ? 'Đang lưu...' : 'Lưu Điểm Phản Biện'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
