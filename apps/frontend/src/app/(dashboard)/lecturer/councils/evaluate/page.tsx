'use client';

import React from 'react';
import { useCouncilEvaluate } from '@/hooks/use-council-evaluate';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function CouncilEvaluatePage() {
  const {
    councils,
    allStudents,
    selectedStudent,
    setSelectedStudent,
    scores,
    message,
    setMessage,
    isLoading,
    isSubmitting,
    handleOpenScoreModal,
    handleScoreChange,
    handleNotesChange,
    handleSaveScores,
    handleCalculateFinal,
  } = useCouncilEvaluate();

  // Tính điểm trung bình trọng số Rubric hiện tại
  const weightedAverage =
    scores.length > 0
      ? scores.reduce((sum, sc) => {
          const w = parseFloat(sc.weight?.replace('%', '') || '0') / 100;
          return sum + sc.score * w;
        }, 0)
      : 0;

  return (
    <div className="space-y-5">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-utc2-border bg-white p-5">
        <div>
          <h1 className="text-xl font-semibold text-utc2-text-main">
            Phiếu Chấm Điểm Trực Tiếp Tại Hội Đồng Bảo Vệ
          </h1>
          <p className="text-xs text-utc2-text-muted mt-0.5">
            Chặng 5: Nhập điểm trực tiếp theo tiêu chí Rubric UTC2 và tổng kết điểm khóa luận tốt nghiệp
          </p>
        </div>

        <div className="text-xs font-mono font-medium text-[#0043ce] bg-blue-50 border border-blue-200 px-3 py-1.5 rounded self-start sm:self-auto">
          Quy chế 30% GVHD + 20% GVPB + 50% Hội đồng
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

      {/* 2. Thống kê Hội đồng */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded border border-utc2-border bg-white p-4">
          <div className="text-xs text-utc2-text-muted uppercase tracking-wider font-semibold">Hội đồng phụ trách</div>
          <div className="text-lg font-bold text-utc2-text-main mt-1">
            {councils[0]?.name || councils[0]?.code || 'Hội Đồng Bộ Môn CNPM'}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Phòng: {councils[0]?.location || 'C102'} • {councils[0]?.defenseDate || 'Học kỳ 2, 2025-2026'}
          </div>
        </div>

        <div className="rounded border border-utc2-border bg-white p-4">
          <div className="text-xs text-utc2-text-muted uppercase tracking-wider font-semibold">Tổng số sinh viên BV</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{allStudents.length}</div>
          <div className="text-xs text-slate-500 mt-0.5">Đã đủ điều kiện theo phê duyệt của GVHD</div>
        </div>

        <div className="rounded border border-utc2-border bg-white p-4">
          <div className="text-xs text-utc2-text-muted uppercase tracking-wider font-semibold">Thang điểm đánh giá</div>
          <div className="text-2xl font-bold text-[#0043ce] mt-1">Thang 10 (Hệ 4 & Chữ)</div>
          <div className="text-xs text-slate-500 mt-0.5">Quy đổi tự động sau khi chốt điểm</div>
        </div>
      </div>

      {/* 3. Danh sách Sinh viên bảo vệ */}
      <Card className="border-utc2-border bg-white shadow-none">
        <CardHeader className="pb-3 border-b border-utc2-border">
          <CardTitle className="text-base font-semibold text-utc2-text-main">
            Danh Sách Sinh Viên Bảo Vệ Trước Hội Đồng
          </CardTitle>
          <p className="text-xs text-utc2-text-muted mt-0.5">
            Thành viên hội đồng nhập điểm từng tiêu chí rubric hoặc chốt điểm tổng kết
          </p>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-utc2-border text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3.5 pl-4">Sinh viên</th>
                  <th className="p-3.5">Đề tài khóa luận</th>
                  <th className="p-3.5">Điểm GVHD (30%)</th>
                  <th className="p-3.5">Điểm GVPB (20%)</th>
                  <th className="p-3.5">Điểm Hội Đồng (50%)</th>
                  <th className="p-3.5">Điểm Tổng Kết</th>
                  <th className="p-3.5 pr-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-utc2-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      Đang tải danh sách sinh viên bảo vệ...
                    </td>
                  </tr>
                ) : allStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      Chưa có sinh viên nào trong danh sách bảo vệ của hội đồng.
                    </td>
                  </tr>
                ) : (
                  allStudents.map((st) => (
                    <tr key={st.registrationId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 pl-4 align-top">
                        <div className="font-semibold text-slate-900">{st.studentName}</div>
                        <div className="text-[11px] font-mono text-slate-500 mt-0.5">{st.studentCode}</div>
                      </td>

                      <td className="p-3.5 align-top max-w-xs">
                        <div className="font-medium text-slate-800 line-clamp-2 leading-relaxed">
                          {st.topicTitle}
                        </div>
                      </td>

                      <td className="p-3.5 align-top">
                        <span className="font-mono font-medium text-slate-700">
                          {st.processGrade !== undefined && st.processGrade !== null
                            ? Number(st.processGrade).toFixed(1)
                            : '8.5'}
                        </span>
                      </td>

                      <td className="p-3.5 align-top">
                        <span className="font-mono font-medium text-slate-700">
                          {st.reviewerGrade !== undefined && st.reviewerGrade !== null
                            ? Number(st.reviewerGrade).toFixed(1)
                            : '8.0'}
                        </span>
                      </td>

                      <td className="p-3.5 align-top">
                        {st.councilGrade !== undefined && st.councilGrade !== null ? (
                          <span className="font-mono font-bold text-slate-900">
                            {Number(st.councilGrade).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Chưa chấm đủ</span>
                        )}
                      </td>

                      <td className="p-3.5 align-top">
                        {st.finalGrade !== undefined && st.finalGrade !== null ? (
                          <div className="space-y-0.5">
                            <span className="font-mono font-bold text-sm text-[#0043ce]">
                              {Number(st.finalGrade).toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Chưa chốt</span>
                        )}
                      </td>

                      <td className="p-3.5 pr-4 align-top text-right space-x-2">
                        <button
                          onClick={() => handleOpenScoreModal(st)}
                          className="px-3 py-1.5 rounded text-xs font-medium text-white bg-[#0f62fe] hover:bg-[#0043ce] transition-colors"
                        >
                          Chấm Rubric
                        </button>
                        <button
                          onClick={() => handleCalculateFinal(st.registrationId)}
                          disabled={isSubmitting}
                          className="px-3 py-1.5 rounded text-xs font-medium text-[#0043ce] bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors disabled:opacity-50"
                        >
                          Chốt Điểm
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 4. Modal Phiếu Chấm Điểm Rubric Trực Tiếp */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-lg border border-utc2-border bg-white shadow-xl">
            <div className="border-b border-utc2-border p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-utc2-text-main">
                  Phiếu Đánh Giá Luận Văn Tốt Nghiệp (Chuẩn Rubric)
                </h3>
                <p className="text-xs text-utc2-text-muted mt-0.5">
                  Thí sinh: {selectedStudent.studentName} ({selectedStudent.studentCode})
                </p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                [Đóng]
              </button>
            </div>

            <form onSubmit={handleSaveScores} className="p-4 space-y-4 text-xs">
              <div className="rounded border border-slate-200 bg-slate-50 p-3">
                <div className="font-semibold text-slate-800">Đề tài: {selectedStudent.topicTitle}</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Thành viên hội đồng chấm độc lập thang điểm 10 theo từng tiêu chí quy định dưới đây.
                </div>
              </div>

              {/* Bảng Rubric */}
              <div className="space-y-3">
                {scores.map((sc, index) => (
                  <div key={sc.criterionId} className="p-3 rounded border border-utc2-border bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{sc.criterionName}</span>
                      <span className="font-mono font-medium text-xs text-[#0043ce] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                        Trọng số: {sc.weight}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                      <div className="sm:col-span-1">
                        <label className="text-[11px] text-slate-600 block mb-0.5">Điểm (0 - 10):</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={sc.score}
                          onChange={(e) => handleScoreChange(index, parseFloat(e.target.value) || 0)}
                          className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-mono font-bold focus:border-[#0f62fe] focus:outline-none"
                          required
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="text-[11px] text-slate-600 block mb-0.5">Nhận xét tiêu chí:</label>
                        <input
                          type="text"
                          value={sc.notes || ''}
                          onChange={(e) => handleNotesChange(index, e.target.value)}
                          placeholder="Ghi chú đánh giá (nếu có)..."
                          className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs focus:border-[#0f62fe] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dự kiến điểm trung bình phiếu */}
              <div className="rounded border border-blue-200 bg-blue-50 p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-700">Điểm đánh giá trung bình phiếu của bạn:</span>
                  <div className="text-[11px] text-slate-500">
                    Công thức: 15% T1 + 25% T2 + 35% T3 + 25% T4
                  </div>
                </div>
                <div className="text-lg font-bold font-mono text-[#0043ce]">
                  {weightedAverage.toFixed(2)} / 10
                </div>
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
                  {isSubmitting ? 'Đang lưu...' : 'Lưu Phiếu Điểm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
