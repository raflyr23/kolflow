import React from 'react';

type EmptyStateVariant = 'no-data' | 'no-results' | 'error' | 'campaign' | 'kol' | 'analytics';

interface EmptyStateProps {
  title: string;
  description: string;
  variant?: EmptyStateVariant;
  action?: React.ReactNode;
}

export const EmptyState = ({ title, description, variant = 'no-data', action }: EmptyStateProps) => {
  const renderIllustration = () => {
    switch (variant) {
      case 'no-results':
        return (
          <div className="w-16 h-16 flex items-center justify-center border-2 border-slate-300 dark:border-slate-600 rounded-full relative">
            <div className="w-8 h-8 border-2 border-slate-400 dark:border-slate-500 rounded-full" />
            <div className="w-3 h-1 bg-slate-400 dark:bg-slate-500 absolute bottom-3 right-2 rotate-45" />
          </div>
        );
      case 'error':
        return (
          <div className="w-16 h-16 flex items-center justify-center relative text-red-500">
            <div className="w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-b-[40px] border-b-red-100 dark:border-b-red-900/30" />
            <div className="absolute font-bold text-xl top-6 text-red-500">!</div>
          </div>
        );
      case 'campaign':
        return (
          <div className="w-16 h-16 grid grid-cols-2 gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="bg-slate-300 dark:bg-slate-600 rounded" />
            <div className="bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="bg-slate-300 dark:bg-slate-600 rounded" />
          </div>
        );
      case 'kol':
        return (
          <div className="w-16 h-16 flex flex-col items-center justify-end overflow-hidden pb-2">
            <div className="w-6 h-6 bg-slate-300 dark:bg-slate-600 rounded-full mb-1" />
            <div className="w-12 h-6 bg-slate-200 dark:bg-slate-700 rounded-t-full" />
          </div>
        );
      case 'analytics':
        return (
          <div className="w-16 h-16 flex items-end justify-center gap-1.5 p-2">
            <div className="w-3 h-6 bg-slate-200 dark:bg-slate-700 rounded-sm" />
            <div className="w-3 h-10 bg-slate-400 dark:bg-slate-500 rounded-sm" />
            <div className="w-3 h-4 bg-slate-300 dark:bg-slate-600 rounded-sm" />
          </div>
        );
      case 'no-data':
      default:
        return (
          <div className="w-16 h-16 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
            <div className="w-8 h-1 bg-slate-300 dark:bg-slate-600 rounded" />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="mb-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-full p-3">
        {renderIllustration()}
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
