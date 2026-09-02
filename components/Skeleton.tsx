'use client';

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-100 dark:bg-slate-800 rounded-md ${className || ''}`} />
);

export const SkeletonCard = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5">
    <div className="flex items-center gap-3">
      <Skeleton className="w-8 h-8 rounded-full" />
      <Skeleton className="w-24 h-3" />
    </div>
    <Skeleton className="w-20 h-7 mt-3" />
    <Skeleton className="w-32 h-3 mt-2" />
  </div>
);

export const SkeletonChart = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5">
    <Skeleton className="w-40 h-5 mb-6" />
    <div className="flex items-end gap-2 h-40 mt-4">
      <Skeleton className="w-full h-1/3" />
      <Skeleton className="w-full h-2/3" />
      <Skeleton className="w-full h-1/2" />
      <Skeleton className="w-full h-full" />
      <Skeleton className="w-full h-3/4" />
      <Skeleton className="w-full h-1/4" />
    </div>
  </div>
);

export const SkeletonTable = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
    <div className="bg-slate-50 dark:bg-slate-800/50 flex gap-4 p-4">
      <Skeleton className="w-1/4 h-4" />
      <Skeleton className="w-1/4 h-4" />
      <Skeleton className="w-1/4 h-4" />
      <Skeleton className="w-1/4 h-4" />
    </div>
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
          <Skeleton className="w-1/3 h-4" />
          <Skeleton className="w-1/4 h-4" />
          <Skeleton className="w-1/4 h-4" />
        </div>
      ))}
    </div>
  </div>
);
