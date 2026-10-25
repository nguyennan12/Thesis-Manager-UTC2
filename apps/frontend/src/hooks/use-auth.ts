'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { loginSchema, type LoginFormValues } from '@/validations/auth.schema';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/use-auth-store';
import { safeStorage } from '@/lib/storage';

export function useAuth() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
    mode: 'onTouched',
  });

  const loginMutation = useMutation({
    mutationFn: (values: LoginFormValues) => authService.login(values),
    onSuccess: (data) => {
      setServerError(null);
      setAuth(data.user, data.accessToken);
      if (data.refreshToken) {
        safeStorage.setItem('refresh_token', data.refreshToken);
      }

      // Điều hướng về Bàn Làm Việc Tổng Quan Thông Minh (/dashboard)
      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard';
      } else {
        router.push('/dashboard');
      }
    },
    onError: (error: any) => {
      console.error('[useAuth] Login error details:', error);
      const message =
        error.response?.data?.message ||
        (error.response?.status === 401
          ? 'Tên đăng nhập hoặc mật khẩu không chính xác'
          : error.response?.status === 403
          ? 'Tài khoản của bạn đã bị khóa hoặc chưa được kích hoạt'
          : `Không thể kết nối đến máy chủ: ${error.message || 'Lỗi mạng'}`);
      setServerError(Array.isArray(message) ? message[0] : message);
    },
  });

  const onSubmit = form.handleSubmit(
    (values) => {
      console.log('[useAuth] Submitting login with:', { username: values.username.trim() });
      setServerError(null);
      loginMutation.mutate({
        username: values.username.trim(),
        password: values.password.trim(),
        rememberMe: values.rememberMe,
      });
    },
    (invalidErrors) => {
      console.warn('[useAuth] Form validation errors:', invalidErrors);
    },
  );

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return {
    form,
    register: form.register,
    setValue: form.setValue,
    errors: form.formState.errors,
    isSubmitting: loginMutation.isPending,
    serverError,
    showPassword,
    toggleShowPassword,
    onSubmit,
  };
}
