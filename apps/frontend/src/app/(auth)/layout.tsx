import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-utc2-surface p-4 sm:p-6 lg:p-8">
      {children}
    </main>
  );
}
