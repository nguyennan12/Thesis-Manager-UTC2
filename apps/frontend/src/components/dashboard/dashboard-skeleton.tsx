import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 1. Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-utc2-border pb-5">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-200 rounded-lg" />
          <div className="h-4 w-96 bg-slate-200 rounded-md" />
        </div>
        <div className="h-8 w-48 bg-slate-200 rounded-md" />
      </div>

      {/* 2. Top Grid Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-72 rounded-lg border border-utc2-border bg-white p-6 space-y-4">
          <div className="h-5 w-48 bg-slate-200 rounded" />
          <div className="h-6 w-3/4 bg-slate-200 rounded" />
          <div className="h-4 w-1/2 bg-slate-200 rounded" />
          <div className="h-16 w-full bg-slate-100 rounded-lg mt-6" />
        </div>

        <div className="h-72 rounded-lg border border-utc2-border bg-white p-6 space-y-3">
          <div className="h-5 w-36 bg-slate-200 rounded" />
          <div className="h-14 w-full bg-slate-100 rounded-lg" />
          <div className="h-14 w-full bg-slate-100 rounded-lg" />
          <div className="h-14 w-full bg-slate-100 rounded-lg" />
        </div>
      </div>

      {/* 3. Bottom Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="h-24 rounded-lg border border-utc2-border bg-white p-4" />
        <div className="h-24 rounded-lg border border-utc2-border bg-white p-4" />
        <div className="h-24 rounded-lg border border-utc2-border bg-white p-4" />
      </div>
    </div>
  );
};
