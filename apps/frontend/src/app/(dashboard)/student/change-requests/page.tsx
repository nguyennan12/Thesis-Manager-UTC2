'use client';

import React from 'react';
import { useChangeRequests } from '@/hooks/use-change-requests';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function StudentChangeRequestsPage() {
  const {
    myRegistration,
    requests,
    isModalOpen,
    setIsModalOpen,
    requestType,
    setRequestType,
    reason,
    setReason,
    newTitle,
    setNewTitle,
    message,
    setMessage,
    isLoading,
    isSubmitting,
    handleCreate,
  } = useChangeRequests();

  const getTypeName = (type: string) => {
    switch (type) {
      case 'CHANGE_TITLE':
        return 'Điều chỉnh tên đề tài';
      case 'CHANGE_TOPIC':
        return 'Đổi sang đề tài khác';
      case 'CHANGE_ADVISOR':
        return 'Thay đổi GVHD';
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-block px-2.5 py-1 rounded text-[11px] font-semibold bg-blue-50 text-[#0043ce] border border-blue-200">
            ĐÃ CHẤP THUẬN
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-block px-2.5 py-1 rounded text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
            TỪ CHỐI
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-block px-2.5 py-1 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
            CHỜ PHÊ DUYỆT
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-utc2-border bg-white p-5">
        <div>
          <h1 className="text-xl font-semibold text-utc2-text-main">
            Đơn Xin Điều Chỉnh Đề Tài &amp; Giảng Viên Hướng Dẫn
          </h1>
          <p className="text-xs text-utc2-text-muted mt-0.5">
            Thực hiện nộp đơn đề nghị cập nhật tên đề tài hoặc chuyển đổi GVHD theo quy chế đào tạo UTC2
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded text-xs font-medium text-white bg-[#0f62fe] hover:bg-[#0043ce] transition-colors self-start sm:self-auto"
        >
          + Tạo Đơn Đề Nghị Mới
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

      {/* 2. Thẻ Đề tài hiện tại & Quy định */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Card className="border-utc2-border bg-white shadow-none h-full">
            <CardHeader className="pb-3 border-b border-utc2-border">
              <div className="text-xs text-utc2-text-muted">Đề tài khóa luận đang thực hiện</div>
              <CardTitle className="text-base font-semibold text-utc2-text-main leading-snug">
                {myRegistration?.topicTitle || 'Đang tải thông tin đề tài...'}
              </CardTitle>
              <div className="text-xs text-utc2-text-muted pt-1">
                Mã số: <b className="font-mono text-slate-800">{myRegistration?.topicCode || 'N/A'}</b> • GVHD:{' '}
                <b className="text-slate-800">{myRegistration?.supervisorName || 'N/A'}</b>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-2 text-xs">
              <div className="rounded border border-slate-200 bg-slate-50 p-3 space-y-1.5">
                <div className="font-semibold text-slate-800">Quy định điều chỉnh đồ án tốt nghiệp:</div>
                <ul className="list-disc list-inside text-slate-600 space-y-1 leading-relaxed">
                  <li>Sinh viên chỉ được nộp đơn đề nghị trước tuần thứ 10 của học kỳ.</li>
                  <li>Mọi yêu cầu điều chỉnh phải được sự thống nhất của GVHD và Trưởng bộ môn phê duyệt.</li>
                  <li>Sau khi được duyệt, hồ sơ đề tài chính thức sẽ được cập nhật trên toàn hệ thống.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-utc2-border bg-white shadow-none h-full">
            <CardHeader className="pb-3 border-b border-utc2-border">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-utc2-text-main">
                Thống Kê Đơn Đã Nộp
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Tổng số đơn:</span>
                <span className="font-mono font-bold text-slate-900">{requests.length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Đã được phê duyệt:</span>
                <span className="font-mono font-bold text-[#0043ce]">
                  {requests.filter((r) => r.status === 'APPROVED').length}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-600">Đang chờ xem xét:</span>
                <span className="font-mono font-bold text-slate-600">
                  {requests.filter((r) => r.status === 'PENDING').length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 3. Bảng Lịch sử Đơn đề nghị */}
      <Card className="border-utc2-border bg-white shadow-none">
        <CardHeader className="pb-3 border-b border-utc2-border">
          <CardTitle className="text-base font-semibold text-utc2-text-main">
            Lịch Sử Các Đơn Đề Nghị Điều Chỉnh
          </CardTitle>
          <p className="text-xs text-utc2-text-muted mt-0.5">
            Theo dõi tiến trình xử lý và ý kiến phê duyệt của Trưởng bộ môn &amp; GVHD
          </p>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-utc2-border text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3.5 pl-4">Ngày nộp</th>
                  <th className="p-3.5">Loại đề nghị</th>
                  <th className="p-3.5">Nội dung thay đổi đề xuất</th>
                  <th className="p-3.5">Lý do xin điều chỉnh</th>
                  <th className="p-3.5">Ý kiến phản hồi</th>
                  <th className="p-3.5 pr-4 text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-utc2-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      Đang tải lịch sử đơn...
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      Bạn chưa nộp đơn xin điều chỉnh nào.
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 pl-4 align-top font-mono text-slate-600">
                        {req.createdAt ? new Date(req.createdAt).toLocaleDateString('vi-VN') : '—'}
                      </td>

                      <td className="p-3.5 align-top">
                        <span className="font-semibold text-slate-800">{getTypeName(req.type)}</span>
                      </td>

                      <td className="p-3.5 align-top max-w-xs">
                        <div className="font-medium text-slate-900 leading-relaxed">
                          {req.requestedData?.newTitle ? (
                            <span>Tên mới: &quot;{req.requestedData.newTitle}&quot;</span>
                          ) : (
                            <span className="text-slate-500">Theo nội dung đính kèm</span>
                          )}
                        </div>
                      </td>

                      <td className="p-3.5 align-top max-w-xs">
                        <div className="text-slate-600 line-clamp-2 leading-relaxed">{req.reason}</div>
                      </td>

                      <td className="p-3.5 align-top">
                        {req.rejectionReason ? (
                          <span className="text-slate-800 italic">{req.rejectionReason}</span>
                        ) : (
                          <span className="text-slate-400 italic">Chưa có ý kiến</span>
                        )}
                      </td>

                      <td className="p-3.5 pr-4 align-top text-right">
                        {getStatusBadge(req.status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 4. Modal Tạo Đơn Mới */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg border border-utc2-border bg-white shadow-xl">
            <div className="border-b border-utc2-border p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-utc2-text-main">
                  Tạo Đơn Xin Điều Chỉnh Khóa Luận Tốt Nghiệp
                </h3>
                <p className="text-xs text-utc2-text-muted mt-0.5">
                  Đơn sẽ được gửi trực tiếp đến GVHD và Trưởng bộ môn thẩm định
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                [Đóng]
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Chọn loại hình điều chỉnh:
                </label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value as any)}
                  className="w-full rounded border border-slate-300 p-2 text-xs focus:border-[#0f62fe] focus:outline-none"
                >
                  <option value="CHANGE_TITLE">Điều chỉnh tên đề tài (Định hướng nghiên cứu chi tiết hơn)</option>
                  <option value="CHANGE_TOPIC">Đổi sang đề tài khác (Trước tuần 6)</option>
                  <option value="CHANGE_ADVISOR">Xin đổi Giảng viên hướng dẫn (Lý do khách quan)</option>
                </select>
              </div>

              {requestType === 'CHANGE_TITLE' && (
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Tên đề tài mới đề xuất:
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Nhập tên đề tài khóa luận mới..."
                    className="w-full rounded border border-slate-300 px-3 py-2 text-xs focus:border-[#0f62fe] focus:outline-none"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Lý do xin điều chỉnh (Cần nêu cụ thể):
                </label>
                <textarea
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Trình bày lý do thực tế (ví dụ: phạm vi công nghệ thay đổi, yêu cầu từ doanh nghiệp hợp tác, dữ liệu thực nghiệm thay đổi...)"
                  className="w-full rounded border border-slate-300 p-2.5 text-xs focus:border-[#0f62fe] focus:outline-none"
                  required
                />
              </div>

              <div className="rounded border border-blue-200 bg-blue-50 p-2.5 text-[11px] text-[#0043ce]">
                Lưu ý: Sau khi nộp đơn, bạn vẫn tiếp tục thực hiện đề tài hiện tại cho đến khi có thông báo phê duyệt chính thức từ Trưởng bộ môn.
              </div>

              <div className="pt-2 border-t border-utc2-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded bg-[#0f62fe] hover:bg-[#0043ce] text-white text-xs font-medium disabled:opacity-50"
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi Đơn Đề Nghị'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
