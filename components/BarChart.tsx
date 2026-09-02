'use client';

import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  showValues?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white rounded-lg shadow-lg px-3 py-2 text-xs">
        <p className="font-medium mb-1">{label}</p>
        <p className="text-slate-300">
          Value: <span className="text-white font-medium">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 300,
  showValues = false,
}) => {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-sm text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-xl"
        style={{ height }}
      >
        No data available
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="currentColor" 
            className="text-slate-100 dark:text-slate-800" 
          />
          <XAxis 
            dataKey="label" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 11 }} 
            dy={10}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
          <Bar 
            dataKey="value" 
            radius={[4, 4, 0, 0]} 
            animationDuration={800}
            label={showValues ? { position: 'top', fill: '#94a3b8', fontSize: 11 } : false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || '#3b82f6'} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};
