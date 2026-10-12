import React from 'react';
import Link from 'next/link';
import { StudentWorkspaceData } from '@/types/dashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export interface StudentWorkspaceProps {
  data: StudentWorkspaceData;
}

export const StudentWorkspace: React.FC<StudentWorkspaceProps> = ({ data }) => {
  const { registeredTopic, deadlines } = data;

  const completedMilestones =
    registeredTopic?.milestones.filter((m) => m.status === 'COMPLETED').length || 0;
  const inProgressMilestones =
    registeredTopic?.milestones.filter((m) => m.status === 'IN_PROGRESS').length || 0;
  const totalMilestones = registeredTopic?.milestones.length || 5;
  const progressPercent = Math.min(
    100,
    Math.round(((completedMilestones + inProgressMilestones * 0.5) / totalMilestones) * 100)
  );

  const isDefended = registeredTopic?.status === 'COMPLETED';

  return (
    <div className="space-y-5">
      {/* HÀNG 1: Hero Progress Card (2/3) + Next Deadlines (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 1. KHỐI ĐỀ TÀI & TIẾN ĐỘ HIỆN TẠI (2/3) */}
        <div className="lg:col-span-2">
          {registeredTopic ? (
            <Card className="h-full border-utc2-border bg-white shadow-none">
              <CardHeader className="pb-3 border-b border-utc2-border">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-semibold text-[#0043ce] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                      {registeredTopic.code}
                    </span>
                    <span className="text-utc2-text-muted">
                      {registeredTopic.type}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-[#0043ce] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
                    {isDefended
                      ? `Đã bảo vệ xuất sắc • ${registeredTopic.totalWeeks}/${registeredTopic.totalWeeks} tuần`
                      : `Đang thực hiện • Tuần ${registeredTopic.currentWeek}/${registeredTopic.totalWeeks}`}
                  </span>
                </div>

                <CardTitle className="text-base sm:text-lg font-semibold text-utc2-text-main leading-snug mt-1">
                  {registeredTopic.titleVi}
                </CardTitle>

                {/* Giảng viên hướng dẫn */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1.5 text-xs text-utc2-text-muted">
                  <span>GVHD: <b className="text-utc2-text-main">{registeredTopic.supervisor.fullName}</b></span>
                  <span>•</span>
                  <span>{registeredTopic.supervisor.departmentName}</span>
                  <span>•</span>
                  <a
                    href={`mailto:${registeredTopic.supervisor.email}`}
                    className="hover:underline text-[#0043ce]"
                  >
                    {registeredTopic.supervisor.email}
                  </a>
                </div>
              </CardHeader>

              <CardContent className="pt-4 pb-5">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-utc2-text-muted">
                    Tiến độ 5 chặng nghiên cứu & bảo vệ
                  </span>
                  <span className="font-bold text-[#0043ce]">
                    Hoàn tất {progressPercent}%
                  </span>
                </div>

                {/* Thanh tiến độ trực quan */}
                <div className="w-full bg-slate-100 rounded-full h-2 mb-4 overflow-hidden">
                  <div
                    className="bg-[#0f62fe] h-full rounded-full transition-all duration-700"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Stepper dạng hộp phẳng tối giản, không icon */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                  {registeredTopic.milestones.map((m) => {
                    const isCompleted = m.status === 'COMPLETED';
                    const isInProgress = m.status === 'IN_PROGRESS';

                    return (
                      <div
                        key={m.step}
                        className={`p-2.5 rounded border text-xs transition-colors ${
                          isInProgress
                            ? 'bg-blue-50/70 border-[#0f62fe] font-medium'
                            : isCompleted
                            ? 'bg-white border-blue-200'
                            : 'bg-white border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className={`font-mono ${isInProgress ? 'text-[#0043ce] font-semibold' : 'text-slate-500'}`}>
                            #{m.step}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                              isCompleted
                                ? 'bg-blue-50 text-[#0043ce] border border-blue-100'
                                : isInProgress
                                ? 'bg-blue-100/70 text-[#0043ce]'
                                : 'text-utc2-text-muted'
                            }`}
                          >
                            {isCompleted ? 'Đạt' : isInProgress ? 'Đang làm' : 'Chưa'}
                          </span>
                        </div>

                        <div className={`font-medium leading-tight ${isInProgress ? 'text-[#0043ce]' : 'text-slate-800'}`}>
                          {m.title}
                        </div>

                        <div className="text-[10px] text-utc2-text-muted mt-1 truncate">
                          {m.detail}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-lg border border-blue-200 bg-blue-50/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Chưa đăng ký đề tài tốt nghiệp
                </h3>
                <p className="mt-1 text-xs text-utc2-text-muted">
                  Vui lòng xem danh sách đề tài đã được thẩm định để đăng ký tham gia.
                </p>
              </div>

              <Link
                href="/student/topics"
                className="shrink-0 text-xs font-semibold bg-[#0f62fe] hover:bg-[#0043ce] text-white px-3.5 py-2 rounded transition-colors"
              >
                Xem danh sách đề tài
              </Link>
            </div>
          )}
        </div>

        {/* 2. KHỐI NHẮC NHỞ HẠN CHÓT (1/3) */}
        <div>
          <Card className="h-full border-utc2-border bg-white shadow-none">
            <CardHeader className="pb-2.5 border-b border-utc2-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-utc2-text-muted">
                  Mốc Hạn Sắp Tới
                </CardTitle>
                <span className="text-[11px] text-utc2-text-muted">
                  {deadlines.length} mốc
                </span>
              </div>
            </CardHeader>

            <CardContent className="pt-3 divide-y divide-utc2-border">
              {deadlines.map((dl) => (
                <div key={dl.id} className="py-2.5 first:pt-0 last:pb-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-medium text-slate-800 line-clamp-1">
                      {dl.title}
                    </span>
                    <span className="text-[11px] shrink-0 font-medium text-[#0043ce] bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded">
                      {dl.dueText}
                    </span>
                  </div>
                  <div className="text-[11px] text-utc2-text-muted">
                    {dl.dateText}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* HÀNG 2: Khối Thao Tác Nhanh (3 Cột) - Không Icon */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-utc2-text-muted mb-2.5">
          Thao Tác Nhanh
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Thẻ 1 */}
          <Link href="/student/progress" className="block group">
            <div className="rounded-lg border border-utc2-border bg-white p-4 hover:border-blue-300 hover:shadow-sm transition-all">
              <div className="text-xs font-semibold text-slate-900 group-hover:text-[#0043ce] transition-colors">
                Nộp Báo Cáo Tuần
              </div>
              <div className="text-[11px] text-utc2-text-muted mt-1 leading-relaxed">
                Cập nhật nhật ký công việc và đính kèm tài liệu tuần 9
              </div>
            </div>
          </Link>

          {/* Thẻ 2 */}
          <Link href="/student/grades" className="block group">
            <div className="rounded-lg border border-utc2-border bg-white p-4 hover:border-blue-300 hover:shadow-sm transition-all">
              <div className="text-xs font-semibold text-slate-900 group-hover:text-[#0043ce] transition-colors">
                Tra Cứu Điểm & Kết Quả
              </div>
              <div className="text-[11px] text-utc2-text-muted mt-1 leading-relaxed">
                Xem điểm quá trình, điểm phản biện và phiếu rubric
              </div>
            </div>
          </Link>

          {/* Thẻ 3 */}
          <a
            href={registeredTopic ? `mailto:${registeredTopic.supervisor.email}` : '#'}
            className="block group"
          >
            <div className="rounded-lg border border-utc2-border bg-white p-4 hover:border-blue-300 hover:shadow-sm transition-all">
              <div className="text-xs font-semibold text-slate-900 group-hover:text-[#0043ce] transition-colors">
                Gửi Email Trao Đổi
              </div>
              <div className="text-[11px] text-utc2-text-muted mt-1 leading-relaxed">
                Liên hệ trực tiếp với Giảng viên hướng dẫn đề tài
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};
