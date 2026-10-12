'use client';

import React from 'react';
import { useStudentTopics } from '@/hooks/use-student-topics';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/feedback/empty-state';

export default function StudentTopicsPage() {
  const {
    filteredTopics,
    myRegistration,
    searchTerm,
    setSearchTerm,
    selectedDept,
    setSelectedDept,
    registeringId,
    message,
    setMessage,
    isLoading,
    handleRegister,
  } = useStudentTopics();

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-utc2-border bg-white p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-semibold text-[#0043ce] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
              Học kỳ 1 - 2026-2027
            </span>
            <span className="text-xs text-utc2-text-muted">
              Đăng ký nguyện vọng đồ án tốt nghiệp
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-utc2-text-main">
            Danh Sách Đề Tài Tốt Nghiệp
          </h1>
          <p className="text-xs text-utc2-text-muted mt-1 leading-relaxed">
            Danh sách đề tài đã qua thẩm định của Bộ môn và Ban Chủ nhiệm Khoa Công nghệ Thông tin.
          </p>
        </div>

        {myRegistration && (
          <div className="text-xs font-medium text-[#0043ce] bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-lg self-start sm:self-auto shadow-sm">
            Đề tài hiện tại: <b>{myRegistration.topicCode}</b>
          </div>
        )}
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

      {/* 2. Thanh tìm kiếm và bộ lọc */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <input
            type="text"
            placeholder="Tìm theo tên đề tài, mã số hoặc tên giảng viên hướng dẫn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs rounded-lg border border-utc2-border px-4 py-2.5 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0f62fe] shadow-sm"
          />
        </div>

        <div>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full text-xs rounded-lg border border-utc2-border px-3.5 py-2.5 bg-white text-slate-800 focus:outline-none focus:border-[#0f62fe] shadow-sm font-medium"
          >
            <option value="ALL">Tất cả các Bộ môn</option>
            <option value="Công nghệ phần mềm">Bộ môn Công nghệ phần mềm</option>
            <option value="Hệ thống thông tin">Bộ môn Hệ thống thông tin</option>
            <option value="Khoa học máy tính">Bộ môn Khoa học máy tính</option>
            <option value="Mạng máy tính">Bộ môn Mạng máy tính & ATTT</option>
          </select>
        </div>
      </div>

      {/* 3. Danh sách Đề tài */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-utc2-text-muted bg-white border border-utc2-border rounded-xl">
          Đang tải danh sách đề tài từ máy chủ...
        </div>
      ) : filteredTopics.length === 0 ? (
        <EmptyState
          title="Không tìm thấy đề tài phù hợp"
          description="Hiện tại không có đề tài nào khớp với từ khóa tìm kiếm hoặc bộ môn bạn đang chọn."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredTopics.map((top) => {
            const isFull = (top.currentStudents || 0) >= top.maxStudents;
            const isMyTopic = myRegistration?.topicId === top.id || myRegistration?.topicCode === top.code;
            const deptText = top.departmentName
              ? top.departmentName.startsWith('Bộ môn')
                ? top.departmentName
                : `Bộ môn ${top.departmentName}`
              : 'Bộ môn CNTT';

            const createdDateText = top.createdAt
              ? new Date(top.createdAt).toLocaleDateString('vi-VN')
              : 'Đã thẩm định';

            return (
              <Card
                key={top.id}
                className="border-utc2-border bg-white shadow-sm hover:border-blue-300 transition-all rounded-xl overflow-hidden"
              >
                <CardHeader className="p-4 sm:p-5 bg-slate-50/40 border-b border-utc2-border">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-[#0043ce] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
                        {top.code}
                      </span>
                      <span className="text-utc2-text-muted font-medium">
                        {deptText}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-medium text-slate-700 bg-white border border-slate-200 px-2.5 py-0.5 rounded">
                        Chỉ tiêu: {top.currentStudents || 0}/{top.maxStudents} SV
                      </span>
                      {isMyTopic ? (
                        <span className="text-xs font-bold text-[#0043ce] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
                          Đang thực hiện
                        </span>
                      ) : isFull ? (
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded">
                          Đã đủ sinh viên
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <CardTitle className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {top.titleVi}
                  </CardTitle>
                  {top.titleEn && (
                    <div className="text-xs text-utc2-text-muted italic mt-0.5">
                      {top.titleEn}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-xs text-utc2-text-muted">
                    <span>GVHD: <b className="text-slate-900">{top.supervisorName}</b></span>
                    <span>•</span>
                    <a
                      href={`mailto:${top.supervisorEmail}`}
                      className="text-[#0043ce] hover:underline font-mono"
                    >
                      {top.supervisorEmail}
                    </a>
                  </div>
                </CardHeader>

                <CardContent className="p-4 sm:p-5 space-y-3.5 text-xs">
                  <div>
                    <div className="font-bold text-slate-800 mb-1 uppercase tracking-wider text-[11px]">
                      Mục tiêu & Nội dung nghiên cứu:
                    </div>
                    <p className="text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                      {top.description}
                    </p>
                  </div>

                  {top.requiredSkills && (
                    <div>
                      <div className="font-bold text-slate-800 mb-1 uppercase tracking-wider text-[11px]">
                        Yêu cầu công nghệ & Kỹ năng tiên quyết:
                      </div>
                      <div className="text-slate-700 font-mono text-[11px] bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
                        {top.requiredSkills}
                      </div>
                    </div>
                  )}

                  <div className="pt-3 flex items-center justify-between border-t border-utc2-border">
                    <span className="text-[11px] text-utc2-text-muted">
                      Ngày công bố: {createdDateText}
                    </span>

                    <div>
                      {isMyTopic ? (
                        <span className="text-xs font-bold text-[#0043ce] bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg inline-block">
                          Đề tài của bạn
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={isFull || !!myRegistration || registeringId === top.id}
                          onClick={() => handleRegister(top.id)}
                          className="text-xs font-semibold text-white bg-[#0f62fe] hover:bg-[#0043ce] disabled:bg-slate-200 disabled:text-slate-500 px-4 py-2 rounded-lg transition-colors shadow-sm"
                        >
                          {registeringId === top.id
                            ? 'Đang gửi yêu cầu...'
                            : isFull
                            ? 'Đã đủ chỉ tiêu'
                            : myRegistration
                            ? 'Đã có đề tài'
                            : 'Đăng Ký Đề Tài'}
                        </button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
