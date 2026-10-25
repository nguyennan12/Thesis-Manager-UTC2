import React from 'react';
import Link from 'next/link';
import { StudentWorkspaceData } from '@/types/dashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  CheckCircle2,
  Clock,
  Circle,
  Calendar,
  FileText,
  Award,
  Mail,
  ArrowRight,
  ShieldCheck,
  User,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

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
    Math.round(((completedMilestones + inProgressMilestones * 0.5) / totalMilestones) * 100),
  );

  const isDefended = registeredTopic?.status === 'COMPLETED';

  return (
    <div className="space-y-6">
      {/* HÀNG 1: Hero Progress Card (2/3) + Next Deadlines (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 1. KHỐI ĐỀ TÀI & TIẾN ĐỘ HIỆN TẠI (2/3) */}
        <div className="lg:col-span-2">
          {registeredTopic ? (
            <div className="h-full rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden flex flex-col justify-between">
              {/* Card Header with Blue Top Line */}
              <div className="p-5 sm:p-6 border-b border-slate-100 border-t-4 border-t-[#0f62fe] bg-gradient-to-r from-slate-50/40 to-white">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0043ce] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                      {registeredTopic.code}
                    </span>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {registeredTopic.type}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${
                      isDefended
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-blue-50 text-[#0043ce] border-blue-200'
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {isDefended
                      ? `Đã bảo vệ xuất sắc • ${registeredTopic.totalWeeks}/${registeredTopic.totalWeeks} tuần`
                      : `Đang thực hiện • Tuần ${registeredTopic.currentWeek}/${registeredTopic.totalWeeks}`}
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-slate-800 leading-snug mt-2">
                  {registeredTopic.titleVi}
                </h2>

                {/* Giảng viên hướng dẫn Info Box */}
                <div className="mt-3.5 flex flex-wrap items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-[#0043ce] shadow-2xs font-bold">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Giảng viên hướng dẫn
                    </div>
                    <div className="font-semibold text-slate-800 flex items-center gap-2">
                      <span>{registeredTopic.supervisor.fullName}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 font-normal">{registeredTopic.supervisor.departmentName}</span>
                    </div>
                  </div>
                  <a
                    href={`mailto:${registeredTopic.supervisor.email}`}
                    className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-[#0043ce] hover:underline bg-white px-2.5 py-1 rounded-md border border-slate-200"
                  >
                    <Mail className="h-3 w-3" />
                    <span className="hidden sm:inline">{registeredTopic.supervisor.email}</span>
                  </a>
                </div>
              </div>

              {/* Progress Stepper Content */}
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-slate-500">
                    Tiến độ 5 chặng nghiên cứu & bảo vệ
                  </span>
                  <span className="font-extrabold text-[#0043ce] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                    Hoàn tất {progressPercent}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full transition-all duration-700"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Stepper with enhanced icons & status badges */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-1">
                  {registeredTopic.milestones.map((m) => {
                    const isCompleted = m.status === 'COMPLETED';
                    const isInProgress = m.status === 'IN_PROGRESS';

                    return (
                      <div
                        key={m.step}
                        className={`p-3 rounded-xl border text-xs transition-all ${
                          isInProgress
                            ? 'bg-blue-50/80 border-blue-300 shadow-xs'
                            : isCompleted
                            ? 'bg-emerald-50/40 border-emerald-200/80'
                            : 'bg-white border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold bg-white border shadow-2xs">
                            {isCompleted ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            ) : isInProgress ? (
                              <Clock className="h-3.5 w-3.5 text-blue-600 animate-spin" />
                            ) : (
                              <Circle className="h-3 w-3 text-slate-400" />
                            )}
                          </span>

                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-700'
                                : isInProgress
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-slate-400'
                            }`}
                          >
                            {isCompleted ? 'Đạt' : isInProgress ? 'Đang làm' : 'Chưa'}
                          </span>
                        </div>

                        <div className={`font-bold leading-snug ${isInProgress ? 'text-[#0043ce]' : 'text-slate-800'}`}>
                          {m.title}
                        </div>

                        <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                          {m.detail}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/60 to-white p-7 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Chưa đăng ký đề tài tốt nghiệp
                </h3>
                <p className="mt-1 text-xs text-slate-600">
                  Vui lòng tra cứu danh sách đề tài đã được thẩm định để đăng ký tham gia nghiên cứu.
                </p>
              </div>

              <Link
                href="/student/topics"
                className="shrink-0 text-xs font-bold bg-[#0f62fe] hover:bg-[#0043ce] text-white px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Xem danh sách đề tài</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* 2. KHỐI NHẮC NHỞ HẠN CHÓT (1/3) */}
        <div>
          <div className="h-full rounded-2xl border border-slate-200/80 bg-white shadow-xs p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#0043ce]">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Mốc Hạn Sắp Tới
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {deadlines.length} mốc
                </span>
              </div>

              <div className="divide-y divide-slate-100 mt-2">
                {deadlines.map((dl) => (
                  <div key={dl.id} className="py-3 first:pt-1 last:pb-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-800 line-clamp-1">
                        {dl.title}
                      </span>
                      <span className="text-[10px] shrink-0 font-bold text-[#0043ce] bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-full">
                        {dl.dueText}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {dl.dateText}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <span className="text-[11px] text-slate-400 font-medium">
                Cập nhật đồng bộ theo lịch Khoa CNTT
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* HÀNG 2: Khối Thao Tác Nhanh Cao Cấp */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <span>⚡ Lối tắt thao tác nhanh</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Thẻ 1 */}
          <Link href="/student/progress" className="block group">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#0043ce] group-hover:scale-110 transition-transform">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-[#0043ce] transition-colors">
                  Nộp Báo Cáo Tuần
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Cập nhật nhật ký công việc nghiên cứu và đính kèm sản phẩm tuần học
              </p>
            </div>
          </Link>

          {/* Thẻ 2 */}
          <Link href="/student/grades" className="block group">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
                  <Award className="h-4 w-4" />
                </div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-[#0043ce] transition-colors">
                  Tra Cứu Điểm & Kết Quả
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Xem điểm quá trình, điểm phản biện và phiếu rubric chấm điểm Hội đồng
              </p>
            </div>
          </Link>

          {/* Thẻ 3 */}
          <a
            href={registeredTopic ? `mailto:${registeredTopic.supervisor.email}` : '#'}
            className="block group"
          >
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-[#0043ce] transition-colors">
                  Gửi Email Cho GVHD
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Liên hệ trao đổi trực tiếp với Thầy/Cô hướng dẫn về tiến độ đề tài
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};
