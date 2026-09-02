'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white rounded-lg shadow-lg px-3 py-2 text-xs">
        <p className="font-medium mb-1">{payload[0].name}</p>
        <p className="text-slate-300">
          Value: <span className="text-white font-medium">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 200,
  strokeWidth = 20,
  centerLabel,
  centerValue,
}) => {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-sm text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-xl"
        style={{ width: size, height: size }}
      >
        No data available
      </div>
    );
  }

  const innerRadius = size / 2 - strokeWidth;
  const outerRadius = size / 2;

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              dataKey="value"
              nameKey="label"
              stroke="none"
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {(centerLabel || centerValue) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {centerValue && (
              <span className="text-2xl font-semibold text-slate-900 dark:text-white">
                {centerValue}
              </span>
            )}
            {centerLabel && (
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                {centerLabel}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              {item.label}
            </span>
            <span className="text-xs text-slate-900 dark:text-white font-medium">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
