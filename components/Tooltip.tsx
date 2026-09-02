import React from 'react';

interface TooltipProps {
  content?: string;
  text?: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'right';
}

export const Tooltip = ({ content, text, children, position = 'top' }: TooltipProps) => {
  const label = content || text || '';
  
  return (
    <div className="relative group inline-flex">
      {children}
      <div
        className={`absolute px-2.5 py-1.5 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50 ${
          position === 'top' ? 'bottom-full left-1/2 -translate-x-1/2 mb-2' :
          position === 'bottom' ? 'top-full left-1/2 -translate-x-1/2 mt-2' :
          'left-full top-1/2 -translate-y-1/2 ml-2'
        }`}
      >
        {label}
        <div
          className={`absolute w-2 h-2 bg-slate-900 dark:bg-slate-700 rotate-45 ${
            position === 'top' ? 'left-1/2 -translate-x-1/2 -bottom-1' :
            position === 'bottom' ? 'left-1/2 -translate-x-1/2 -top-1' :
            'top-1/2 -translate-y-1/2 -left-1'
          }`}
        />
      </div>
    </div>
  );
};
