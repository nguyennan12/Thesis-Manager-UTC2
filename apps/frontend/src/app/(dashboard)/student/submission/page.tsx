'use client';

import React from 'react';
import { useStudentSubmission } from '@/hooks/use-student-submission';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function StudentSubmissionPage() {
  const {
    myRegistration,
    plagiarism,
    reportUrl,
    setReportUrl,
    presentationUrl,
    setPresentationUrl,
    sourceCodeUrl,
    setSourceCodeUrl,
    demoUrl,
    setDemoUrl,
    message,
    setMessage,
    isLoading,
    isSubmitting,
    isUploading,
    uploadedReportName,
    uploadedPresentationName,
    uploadFile,
    handleSubmit,
  } = useStudentSubmission();

  const isPlagiarismOk = plagiarism ? plagiarism.similarityPercentage < 20 : true;

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-utc2-border bg-white p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-semibold text-[#0043ce] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
              Chặng 3: Thẩm định toàn văn
            </span>
            <span className="text-xs text-utc2-text-muted">
              Kiểm tra đạo văn Turnitin & Hồ sơ lưu chiểu
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-utc2-text-main">
            Nộp Báo Cáo Toàn Văn & Thẩm Định Đạo Văn
          </h1>
          <p className="text-xs text-utc2-text-muted mt-1 leading-relaxed">
            Nộp bản thuyết minh khóa luận hoàn chỉnh, slide báo cáo, mã nguồn và kết quả quét tỷ lệ trùng lặp học thuật.
          </p>
        </div>

        {myRegistration && (
          <div className="text-xs font-mono font-medium text-[#0043ce] bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-lg self-start sm:self-auto shadow-sm">
            Mã đề tài: <b>{myRegistration.topicCode}</b>
          </div>
        )}
      </div>

      {/* Thông báo */}
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

      {/* 2. Thẻ Đề tài tóm tắt & Kết quả đạo văn Turnitin */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Khối Đề tài (2/3) */}
        <div className="lg:col-span-2">
          <Card className="border-utc2-border bg-white shadow-sm h-full rounded-xl overflow-hidden flex flex-col justify-between">
            <CardHeader className="p-4 sm:p-5 bg-slate-50/40 border-b border-utc2-border">
              <div className="text-xs text-utc2-text-muted mb-1 font-medium">
                Đề tài đang thực hiện
              </div>
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {myRegistration?.topicTitle || 'Đang tải thông tin đề tài...'}
              </CardTitle>
              <div className="text-xs text-utc2-text-muted pt-2">
                GVHD: <b className="text-slate-900">{myRegistration?.supervisorName}</b> • {myRegistration?.departmentName}
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 space-y-3.5 text-xs">
              <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 space-y-2">
                <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Quy định thẩm định hồ sơ toàn văn UTC2:
                </div>
                <ul className="list-disc list-inside text-slate-600 space-y-1.5 leading-relaxed">
                  <li>Tệp thuyết minh phải tuân thủ đúng định dạng quy chuẩn mẫu đồ án tốt nghiệp UTC2 (Font Be Vietnam Pro / Times New Roman, cỡ chữ 13, giãn dòng 1.3).</li>
                  <li>Tỷ lệ trùng lặp qua hệ thống kiểm tra Turnitin không vượt quá <b>20.0%</b> (loại trừ tài liệu tham khảo và trích dẫn hợp lệ).</li>
                  <li>Sau khi hệ thống ghi nhận hồ sơ hợp lệ, GVHD sẽ cho điểm quá trình và Khoa sẽ công bố danh sách bảo vệ Hội đồng.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Khối Đạo văn Turnitin (1/3) */}
        <div>
          <Card className="border-utc2-border bg-white shadow-sm h-full rounded-xl overflow-hidden flex flex-col">
            <CardHeader className="p-4 sm:p-5 bg-slate-50/40 border-b border-utc2-border">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-utc2-text-muted">
                Kiểm Tra Đạo Văn (Turnitin)
              </CardTitle>
              <p className="text-xs text-utc2-text-muted mt-0.5">
                Chỉ số đối sánh học thuật quốc gia
              </p>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 space-y-4 text-xs flex-1 flex flex-col justify-between">
              {isLoading ? (
                <div className="text-center text-utc2-text-muted py-8">
                  Đang tải kết quả phân tích...
                </div>
              ) : plagiarism ? (
                <div className="space-y-4">
                  <div className="text-center py-3 bg-slate-50/50 rounded-lg border border-slate-100">
                    <div className="text-4xl font-extrabold font-mono text-[#0043ce]">
                      {plagiarism.similarityPercentage}%
                    </div>
                    <div className="mt-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          isPlagiarismOk
                            ? 'text-[#0043ce] bg-blue-50 border border-blue-200'
                            : 'text-red-700 bg-red-50 border border-red-200'
                        }`}
                      >
                        {isPlagiarismOk ? 'ĐẠT TIÊU CHUẨN (< 20%)' : 'VƯỢT NGƯỠNG CHO PHÉP (>= 20%)'}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-blue-200 bg-blue-50/40 p-3 text-[11px] text-slate-700 space-y-1.5">
                    <div className="font-bold text-slate-900">Cơ sở dữ liệu đối sánh:</div>
                    <div>• IEEE Xplore & ACM Digital Library</div>
                    <div>• Kho luận văn số trường Đại học GTVT (UTC2 Repository)</div>
                    <div>• Cơ sở dữ liệu tạp chí khoa học toàn quốc</div>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-slate-500 my-auto">
                  Chưa có kết quả quét đạo văn. Hãy nộp tệp báo cáo toàn văn để gửi yêu cầu phân tích Turnitin.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 3. Form Nộp Báo Cáo Toàn Văn */}
      <Card className="border-utc2-border bg-white shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="p-4 sm:p-5 bg-slate-50/40 border-b border-utc2-border">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-utc2-text-muted">
            Biểu Mẫu Nộp Hồ Sơ Khóa Luận Cuối Kỳ
          </CardTitle>
          <p className="text-xs text-utc2-text-muted mt-0.5">
            Cung cấp các tư liệu lưu trữ để Hội đồng chấm điểm và lưu chiểu thư viện
          </p>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-5 text-xs max-w-3xl">
            {/* 1. File Thuyết minh Báo cáo */}
            <div className="space-y-2">
              <label className="block font-semibold text-slate-800">
                1. Báo cáo thuyết minh toàn văn (.pdf / .docx) *
              </label>

              {/* Tải tệp trực tiếp */}
              <div className="rounded-lg border border-dashed border-slate-300 p-4 bg-slate-50/50 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-slate-800">Tải tệp từ máy tính (MinIO Object Storage):</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Hỗ trợ: PDF, DOCX (Dung lượng tối đa 50MB)
                    </p>
                  </div>

                  <label className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer font-medium text-xs shadow-sm self-start sm:self-auto transition-colors">
                    <span>{isUploading ? 'Đang tải lên...' : 'Chọn tệp PDF từ máy tính'}</span>
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      disabled={isUploading}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadFile(file, 'report');
                      }}
                    />
                  </label>
                </div>

                {uploadedReportName && (
                  <div className="rounded-lg bg-blue-50 border border-blue-200 px-3.5 py-2 text-xs text-[#0043ce] flex items-center justify-between">
                    <span>Đã lưu trữ trên hệ thống: <b>{uploadedReportName}</b></span>
                    <span className="font-mono text-[11px] font-bold">Sẵn sàng</span>
                  </div>
                )}
              </div>

              {/* Đường dẫn trực tuyến */}
              <div>
                <span className="text-[11px] text-slate-500 block mb-1">
                  Hoặc nhập liên kết lưu trữ trực tuyến:
                </span>
                <input
                  type="text"
                  required
                  value={reportUrl}
                  onChange={(e) => setReportUrl(e.target.value)}
                  placeholder="https://storage.utc2.edu.vn/... hoặc link Google Drive / OneDrive"
                  className="w-full rounded-lg border border-utc2-border px-3.5 py-2.5 bg-white text-slate-800 focus:outline-none focus:border-[#0f62fe] shadow-sm font-medium"
                />
              </div>
            </div>

            {/* 2. File Slide thuyết trình */}
            <div className="space-y-2">
              <label className="block font-semibold text-slate-800">
                2. Slide thuyết trình bảo vệ (.pptx / .pdf)
              </label>

              <div className="rounded-lg border border-dashed border-slate-300 p-4 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-slate-800">Tải Slide thuyết trình:</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Định dạng PPTX, PDF</p>
                </div>

                <label className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer text-xs self-start sm:self-auto shadow-sm font-medium transition-colors">
                  <span>{isUploading ? 'Đang tải...' : 'Chọn tệp Slide'}</span>
                  <input
                    type="file"
                    accept=".pptx,.pdf"
                    disabled={isUploading}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadFile(file, 'presentation');
                    }}
                  />
                </label>
              </div>

              {uploadedPresentationName && (
                <div className="rounded-lg bg-blue-50 border border-blue-200 px-3.5 py-2 text-xs text-[#0043ce]">
                  Đã tải lên: <b>{uploadedPresentationName}</b>
                </div>
              )}

              <input
                type="text"
                value={presentationUrl}
                onChange={(e) => setPresentationUrl(e.target.value)}
                placeholder="https://canva.com/design/... hoặc link OneDrive..."
                className="w-full rounded-lg border border-utc2-border px-3.5 py-2.5 bg-white text-slate-800 focus:outline-none focus:border-[#0f62fe] shadow-sm font-medium"
              />
            </div>

            {/* 3. Link GitHub */}
            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-800">
                3. Liên kết Kho mã nguồn dự án (GitHub / GitLab repo)
              </label>
              <input
                type="url"
                value={sourceCodeUrl}
                onChange={(e) => setSourceCodeUrl(e.target.value)}
                placeholder="https://github.com/utc2-student/do-an-tot-nghiep"
                className="w-full rounded-lg border border-utc2-border px-3.5 py-2.5 bg-white text-slate-800 focus:outline-none focus:border-[#0f62fe] shadow-sm font-medium"
              />
            </div>

            {/* 4. Link Demo */}
            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-800">
                4. Liên kết Sản phẩm chạy thực tế (Demo Website / Video demo)
              </label>
              <input
                type="url"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="https://demo.utc2.edu.vn hoặc https://youtu.be/..."
                className="w-full rounded-lg border border-utc2-border px-3.5 py-2.5 bg-white text-slate-800 focus:outline-none focus:border-[#0f62fe] shadow-sm font-medium"
              />
            </div>

            <div className="pt-3 border-t border-utc2-border">
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="text-xs font-semibold text-white bg-[#0f62fe] hover:bg-[#0043ce] px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
              >
                {isSubmitting ? 'Đang gửi hồ sơ...' : 'Xác Nhận Nộp Hồ Sơ Toàn Văn'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
