import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'UTC2 - Cổng Quản lý Đồ án Tốt nghiệp',
  description: 'Hệ thống Quản lý Đồ án Tốt nghiệp - Phân hiệu Trường ĐH Giao thông Vận tải tại TP.HCM (UTC2)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-utc2-surface text-utc2-text-main antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
