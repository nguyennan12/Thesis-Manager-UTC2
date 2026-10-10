import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'UTC2 - Hệ thống Quản lý Đồ án Tốt nghiệp',
  description: 'Hệ thống Quản lý Đồ án Cơ sở & Chuyên ngành - UTC2 DAMS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-slate-50 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
