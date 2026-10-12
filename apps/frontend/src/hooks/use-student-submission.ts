'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { registrationService } from '@/services/registration.service';
import { submissionService, PlagiarismResultData } from '@/services/submission.service';

export function useStudentSubmission() {
  const queryClient = useQueryClient();
  const [reportUrl, setReportUrl] = useState('');
  const [presentationUrl, setPresentationUrl] = useState('');
  const [sourceCodeUrl, setSourceCodeUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedReportName, setUploadedReportName] = useState<string | null>(null);
  const [uploadedPresentationName, setUploadedPresentationName] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const uploadFile = async (file: File, target: 'report' | 'presentation'): Promise<string | null> => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Tải tệp lên thất bại');
      }

      if (target === 'report') {
        setReportUrl(data.url);
        setUploadedReportName(data.fileName);
      } else {
        setPresentationUrl(data.url);
        setUploadedPresentationName(data.fileName);
      }

      setMessage(`Đã tải tệp "${data.fileName}" lên kho lưu trữ thành công!`);
      return data.url;
    } catch (err: any) {
      setMessage(`Lỗi tải tệp: ${err.message || 'Không thể tải tệp lên'}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // 1. Fetch hồ sơ đăng ký đề tài của sinh viên
  const { data: myRegistration = null, isLoading: isRegLoading } = useQuery({
    queryKey: ['student-my-reg'],
    queryFn: () => registrationService.getMyRegistration(),
  });

  // 2. Fetch kết quả đạo văn nếu đã nộp
  const { data: plagiarism = null, isLoading: isPlagiarismLoading } = useQuery<PlagiarismResultData | null>({
    queryKey: ['student-plagiarism', myRegistration?.id],
    queryFn: () => submissionService.getPlagiarismResult(myRegistration?.id || ''),
    enabled: !!myRegistration?.id,
  });

  // 3. Mutation nộp báo cáo toàn văn
  const submitMutation = useMutation({
    mutationFn: () =>
      submissionService.submitThesis({
        reportSubmissionUrl: reportUrl,
        presentationUrl: presentationUrl || undefined,
        sourceCodeUrl: sourceCodeUrl || undefined,
        demoUrl: demoUrl || undefined,
      }),
    onSuccess: () => {
      setMessage('Nộp báo cáo toàn văn thành công! Hệ thống đang kích hoạt quét đạo văn Turnitin.');
      queryClient.invalidateQueries({ queryKey: ['student-my-reg'] });
      queryClient.invalidateQueries({ queryKey: ['student-plagiarism'] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Có lỗi xảy ra khi nộp báo cáo toàn văn.';
      setMessage(Array.isArray(msg) ? msg[0] : msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportUrl.trim()) {
      alert('Vui lòng cung cấp liên kết tệp Báo cáo toàn văn (.pdf).');
      return;
    }
    submitMutation.mutate();
  };

  return {
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
    isLoading: isRegLoading || isPlagiarismLoading,
    isSubmitting: submitMutation.isPending,
    isUploading,
    uploadedReportName,
    uploadedPresentationName,
    uploadFile,
    handleSubmit,
  };
}
