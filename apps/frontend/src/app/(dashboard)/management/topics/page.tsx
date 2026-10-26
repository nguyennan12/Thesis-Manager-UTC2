'use client';

import React from 'react';
import { useManagementTopics } from '@/hooks/use-management-topics';
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
import { useAuthStore } from '@/stores/use-auth-store';

export default function ManagementTopicsPage() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = Boolean(user?.roles?.includes('ADMIN'));
  const isDean = Boolean(user?.positions?.includes('FACULTY_DEAN') || user?.positions?.includes('BAN_CHU_NHIEM'));
  const isHod = Boolean(user?.positions?.includes('HEAD_OF_DEPARTMENT') || user?.positions?.includes('TRUONG_BO_MON'));
  const canManageTopics = isAdmin || isDean || isHod;
  const approvalStage: 'HOD' | 'DEAN' | 'ADMIN' = isAdmin ? 'ADMIN' : isDean ? 'DEAN' : 'HOD';
  const {
    filteredTopics,
    filterStatus,
    setFilterStatus,
    pendingCount,
    approvedCount,
    processingId,
    message,
    setMessage,
    isLoading,
    isSubmitting,
    isAssignModalOpen,
    setIsAssignModalOpen,
    selectedTopicForReviewer,
    selectedReviewerId,
    setSelectedReviewerId,
    departmentLecturers,
    handleApprove,
    handleReject,
    handleOpenAssignReviewerModal,
    handleAssignReviewerSubmit,
    canAssignReviewer,
  } = useManagementTopics(approvalStage, canManageTopics);

  if (!canManageTopics) {
    return (
      <EmptyState
        title="Bạn không có quyền thẩm định đề tài"
        description="Giáo vụ không duyệt đề tài. Trưởng bộ môn thẩm định cấp 1 trong phạm vi bộ môn; Trưởng Khoa/BCN Khoa phê duyệt cấp 2 trong phạm vi khoa."
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-utc2-border bg-white p-5">
        <div>
          <h1 className="text-xl font-semibold text-utc2-text-main">
            {approvalStage === 'DEAN'
              ? 'Phê Duyệt Đề Tài Cấp Khoa'
              : approvalStage === 'HOD'
              ? 'Thẩm Định Đề Tài Cấp Bộ Môn'
              : 'Quản Lý Quy Trình Đề Tài'}
          </h1>
          <p className="text-xs text-utc2-text-muted mt-0.5">
            {approvalStage === 'DEAN'
              ? 'Ban Chủ nhiệm Khoa phê duyệt cấp 2 các đề tài đã được Trưởng bộ môn thẩm định'
              : approvalStage === 'HOD'
              ? 'Trưởng bộ môn thẩm định cấp 1 các đề tài thuộc bộ môn phụ trách (BR-C1)'
              : 'Quản trị viên hỗ trợ theo dõi hai bước thẩm định đề tài'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold text-[#0043ce] bg-blue-50 border border-blue-200 px-3 py-1.5 rounded">
            Cần duyệt: {pendingCount} đề tài
          </span>
          <span className="text-xs font-medium text-slate-700 bg-slate-100 px-3 py-1.5 rounded">
            Đã duyệt: {approvedCount} đề tài
          </span>
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

      {/* 2. Thanh lọc trạng thái */}
      <div className="flex items-center gap-2 text-xs">
        <span className="font-semibold text-utc2-text-muted uppercase tracking-wider">
          Lọc trạng thái:
        </span>
        <button
          onClick={() => setFilterStatus('ALL')}
          className={`px-3 py-1 rounded transition-colors ${
            filterStatus === 'ALL'
              ? 'bg-[#0f62fe] text-white font-semibold'
              : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => setFilterStatus(approvalStage === 'DEAN' ? 'PENDING_DEAN' : 'PENDING_HOD')}
          className={`px-3 py-1 rounded transition-colors ${
            (approvalStage === 'DEAN' ? filterStatus === 'PENDING_DEAN' : filterStatus === 'PENDING_HOD')
              ? 'bg-[#0f62fe] text-white font-semibold'
              : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
          }`}
        >
          {approvalStage === 'DEAN' ? 'Chờ cấp khoa' : 'Chờ thẩm định'} ({pendingCount})
        </button>
        <button
          onClick={() => setFilterStatus('APPROVED')}
          className={`px-3 py-1 rounded transition-colors ${
            filterStatus === 'APPROVED'
              ? 'bg-[#0f62fe] text-white font-semibold'
              : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
          }`}
        >
          Đã phê duyệt ({approvedCount})
        </button>
      </div>

      {/* 3. Bảng Thẩm Định & Phân Công */}
      <Card className="border-utc2-border bg-white shadow-none">
        <CardHeader className="pb-3 border-b border-utc2-border">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-utc2-text-main">
            Danh Sách Đề Tài Đề Xuất Từ Giảng Viên
          </CardTitle>
          <p className="text-xs text-utc2-text-muted mt-0.5">
            Xem xét mục tiêu, yêu cầu công nghệ và phân công Giảng viên phản biện (GVPB)
          </p>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-center text-xs text-utc2-text-muted">
              Đang tải danh sách đề tài thẩm định từ máy chủ...
            </div>
          ) : filteredTopics.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="Không có đề tài nào"
                description="Hiện tại không có đề tài nào trong danh mục lọc này."
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-28">Mã Đề Tài</TableHead>
                  <TableHead>Tên Đề Tài &amp; Nội Dung</TableHead>
                  <TableHead className="w-36">GV Hướng Dẫn</TableHead>
                  <TableHead className="w-24 text-center">Chỉ Tiêu</TableHead>
                  <TableHead className="w-28 text-center">Trạng Thái</TableHead>
                  <TableHead className="w-56 text-right">Thao Tác Quản Lý</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTopics.map((top) => {
                  const isPending = approvalStage === 'DEAN'
                    ? top.status === 'PENDING_DEAN'
                    : top.status === 'PENDING_HOD' || top.status === 'PENDING_REVIEW' ||
                      (approvalStage === 'ADMIN' && top.status === 'PENDING_DEAN');
                  const isApproved = top.status === 'APPROVED' || top.status === 'ASSIGNED';
                  const isAssigned = top.status === 'ASSIGNED';

                  return (
                    <TableRow key={top.id}>
                      <TableCell className="font-mono font-semibold text-xs text-[#0043ce]">
                        {top.code}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-xs text-slate-900 leading-snug">
                          {top.titleVi}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                          {top.description}
                        </p>
                        {top.reviewerName && (
                          <div className="text-[11px] text-[#0043ce] mt-1 bg-blue-50/60 border border-blue-100 px-2 py-0.5 rounded inline-block">
                            GVPB phản biện: <b>{top.reviewerName}</b>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-slate-700">
                        {top.supervisorName || 'Giảng viên'}
                      </TableCell>
                      <TableCell className="text-center font-mono text-xs text-slate-700">
                        {top.maxStudents} SV
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded ${
                            isAssigned
                              ? 'text-[#0043ce] bg-blue-50 border border-blue-200'
                              : isApproved
                              ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                              : isPending
                              ? 'text-amber-800 bg-amber-50 border border-amber-200'
                              : 'text-slate-600 bg-slate-100 border border-slate-200'
                          }`}
                        >
                          {isAssigned
                            ? 'Đang thực hiện'
                            : isApproved
                            ? 'Đã duyệt'
                            : top.status === 'PENDING_DEAN'
                            ? 'Chờ BCN Khoa'
                            : isPending
                            ? 'Chờ Trưởng BM'
                            : 'Từ chối'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {isPending ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              disabled={processingId === top.id}
                              onClick={() => handleApprove(top.id, top.status)}
                              className="text-xs font-semibold text-white bg-[#0f62fe] hover:bg-[#0043ce] px-2.5 py-1 rounded transition-colors disabled:opacity-50"
                            >
                              {approvalStage === 'DEAN' || top.status === 'PENDING_DEAN'
                                ? 'Phê duyệt cấp 2'
                                : 'Duyệt cấp 1'}
                            </button>
                            <button
                              type="button"
                              disabled={processingId === top.id}
                              onClick={() => handleReject(top.id, top.status)}
                              className="text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 px-2.5 py-1 rounded transition-colors disabled:opacity-50"
                            >
                              Từ chối
                            </button>
                          </div>
                        ) : isApproved && canAssignReviewer ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenAssignReviewerModal(top)}
                              className="text-xs font-semibold text-[#0043ce] bg-blue-50 border border-blue-200 hover:bg-blue-100 px-2.5 py-1 rounded transition-colors"
                            >
                              {top.reviewerName ? 'Đổi GVPB' : '+ Phân Công GVPB'}
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-utc2-text-muted italic">
                            Đã từ chối
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 4. Modal Phân Công Giảng Viên Phản Biện (GVPB - Chuẩn BR-C1) */}
      {isAssignModalOpen && selectedTopicForReviewer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg border border-utc2-border bg-white shadow-xl">
            <div className="border-b border-utc2-border p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-utc2-text-main">
                  Phân Công Giảng Viên Phản Biện (GVPB)
                </h3>
                <p className="text-xs text-utc2-text-muted mt-0.5">
                  Quy định BR-C1: GVPB tuyệt đối không được trùng với Giảng viên hướng dẫn
                </p>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                [Đóng]
              </button>
            </div>

            <form onSubmit={handleAssignReviewerSubmit} className="p-4 space-y-4 text-xs">
              <div className="rounded border border-slate-200 bg-slate-50 p-3 space-y-1">
                <div className="font-semibold text-slate-900 leading-snug">
                  Đề tài: {selectedTopicForReviewer.titleVi}
                </div>
                <div className="text-slate-600">
                  Mã đề tài: <b className="font-mono">{selectedTopicForReviewer.code}</b> • GVHD:{' '}
                  <b className="text-red-700">{selectedTopicForReviewer.supervisorName || 'N/A'}</b>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Chọn Giảng viên phản biện (Trong danh sách giảng viên Bộ môn):
                </label>
                <select
                  value={selectedReviewerId}
                  onChange={(e) => setSelectedReviewerId(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2 text-xs focus:border-[#0f62fe] focus:outline-none"
                  required
                >
                  <option value="">-- Chọn giảng viên phản biện --</option>
                  {departmentLecturers
                    .filter((l) => l.fullName !== selectedTopicForReviewer.supervisorName)
                    .map((lec) => (
                      <option key={lec.id} value={lec.id}>
                        {lec.fullName} ({lec.code}) - {lec.email}
                      </option>
                    ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Hệ thống tự động loại bỏ Giảng viên hướng dẫn khỏi danh sách chọn để bảo đảm tính khách quan.
                </p>
              </div>

              <div className="rounded border border-blue-200 bg-blue-50 p-2.5 text-[11px] text-[#0043ce]">
                Nhiệm vụ GVPB: Nhận xét bản thuyết minh toàn văn, đánh giá độc lập (thang 10, chiếm 20% tổng kết) và đặt câu hỏi phản biện trước hội đồng.
              </div>

              <div className="pt-2 border-t border-utc2-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-3.5 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded bg-[#0f62fe] hover:bg-[#0043ce] text-white text-xs font-semibold disabled:opacity-50"
                >
                  {isSubmitting ? 'Đang lưu...' : 'Lưu Phân Công GVPB'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
