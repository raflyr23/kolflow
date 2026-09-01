import React from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
}

export const Tooltip = ({ text, children, position = 'top' }: TooltipProps) => {
  return (
    <div className="relative group inline-flex">
      {children}
      <div
        className={`absolute left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-slate-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50 ${
          position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
        }`}
      >
        {text}
        <div
          className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 ${
            position === 'top' ? '-bottom-1' : '-top-1'
          }`}
        />
      </div>
    </div>
  );
};

