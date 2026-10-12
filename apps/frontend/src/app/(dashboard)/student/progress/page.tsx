'use client';

import React, { useState } from 'react';
import { useStudentProgress } from '@/hooks/use-student-progress';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/feedback/empty-state';

export default function StudentProgressPage() {
  const {
    myRegistration,
    reports,
    isModalOpen,
    setIsModalOpen,
    weekNumber,
    setWeekNumber,
    completedTasks,
    setCompletedTasks,
    plannedTasks,
    setPlannedTasks,
    difficulties,
    setDifficulties,
    attachmentUrl,
    setAttachmentUrl,
    message,
    setMessage,
    isLoading,
    isSubmitting,
    handleSubmit,
  } = useStudentProgress();

  const [filterStatus, setFilterStatus] = useState<'ALL' | 'APPROVED' | 'PENDING'>('ALL');
  const [sortOrder, setSortOrder] = useState<'DESC' | 'ASC'>('DESC');

  // Thống kê nhanh
  const totalReports = reports.length;
  const approvedReports = reports.filter((r) => r.status === 'APPROVED').length;
  const pendingReports = reports.filter((r) => r.status === 'PENDING').length;
  const totalWeeks = myRegistration?.totalWeeks || 15;
  const completionPercentage = Math.round((totalReports / totalWeeks) * 100);

  // Lọc và sắp xếp báo cáo
  const filteredReports = reports
    .filter((rep) => {
      if (filterStatus === 'APPROVED') return rep.status === 'APPROVED';
      if (filterStatus === 'PENDING') return rep.status === 'PENDING';
      return true;
    })
    .sort((a, b) => {
      return sortOrder === 'DESC' ? b.weekNumber - a.weekNumber : a.weekNumber - b.weekNumber;
    });

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-utc2-border bg-white p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-semibold text-[#0043ce] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
              Giai đoạn thực hiện
            </span>
            <span className="text-xs text-utc2-text-muted">
              Chu kỳ 15 tuần nghiên cứu
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-utc2-text-main">
            Tiến Độ & Nhật Ký Báo Cáo Tuần
          </h1>
          <p className="text-xs text-utc2-text-muted mt-1 leading-relaxed">
            Ghi nhận kết quả làm việc định kỳ hàng tuần và tiếp nhận nhận xét phản hồi học thuật từ Giảng viên hướng dẫn.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="text-xs font-semibold text-white bg-[#0f62fe] hover:bg-[#0043ce] px-4 py-2.5 rounded-lg transition-colors self-start sm:self-auto shrink-0 shadow-sm"
        >
          + Nộp Báo Cáo Tuần Mới
        </button>
      </div>

      {/* Thông báo thao tác */}
      {message && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-xs text-[#0043ce] flex items-center justify-between shadow-sm">
          <span className="font-medium">• {message}</span>
          <button
            onClick={() => setMessage(null)}
            className="font-bold text-xs hover:underline uppercase tracking-wider text-[#0043ce]"
          >
            Đóng
          </button>
        </div>
      )}

      {/* 2. Thẻ Đề tài & Bảng điều khiển tiến độ trực quan */}
      {myRegistration && (
        <Card className="border-utc2-border bg-white shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/60 p-4 sm:p-5 border-b border-utc2-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-[#0043ce] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
                  {myRegistration.topicCode}
                </span>
                <span className="text-xs text-utc2-text-muted font-medium">
                  {myRegistration.departmentName}
                </span>
              </div>
              <span className="text-xs font-medium text-slate-700 bg-white border border-slate-200 px-2.5 py-0.5 rounded self-start sm:self-auto">
                GVHD: <b className="text-slate-900">{myRegistration.supervisorName}</b>
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {myRegistration.topicTitle}
            </h2>
          </CardHeader>

          <CardContent className="p-4 sm:p-5 space-y-4">
            {/* Grid 3 chỉ số thống kê */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-lg border border-utc2-border bg-slate-50/40 p-3.5">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-utc2-text-muted mb-1">
                  Số tuần đã nộp
                </div>
                <div className="text-2xl font-bold font-mono text-[#0043ce]">
                  {totalReports} / {totalWeeks}
                </div>
                <div className="text-[11px] text-utc2-text-muted mt-1">
                  Hoàn thành {completionPercentage}% chu kỳ
                </div>
              </div>

              <div className="rounded-lg border border-utc2-border bg-slate-50/40 p-3.5">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-utc2-text-muted mb-1">
                  Đã duyệt & Đạt yêu cầu
                </div>
                <div className="text-2xl font-bold font-mono text-[#0043ce]">
                  {approvedReports}
                </div>
                <div className="text-[11px] text-utc2-text-muted mt-1">
                  Đã có đánh giá từ GVHD
                </div>
              </div>

              <div className="rounded-lg border border-utc2-border bg-slate-50/40 p-3.5">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-utc2-text-muted mb-1">
                  Chờ phản hồi
                </div>
                <div className="text-2xl font-bold font-mono text-slate-700">
                  {pendingReports}
                </div>
                <div className="text-[11px] text-utc2-text-muted mt-1">
                  {pendingReports > 0 ? 'GVHD đang thẩm định' : 'Tất cả đã hoàn tất'}
                </div>
              </div>
            </div>

            {/* Thanh đo lường tiến độ đồ án */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700">Tiến độ nộp báo cáo định kỳ</span>
                <span className="font-mono font-bold text-[#0043ce]">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-[#0f62fe] h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, completionPercentage)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 3. Danh sách Báo cáo tuần & Thanh công cụ lọc */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterStatus === 'ALL'
                  ? 'bg-[#0f62fe] text-white shadow-sm'
                  : 'bg-white border border-utc2-border text-slate-600 hover:bg-slate-50'
              }`}
            >
              Tất cả ({reports.length})
            </button>
            <button
              onClick={() => setFilterStatus('APPROVED')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterStatus === 'APPROVED'
                  ? 'bg-[#0f62fe] text-white shadow-sm'
                  : 'bg-white border border-utc2-border text-slate-600 hover:bg-slate-50'
              }`}
            >
              Đã duyệt ({approvedReports})
            </button>
            <button
              onClick={() => setFilterStatus('PENDING')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterStatus === 'PENDING'
                  ? 'bg-[#0f62fe] text-white shadow-sm'
                  : 'bg-white border border-utc2-border text-slate-600 hover:bg-slate-50'
              }`}
            >
              Chờ nhận xét ({pendingReports})
            </button>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-utc2-text-muted">Thứ tự:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'DESC' | 'ASC')}
              className="text-xs rounded border border-utc2-border bg-white px-2.5 py-1 text-slate-700 focus:outline-none focus:border-[#0f62fe]"
            >
              <option value="DESC">Mới nhất trước (Tuần 15 → 1)</option>
              <option value="ASC">Cũ nhất trước (Tuần 1 → 15)</option>
            </select>
          </div>
        </div>

        {/* Nội dung danh sách */}
        {isLoading ? (
          <div className="p-8 text-center text-xs text-utc2-text-muted bg-white border border-utc2-border rounded-xl">
            Đang tải dữ liệu tiến độ từ hệ thống máy chủ...
          </div>
        ) : filteredReports.length === 0 ? (
          <EmptyState
            title="Không tìm thấy báo cáo nào"
            description="Chưa có báo cáo tuần nào phù hợp với bộ lọc đã chọn. Hãy bấm nút '+ Nộp Báo Cáo Tuần Mới' để bổ sung."
          />
        ) : (
          <div className="space-y-4">
            {filteredReports.map((rep) => {
              const isApproved = rep.status === 'APPROVED';
              const isPending = rep.status === 'PENDING';

              return (
                <Card
                  key={rep.id}
                  className="border-utc2-border bg-white shadow-sm hover:border-blue-300 transition-all rounded-xl overflow-hidden"
                >
                  <CardHeader className="py-3.5 px-4 sm:px-5 bg-slate-50/50 border-b border-utc2-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-xs text-[#0043ce] bg-blue-50 border border-blue-200 px-3 py-1 rounded">
                        Tuần {rep.weekNumber < 10 ? `0${rep.weekNumber}` : rep.weekNumber}
                      </span>
                      <span className="text-xs text-utc2-text-muted">
                        Ngày nộp: <b className="text-slate-700">{rep.submittedAt || 'Đã ghi nhận'}</b>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          isApproved
                            ? 'text-[#0043ce] bg-blue-50 border border-blue-200'
                            : isPending
                            ? 'text-slate-700 bg-slate-100 border border-slate-200'
                            : 'text-slate-500 bg-slate-100'
                        }`}
                      >
                        {isApproved ? 'Đã duyệt & Đạt yêu cầu' : isPending ? 'Đang chờ nhận xét' : 'Chưa nộp'}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 sm:p-5 space-y-4 text-xs">
                    {/* 2 Cột: Công việc đã xong vs Kế hoạch tuần tới */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-lg border border-slate-200 bg-slate-50/40 p-3.5 space-y-1.5">
                        <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                          1. Công việc đã hoàn thành trong tuần:
                        </div>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                          {rep.completedTasks || 'Chưa cập nhật nội dung hoàn thành.'}
                        </p>
                      </div>

                      <div className="rounded-lg border border-slate-200 bg-slate-50/40 p-3.5 space-y-1.5">
                        <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                          2. Kế hoạch tuần tiếp theo:
                        </div>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                          {rep.plannedTasks || 'Chưa cập nhật kế hoạch tuần kế tiếp.'}
                        </p>
                      </div>
                    </div>

                    {/* Vướng mắc (nếu có) */}
                    {rep.difficulties && (
                      <div className="rounded-lg border border-slate-200 bg-slate-50/30 p-3 text-slate-700">
                        <span className="font-bold text-slate-800">Vướng mắc / Khó khăn: </span>
                        <span>{rep.difficulties}</span>
                      </div>
                    )}

                    {/* Hộp nhận xét của Giảng viên hướng dẫn */}
                    {rep.supervisorComment ? (
                      <div className="rounded-lg border-l-4 border-l-[#0f62fe] border border-blue-200 bg-blue-50/50 p-4 space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                          <span className="font-bold text-[#0043ce] uppercase tracking-wider">
                            Đánh giá từ GVHD ({myRegistration?.supervisorName || 'Giảng viên hướng dẫn'})
                          </span>
                          {rep.reviewedAt && (
                            <span className="text-utc2-text-muted font-medium">
                              Thời gian nhận xét: {rep.reviewedAt}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-800 leading-relaxed font-medium">
                          {rep.supervisorComment}
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed border-slate-200 p-3 text-center text-slate-400">
                        Giảng viên hướng dẫn chưa ghi nhận xét cho tuần này.
                      </div>
                    )}

                    {/* Tệp đính kèm (nếu có) */}
                    {rep.attachmentUrl && (
                      <div className="pt-2 border-t border-utc2-border flex items-center justify-between">
                        <span className="text-utc2-text-muted">Tài liệu & Mã nguồn đính kèm:</span>
                        <a
                          href={rep.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-[#0043ce] hover:underline"
                        >
                          Mở liên kết đính kèm →
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Modal nộp báo cáo tuần */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-xl border border-utc2-border bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-utc2-border pb-3.5">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Nộp Báo Cáo Tiến Độ Tuần
                </h3>
                <p className="text-xs text-utc2-text-muted mt-0.5">
                  Cập nhật nhật ký tuần để Giảng viên hướng dẫn nắm bắt và chấm tiến độ
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Chọn tuần báo cáo *
                </label>
                <select
                  value={weekNumber}
                  onChange={(e) => setWeekNumber(Number(e.target.value))}
                  className="w-full rounded-lg border border-utc2-border px-3.5 py-2.5 bg-white text-slate-800 focus:outline-none focus:border-[#0f62fe] font-medium"
                >
                  {Array.from({ length: 15 }, (_, i) => i + 1).map((w) => (
                    <option key={w} value={w}>
                      Tuần {w < 10 ? `0${w}` : w}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  1. Nội dung công việc đã hoàn thành trong tuần *
                </label>
                <textarea
                  rows={3}
                  value={completedTasks}
                  onChange={(e) => setCompletedTasks(e.target.value)}
                  placeholder="Mô tả cụ thể những công việc, chương mục, tài liệu hoặc module code đã hoàn thành..."
                  className="w-full rounded-lg border border-utc2-border px-3.5 py-2.5 bg-white text-slate-800 focus:outline-none focus:border-[#0f62fe]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  2. Kế hoạch dự kiến cho tuần tiếp theo *
                </label>
                <textarea
                  rows={2}
                  value={plannedTasks}
                  onChange={(e) => setPlannedTasks(e.target.value)}
                  placeholder="Nhiệm vụ, mục tiêu cụ thể dự kiến thực hiện trong tuần tiếp theo..."
                  className="w-full rounded-lg border border-utc2-border px-3.5 py-2.5 bg-white text-slate-800 focus:outline-none focus:border-[#0f62fe]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  3. Vướng mắc, khó khăn cần GVHD hỗ trợ (nếu có)
                </label>
                <input
                  type="text"
                  value={difficulties}
                  onChange={(e) => setDifficulties(e.target.value)}
                  placeholder="Khó khăn về dữ liệu, phần cứng, tài liệu chuyên sâu..."
                  className="w-full rounded-lg border border-utc2-border px-3.5 py-2.5 bg-white text-slate-800 focus:outline-none focus:border-[#0f62fe]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  4. Liên kết tài liệu / Mã nguồn đính kèm (GitHub, Google Drive)
                </label>
                <input
                  type="url"
                  value={attachmentUrl}
                  onChange={(e) => setAttachmentUrl(e.target.value)}
                  placeholder="https://github.com/... hoặc https://drive.google.com/..."
                  className="w-full rounded-lg border border-utc2-border px-3.5 py-2.5 bg-white text-slate-800 focus:outline-none focus:border-[#0f62fe]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-utc2-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-[#0f62fe] hover:bg-[#0043ce] text-white font-semibold disabled:opacity-50 transition-colors shadow-sm"
                >
                  {isSubmitting ? 'Đang gửi...' : 'Xác Nhận Nộp Báo Cáo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
