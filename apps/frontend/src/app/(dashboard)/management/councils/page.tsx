'use client';

import React from 'react';
import { useManagementCouncils } from '@/hooks/use-management-councils';
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

export default function ManagementCouncilsPage() {
  const {
    councils,
    lecturers,
    registrations,
    message,
    setMessage,
    isLoading,
    isSubmitting,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isAssignModalOpen,
    setIsAssignModalOpen,
    targetCouncil,
    councilCode,
    setCouncilCode,
    councilName,
    setCouncilName,
    defenseDate,
    setDefenseDate,
    defenseRoom,
    setDefenseRoom,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    chairmanId,
    setChairmanId,
    secretaryId,
    setSecretaryId,
    memberId,
    setMemberId,
    selectedRegIds,
    setSelectedRegIds,
    handleOpenAssignModal,
    handleCreateCouncil,
    handleAssignStudents,
  } = useManagementCouncils();

  return (
    <div className="space-y-5">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-utc2-border bg-white p-5">
        <div>
          <h1 className="text-xl font-semibold text-utc2-text-main">
            Điều Phối &amp; Thành Lập Hội Đồng Bảo Vệ
          </h1>
          <p className="text-xs text-utc2-text-muted mt-0.5">
            Dành cho Trưởng bộ môn &amp; Giáo vụ khoa: Cơ cấu hội đồng (BR-C2), phòng thi, ca bảo vệ và phân công sinh viên
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="text-xs font-mono font-medium text-[#0043ce] bg-blue-50 border border-blue-200 px-3 py-2 rounded">
            {councils.length} Hội đồng hoạt động
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded text-xs font-semibold text-white bg-[#0f62fe] hover:bg-[#0043ce] transition-colors"
          >
            + Thành Lập Hội Đồng Mới
          </button>
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

      {/* 2. Danh Sách Hội Đồng Điều Hành */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-utc2-text-muted">
          Đang tải dữ liệu hội đồng điều phối từ máy chủ...
        </div>
      ) : councils.length === 0 ? (
        <EmptyState
          title="Chưa thành lập hội đồng"
          description="Hiện tại chưa có quyết định thành lập hội đồng bảo vệ khóa luận nào trong học kỳ này."
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
                    <span className="text-xs font-semibold text-slate-800">
                      Địa điểm: {c.location}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[#0043ce] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
                      Lịch bảo vệ: {c.defenseDate}
                    </span>
                    <button
                      onClick={() => handleOpenAssignModal(c)}
                      className="px-2.5 py-1 rounded text-[11px] font-semibold text-[#0043ce] bg-white border border-blue-200 hover:bg-blue-50 transition-colors"
                    >
                      + Phân Công SV
                    </button>
                  </div>
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
                      <span className="text-utc2-text-muted font-mono text-[11px]">
                        ({m.departmentName || 'CNTT'})
                      </span>
                    </div>
                  ))}
                </div>
              </CardHeader>

              {/* Bảng Danh sách Sinh viên thuộc Hội đồng */}
              <CardContent className="p-0">
                <div className="px-4 py-2 bg-slate-50 border-b border-utc2-border text-[11px] font-bold uppercase tracking-wider text-utc2-text-muted">
                  Sinh Viên Phân Công Bảo Vệ ({c.students?.length || 0} sinh viên)
                </div>

                {(!c.students || c.students.length === 0) ? (
                  <div className="p-4 text-center text-xs text-utc2-text-muted">
                    Chưa phân công sinh viên vào hội đồng này. Bấm &quot;+ Phân Công SV&quot; để bổ sung danh sách bảo vệ.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-utc2-border text-[11px] uppercase tracking-wider text-utc2-text-muted">
                          <TableHead className="py-2.5 px-4 font-semibold">Mã SV</TableHead>
                          <TableHead className="py-2.5 px-4 font-semibold">Họ và tên</TableHead>
                          <TableHead className="py-2.5 px-4 font-semibold">Tên đề tài</TableHead>
                          <TableHead className="py-2.5 px-4 font-semibold">GV Hướng Dẫn</TableHead>
                          <TableHead className="py-2.5 px-4 font-semibold text-center">Ca / Giờ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="divide-y divide-utc2-border text-xs">
                        {c.students.map((st) => (
                          <TableRow key={st.studentCode} className="hover:bg-slate-50/60">
                            <TableCell className="py-2.5 px-4 font-mono font-medium text-slate-700">
                              {st.studentCode}
                            </TableCell>
                            <TableCell className="py-2.5 px-4 font-medium text-utc2-text-main">
                              {st.studentName}
                            </TableCell>
                            <TableCell className="py-2.5 px-4 max-w-xs truncate text-slate-600">
                              {st.topicTitle}
                            </TableCell>
                            <TableCell className="py-2.5 px-4 text-slate-700">
                              {st.supervisorName}
                            </TableCell>
                            <TableCell className="py-2.5 px-4 text-center font-mono text-[11px] text-slate-500">
                              {st.defenseTime || '08:00 - 08:45'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 3. Modal Thành Lập Hội Đồng Mới (BR-C2) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg border border-utc2-border bg-white shadow-xl">
            <div className="border-b border-utc2-border p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-utc2-text-main">
                  Quyết Định Thành Lập Hội Đồng Bảo Vệ ĐATN
                </h3>
                <p className="text-xs text-utc2-text-muted mt-0.5">
                  Quy chế BR-C2: Tối thiểu 3 thành viên (Chủ tịch, Thư ký, Ủy viên)
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                [Đóng]
              </button>
            </div>

            <form onSubmit={handleCreateCouncil} className="p-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Mã Hội đồng:</label>
                  <input
                    type="text"
                    value={councilCode}
                    onChange={(e) => setCouncilCode(e.target.value)}
                    required
                    className="w-full rounded border border-slate-300 px-3 py-2 text-xs focus:border-[#0f62fe] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Phòng bảo vệ:</label>
                  <input
                    type="text"
                    value={defenseRoom}
                    onChange={(e) => setDefenseRoom(e.target.value)}
                    required
                    className="w-full rounded border border-slate-300 px-3 py-2 text-xs focus:border-[#0f62fe] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Tên Hội đồng:</label>
                <input
                  type="text"
                  value={councilName}
                  onChange={(e) => setCouncilName(e.target.value)}
                  required
                  className="w-full rounded border border-slate-300 px-3 py-2 text-xs focus:border-[#0f62fe] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Ngày bảo vệ:</label>
                  <input
                    type="date"
                    value={defenseDate}
                    onChange={(e) => setDefenseDate(e.target.value)}
                    required
                    className="w-full rounded border border-slate-300 px-2 py-1.5 text-xs focus:border-[#0f62fe] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Giờ bắt đầu:</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="w-full rounded border border-slate-300 px-2 py-1.5 text-xs focus:border-[#0f62fe] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Giờ kết thúc:</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    className="w-full rounded border border-slate-300 px-2 py-1.5 text-xs focus:border-[#0f62fe] focus:outline-none"
                  />
                </div>
              </div>

              {/* Cơ cấu nhân sự hội đồng */}
              <div className="rounded border border-blue-200 bg-blue-50/60 p-3 space-y-3">
                <div className="font-semibold text-slate-900">Cơ cấu thành viên (Chuẩn BR-C2):</div>
                <div className="space-y-2 text-slate-700">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">1. Chủ tịch hội đồng:</label>
                    <select
                      value={chairmanId}
                      onChange={(e) => setChairmanId(e.target.value)}
                      className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs focus:border-[#0f62fe] focus:outline-none"
                    >
                      {lecturers.map((l: any) => (
                        <option key={l.id} value={l.id}>
                          {l.degree ? `${l.degree} ` : ''}{l.fullName} ({l.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">2. Thư ký hội đồng:</label>
                    <select
                      value={secretaryId}
                      onChange={(e) => setSecretaryId(e.target.value)}
                      className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs focus:border-[#0f62fe] focus:outline-none"
                    >
                      {lecturers.map((l: any) => (
                        <option key={l.id} value={l.id}>
                          {l.degree ? `${l.degree} ` : ''}{l.fullName} ({l.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">3. Ủy viên hội đồng:</label>
                    <select
                      value={memberId}
                      onChange={(e) => setMemberId(e.target.value)}
                      className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs focus:border-[#0f62fe] focus:outline-none"
                    >
                      {lecturers.map((l: any) => (
                        <option key={l.id} value={l.id}>
                          {l.degree ? `${l.degree} ` : ''}{l.fullName} ({l.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-utc2-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded bg-[#0f62fe] hover:bg-[#0043ce] text-white text-xs font-semibold disabled:opacity-50"
                >
                  {isSubmitting ? 'Đang tạo...' : 'Xác Nhận Thành Lập'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal Phân Công Sinh Viên Vào Hội Đồng (BR-C3 & BR-C4) */}
      {isAssignModalOpen && targetCouncil && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg border border-utc2-border bg-white shadow-xl">
            <div className="border-b border-utc2-border p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-utc2-text-main">
                  Phân Công Sinh Viên Vào {targetCouncil.name}
                </h3>
                <p className="text-xs text-utc2-text-muted mt-0.5">
                  Điều kiện: Sinh viên đã đạt QUALIFIED_DEFENSE (Đạo văn &lt; 20% &amp; GVHD phê duyệt)
                </p>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                [Đóng]
              </button>
            </div>

            <form onSubmit={handleAssignStudents} className="p-4 space-y-4 text-xs">
              <div className="space-y-2">
                <label className="block font-semibold text-slate-800">
                  Chọn sinh viên đủ điều kiện để bổ sung vào ca bảo vệ:
                </label>

                <div className="p-3 rounded border border-slate-200 bg-slate-50 space-y-2 max-h-60 overflow-y-auto">
                  {registrations.length === 0 ? (
                    <div className="text-center py-4 text-xs text-slate-500">
                      Chưa có sinh viên nào trong danh sách đăng ký.
                    </div>
                  ) : (
                    registrations.map((r: any) => (
                      <label
                        key={r.id}
                        className="flex items-start gap-2.5 cursor-pointer p-2.5 bg-white rounded border border-slate-200 hover:bg-blue-50/50"
                      >
                        <input
                          type="checkbox"
                          checked={selectedRegIds.includes(r.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRegIds((prev) => [...prev, r.id]);
                            } else {
                              setSelectedRegIds((prev) => prev.filter((x) => x !== r.id));
                            }
                          }}
                          className="mt-0.5 rounded text-[#0f62fe]"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-900">
                            {r.student?.code} - {r.student?.fullName}
                          </div>
                          <div className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                            Đề tài: {r.topic?.titleVi || r.topic?.titleEn || 'Chưa cập nhật'}
                          </div>
                          <div className="text-[11px] text-[#0043ce] font-medium mt-0.5">
                            Trạng thái: {r.status}
                          </div>
                        </div>
                      </label>
                    ))
                  )}
                </div>
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
                  {isSubmitting ? 'Đang lưu...' : 'Lưu Phân Công'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
