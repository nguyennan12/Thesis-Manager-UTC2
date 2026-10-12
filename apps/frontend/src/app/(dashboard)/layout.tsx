import React from 'react';
import { Header } from '@/components/shared/header';
import { Sidebar } from '@/components/shared/sidebar';
import { Footer } from '@/components/shared/footer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-utc2-surface text-utc2-text-main">
      {/* 1. Header Dùng Chung Trên Cùng */}
      <Header />

      {/* 2. Thân Trang (Sidebar bên trái + Main Content ở giữa) */}
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fadeIn">
          {children}
        </main>
      </div>

      {/* 3. Footer Dùng Chung Dưới Cùng */}
      <Footer />
    </div>
  );
}
