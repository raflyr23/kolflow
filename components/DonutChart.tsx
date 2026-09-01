import React from 'react';

interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
}

export const DonutChart = ({
  data,
  size = 160,
  strokeWidth = 24,
  centerLabel,
  centerValue,
}: DonutChartProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((sum, d) => sum + d.value, 0);

  let cumulativeOffset = 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
          {/* Data segments */}
          {data.map((segment, i) => {
            const segmentLength = total > 0 ? (segment.value / total) * circumference : 0;
            const offset = cumulativeOffset;
            cumulativeOffset += segmentLength;

            return (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
                className="transition-all duration-700 ease-out"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            );
          })}
        </svg>
        {/* Center label */}
        {(centerLabel || centerValue) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {centerValue && <span className="text-xl font-bold text-slate-900">{centerValue}</span>}
            {centerLabel && <span className="text-xs text-slate-500">{centerLabel}</span>}
          </div>
        )}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        {data.map((segment, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
            <span className="text-xs text-slate-600">{segment.label}</span>
            <span className="text-xs font-medium text-slate-900">{segment.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
