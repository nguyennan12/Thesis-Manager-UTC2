'use client';

import React from 'react';
import { useLecturerQualify } from '@/hooks/use-lecturer-qualify';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function LecturerQualifyPage() {
  const {
    submissions,
    selectedStudent,
    setSelectedStudent,
    isQualified,
    setIsQualified,
    scoreProcess,
    setScoreProcess,
    advisorFeedback,
    setAdvisorFeedback,
    message,
    setMessage,
    isLoading,
    isSubmitting,
    handleOpenModal,
    handleSave,
  } = useLecturerQualify();

  const totalCount = submissions.length;
  const submittedCount = submissions.filter((s) => s.reportSubmissionUrl).length;
  const qualifiedCount = submissions.filter((s) => s.isQualified === true).length;
  const pendingCount = submissions.filter((s) => s.isQualified === null || s.isQualified === undefined).length;

  return (
    <div className="space-y-5">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-utc2-border bg-white p-5">
        <div>
          <h1 className="text-xl font-semibold text-utc2-text-main">
            Duyệt Điều Kiện Bảo Vệ & Điểm Quá Trình
          </h1>
          <p className="text-xs text-utc2-text-muted mt-0.5">
            Chặng 4: Thẩm định hồ sơ toàn văn, kiểm tra tỷ lệ đạo văn Turnitin và quyết định cho phép sinh viên bảo vệ trước hội đồng
          </p>
        </div>

        <div className="text-xs font-mono font-medium text-[#0043ce] bg-blue-50 border border-blue-200 px-3 py-1.5 rounded self-start sm:self-auto">
          Học kỳ 1 • Năm học 2026 - 2027
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

      {/* 2. Thẻ Thống kê nhanh */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded border border-utc2-border bg-white p-4">
          <div className="text-xs text-utc2-text-muted uppercase tracking-wider font-semibold">Tổng sinh viên HD</div>
          <div className="text-2xl font-bold text-utc2-text-main mt-1">{totalCount}</div>
        </div>
        <div className="rounded border border-utc2-border bg-white p-4">
          <div className="text-xs text-utc2-text-muted uppercase tracking-wider font-semibold">Đã nộp toàn văn</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{submittedCount}</div>
        </div>
        <div className="rounded border border-utc2-border bg-white p-4">
          <div className="text-xs text-utc2-text-muted uppercase tracking-wider font-semibold">Đủ điều kiện BV</div>
          <div className="text-2xl font-bold text-[#0043ce] mt-1">{qualifiedCount}</div>
        </div>
        <div className="rounded border border-utc2-border bg-white p-4">
          <div className="text-xs text-utc2-text-muted uppercase tracking-wider font-semibold">Chờ thẩm duyệt</div>
          <div className="text-2xl font-bold text-slate-600 mt-1">{pendingCount}</div>
        </div>
      </div>

      {/* 3. Bảng Danh sách Sinh viên hướng dẫn */}
      <Card className="border-utc2-border bg-white shadow-none">
        <CardHeader className="pb-3 border-b border-utc2-border flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-utc2-text-main">
              Danh Sách Sinh Viên Thực Hiện Khóa Luận
            </CardTitle>
            <p className="text-xs text-utc2-text-muted mt-0.5">
              Căn cứ kết quả 15 tuần làm việc, bản nộp toàn văn và tỷ lệ trùng lặp để cho phép bảo vệ
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-utc2-border text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3.5 pl-4">Sinh viên</th>
                  <th className="p-3.5">Tên đề tài</th>
                  <th className="p-3.5">Hồ sơ toàn văn</th>
                  <th className="p-3.5">Đạo văn (Turnitin)</th>
                  <th className="p-3.5">Điểm quá trình (30%)</th>
                  <th className="p-3.5">Trạng thái bảo vệ</th>
                  <th className="p-3.5 pr-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-utc2-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      Đang tải danh sách sinh viên...
                    </td>
                  </tr>
                ) : submissions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      Chưa có sinh viên nào trong danh sách hướng dẫn.
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub) => {
                    const simPercent = sub.plagiarismRate;
                    const isPlagOk = simPercent !== null && simPercent !== undefined ? simPercent < 20 : true;

                    return (
                      <tr key={sub.registrationId} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5 pl-4 align-top">
                          <div className="font-semibold text-slate-900">{sub.studentName}</div>
                          <div className="text-[11px] font-mono text-slate-500 mt-0.5">{sub.studentCode}</div>
                        </td>

                        <td className="p-3.5 align-top max-w-xs">
                          <div className="font-medium text-slate-800 line-clamp-2 leading-relaxed">
                            {sub.topicTitle}
                          </div>
                        </td>

                        <td className="p-3.5 align-top">
                          {sub.reportSubmissionUrl ? (
                            <div className="space-y-1">
                              <a
                                href={sub.reportSubmissionUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block text-[#0043ce] hover:underline font-medium"
                              >
                                [Tải Thuyết minh PDF]
                              </a>
                              {sub.presentationUrl && (
                                <div>
                                  <a
                                    href={sub.presentationUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-slate-600 hover:underline"
                                  >
                                    [Slide báo cáo]
                                  </a>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Chưa nộp file</span>
                          )}
                        </td>

                        <td className="p-3.5 align-top">
                          {simPercent !== null && simPercent !== undefined ? (
                            <div className="space-y-1">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                                  isPlagOk
                                    ? 'bg-blue-50 text-[#0043ce] border border-blue-200'
                                    : 'bg-red-50 text-red-700 border border-red-200'
                                }`}
                              >
                                {simPercent.toFixed(1)}% {isPlagOk ? '(Hợp lệ)' : '(Vượt ngưỡng)'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Chưa quét</span>
                          )}
                        </td>

                        <td className="p-3.5 align-top">
                          {sub.scoreProcess !== null && sub.scoreProcess !== undefined ? (
                            <span className="font-mono font-bold text-sm text-slate-900">
                              {Number(sub.scoreProcess).toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Chưa chấm</span>
                          )}
                        </td>

                        <td className="p-3.5 align-top">
                          {sub.isQualified === true ? (
                            <span className="inline-block px-2.5 py-1 rounded text-[11px] font-semibold bg-blue-50 text-[#0043ce] border border-blue-200">
                              ĐỦ ĐIỀU KIỆN BẢO VỆ
                            </span>
                          ) : sub.isQualified === false ? (
                            <span className="inline-block px-2.5 py-1 rounded text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
                              DỪNG ĐỀ TÀI / KHÔNG ĐẠT
                            </span>
                          ) : (
                            <span className="inline-block px-2.5 py-1 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                              CHỜ DUYỆT
                            </span>
                          )}
                        </td>

                        <td className="p-3.5 pr-4 align-top text-right">
                          <button
                            onClick={() => handleOpenModal(sub)}
                            className="px-3 py-1.5 rounded text-xs font-medium text-white bg-[#0f62fe] hover:bg-[#0043ce] transition-colors"
                          >
                            Xét Duyệt & Chấm Điểm
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 4. Modal Xét Duyệt & Nhập Điểm Quá Trình */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg border border-utc2-border bg-white shadow-xl">
            <div className="border-b border-utc2-border p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-utc2-text-main">
                  Xét Duyệt Bảo Vệ & Chấm Điểm Quá Trình
                </h3>
                <p className="text-xs text-utc2-text-muted mt-0.5">
                  {selectedStudent.studentName} ({selectedStudent.studentCode})
                </p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                [Đóng]
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 space-y-4 text-xs">
              <div className="rounded border border-slate-200 bg-slate-50 p-3 space-y-1">
                <div className="font-medium text-slate-700">Đề tài: {selectedStudent.topicTitle}</div>
                <div className="text-slate-600">
                  Tỷ lệ đạo văn Turnitin:{' '}
                  <b>
                    {selectedStudent.plagiarismRate !== null && selectedStudent.plagiarismRate !== undefined
                      ? `${selectedStudent.plagiarismRate}%`
                      : 'Chưa có kết quả'}
                  </b>
                </div>
              </div>

              {/* Điều kiện bảo vệ */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1.5">
                  Quyết định điều kiện bảo vệ khóa luận:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsQualified(true)}
                    className={`p-3 rounded border text-left transition-colors ${
                      isQualified
                        ? 'border-blue-500 bg-blue-50 text-[#0043ce] font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>• ĐỦ ĐIỀU KIỆN</div>
                    <div className="text-[11px] font-normal text-slate-500 mt-0.5">
                      Cho phép sinh viên ra hội đồng bảo vệ
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsQualified(false)}
                    className={`p-3 rounded border text-left transition-colors ${
                      !isQualified
                        ? 'border-red-500 bg-red-50 text-red-700 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>• DỪNG ĐỀ TÀI</div>
                    <div className="text-[11px] font-normal text-slate-500 mt-0.5">
                      Không đạt yêu cầu hoặc vi phạm đạo văn
                    </div>
                  </button>
                </div>
              </div>

              {/* Điểm quá trình */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Điểm Quá Trình (Trọng số 30% tổng kết, Thang 10):
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={scoreProcess}
                  onChange={(e) => setScoreProcess(parseFloat(e.target.value) || 0)}
                  className="w-full rounded border border-slate-300 px-3 py-2 text-xs focus:border-[#0f62fe] focus:outline-none"
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Đánh giá dựa trên thái độ, tinh thần trách nhiệm và tiến độ báo cáo 15 tuần.
                </p>
              </div>

              {/* Nhận xét của GVHD */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Nhận xét của Giảng viên hướng dẫn:
                </label>
                <textarea
                  rows={3}
                  value={advisorFeedback}
                  onChange={(e) => setAdvisorFeedback(e.target.value)}
                  placeholder="Nhập nhận xét chi tiết về quá trình nghiên cứu và sản phẩm..."
                  className="w-full rounded border border-slate-300 p-2.5 text-xs focus:border-[#0f62fe] focus:outline-none"
                  required
                />
              </div>

              <div className="pt-2 border-t border-utc2-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="px-3.5 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded bg-[#0f62fe] hover:bg-[#0043ce] text-white text-xs font-medium disabled:opacity-50"
                >
                  {isSubmitting ? 'Đang lưu...' : 'Lưu Xác Nhận'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
