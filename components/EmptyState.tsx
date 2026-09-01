import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  variant?: 'no-data' | 'no-results' | 'error';
}

export const EmptyState = ({ title, description, action, variant = 'no-data' }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {/* CSS-only illustration */}
      <div className="mb-6 relative">
        {variant === 'no-data' && (
          <div className="w-12 h-12 rounded-lg bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center">
            <div className="w-6 h-0.5 bg-slate-300 rounded-full"></div>
          </div>
        )}
        {variant === 'no-results' && (
          <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-slate-300 rounded-full relative">
              <div className="absolute -bottom-1 -right-1 w-2.5 h-0.5 bg-slate-300 rounded-full rotate-45 origin-left"></div>
            </div>
          </div>
        )}
        {variant === 'error' && (
          <div className="w-12 h-12 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center">
            <span className="text-red-400 text-xl font-bold">!</span>
          </div>
        )}
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

