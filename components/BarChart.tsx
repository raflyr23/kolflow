import React from 'react';

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartData[];
  height?: number;
  showValues?: boolean;
}

export const BarChart = ({ data, height = 200, showValues = true }: BarChartProps) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="w-full">
      <div className="flex items-end gap-3" style={{ height }}>
        {data.map((item, i) => {
          const barHeight = (item.value / maxValue) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              {showValues && (
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  {item.value >= 1000 ? (item.value / 1000).toFixed(1) + 'K' : item.value}
                </span>
              )}
              <div
                className="w-full rounded-t-md animate-grow-height transition-all"
                style={{
                  height: `${barHeight}%`,
                  backgroundColor: item.color || '#0f172a',
                  animationDelay: `${i * 80}ms`,
                  minHeight: item.value > 0 ? '4px' : '0px',
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-3 mt-2 border-t border-slate-100 dark:border-slate-800 pt-2">
        {data.map((item, i) => (
          <div key={i} className="flex-1 min-w-0 text-center">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight block truncate" title={item.label}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};


