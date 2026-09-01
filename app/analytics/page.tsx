"use client";

import React, { useMemo } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { useApp } from '../../components/AppProvider';
import { BarChart } from '../../components/BarChart';
import { DonutChart } from '../../components/DonutChart';

import { formatCurrency, formatCurrencyCompact, formatNumber, getInitials, generateAvatarColor, calculateCPE, calculateCPV } from '../../lib/utils';
import { IconTrendingUp, IconDollarSign, IconUsers, IconEye } from '../../components/Icons';

export default function AnalyticsPage() {
  const { campaigns } = useApp();

  const totalBudget = useMemo(() => campaigns.reduce((sum, c) => sum + c.budget, 0), [campaigns]);
  const totalSpent = useMemo(() => campaigns.reduce((sum, c) => sum + c.spent, 0), [campaigns]);
  
  const allKols = useMemo(() => campaigns.flatMap(c => c.kols.map(k => ({ ...k, campaignName: c.name }))), [campaigns]);
  const totalKols = allKols.length;
  const totalViews = useMemo(() => allKols.reduce((sum, k) => sum + (k.views || 0), 0), [allKols]);

  const campaignPerformanceData = useMemo(() => {
    return campaigns.map(c => {
      const views = c.kols.reduce((sum, k) => sum + (k.views || 0), 0);
      let color = '#94a3b8'; // Draft
      if (c.status === 'Active') color = '#3b82f6';
      else if (c.status === 'Completed') color = '#22c55e';
      return { label: c.name, value: views, color };
    }).filter(d => d.value > 0);
  }, [campaigns]);

  const platformDistribution = useMemo(() => {
    const counts = { Instagram: 0, TikTok: 0, YouTube: 0 };
    allKols.forEach(k => {
      if (k.platform === 'Instagram') counts.Instagram++;
      if (k.platform === 'TikTok') counts.TikTok++;
      if (k.platform === 'YouTube') counts.YouTube++;
    });
    return [
      { label: 'Instagram', value: counts.Instagram, color: '#e1306c' },
      { label: 'TikTok', value: counts.TikTok, color: '#000000' },
      { label: 'YouTube', value: counts.YouTube, color: '#ff0000' },
    ].filter(d => d.value > 0);
  }, [allKols]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allKols.forEach(k => {
      counts[k.status] = (counts[k.status] || 0) + 1;
    });
    return counts;
  }, [allKols]);

  const statusColors: Record<string, string> = {
    'Contacted': '#94a3b8',
    'Negotiating': '#f59e0b',
    'Content Review': '#8b5cf6',
    'Published': '#22c55e',
    'Rejected': '#ef4444'
  };

  const topKols = useMemo(() => {
    return [...allKols].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 10);
  }, [allKols]);

  const budgetUtilizationData = useMemo(() => {
    return campaigns.map(c => {
      const util = c.budget > 0 ? (c.spent / c.budget) * 100 : 0;
      return { label: c.name, value: Math.round(util), color: util > 100 ? '#ef4444' : '#6366f1' };
    });
  }, [campaigns]);

  return (
    <DashboardLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-slate-900 dark:text-white truncate">Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400">Cross-campaign performance insights and metrics</p>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800/60 dark:border-slate-800/60 min-w-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <IconDollarSign className="w-5 h-5 text-slate-900 dark:text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 truncate">Total Budget</p>
                <div className="text-2xl font-medium tracking-tight text-slate-900 dark:text-white truncate" title={formatCurrency(totalBudget)}>{formatCurrencyCompact(totalBudget)}</div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800/60 dark:border-slate-800/60 min-w-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                <IconTrendingUp className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 truncate">Total Spent</p>
                <div className="text-2xl font-medium tracking-tight text-slate-900 dark:text-white truncate" title={formatCurrency(totalSpent)}>{formatCurrencyCompact(totalSpent)}</div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800/60 dark:border-slate-800/60 min-w-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                <IconUsers className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 truncate">Total KOLs</p>
                <div className="text-2xl font-medium tracking-tight text-slate-900 dark:text-white truncate" title={totalKols.toString()}>{formatNumber(totalKols)}</div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800/60 dark:border-slate-800/60 min-w-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                <IconEye className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 truncate">Total Views</p>
                <div className="text-2xl font-medium tracking-tight text-slate-900 dark:text-white truncate" title={totalViews.toString()}>{formatNumber(totalViews)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800/60 dark:border-slate-800/60 min-w-0 flex flex-col">
            <h2 className="text-lg font-medium tracking-tight text-slate-900 dark:text-white mb-6">Campaign Views</h2>
            <div className="flex-1 flex items-end">
              {campaignPerformanceData.length > 0 ? (
                <BarChart data={campaignPerformanceData} height={240} />
              ) : (
                <div className="w-full h-40 flex items-center justify-center text-slate-400">No data available</div>
              )}
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800/60 dark:border-slate-800/60 min-w-0 flex flex-col">
            <h2 className="text-lg font-medium tracking-tight text-slate-900 dark:text-white mb-6">Platform Distribution</h2>
            <div className="flex-1 flex items-center justify-center pb-4">
              {platformDistribution.length > 0 ? (
                <DonutChart 
                  data={platformDistribution} 
                  size={220} 
                  strokeWidth={32}
                  centerLabel="Total KOLs"
                  centerValue={totalKols.toString()}
                />
              ) : (
                <div className="w-full h-40 flex items-center justify-center text-slate-400">No data available</div>
              )}
            </div>
          </div>
        </div>

        {/* KOL Status Pipeline */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800/60 dark:border-slate-800/60 min-w-0">
          <h2 className="text-lg font-medium tracking-tight text-slate-900 dark:text-white mb-6">KOL Status Pipeline</h2>
          <div className="flex h-8 rounded-lg overflow-hidden">
            {Object.entries(statusCounts).map(([status, count]) => {
              const percentage = (count / totalKols) * 100;
              return (
                <div 
                  key={status} 
                  style={{ width: `${percentage}%`, backgroundColor: statusColors[status] || '#cbd5e1' }}
                  className="h-full flex items-center justify-center group relative cursor-default hover:brightness-110 transition-all"
                >
                  {percentage > 10 && (
                    <span className="text-xs font-medium tracking-tight text-white drop-shadow-md truncate px-1">
                      {count}
                    </span>
                  )}
                  {/* Tooltip */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-xs px-2 py-1 rounded transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    {status}: {count} ({percentage.toFixed(1)}%)
                  </div>
                </div>
              );
            })}
            {totalKols === 0 && <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs text-slate-400">No KOLs added yet</div>}
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: statusColors[status] || '#cbd5e1' }} />
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">{status}</span>
                <span className="text-xs text-slate-400">({count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers & Budget Utilization Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800/60 dark:border-slate-800/60 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-medium tracking-tight text-slate-900 dark:text-white">Top Performers</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                    <th className="px-4 py-2 text-sm text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">KOL</th>
                    <th className="px-4 py-2 text-sm text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Campaign</th>
                    <th className="px-4 py-2 text-sm text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Views</th>
                    <th className="px-4 py-2 text-sm text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Eng. Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topKols.length > 0 ? topKols.map((kol, i) => (
                    <tr key={kol.id} className="hover:bg-slate-50 dark:bg-slate-800/30/50 dark:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white shrink-0"
                            style={{ backgroundColor: generateAvatarColor(kol.name) }}
                          >
                            {getInitials(kol.name)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900 dark:text-white">{kol.name}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{kol.platform}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{kol.campaignName}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{formatNumber(kol.views || 0)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          (kol.engagementRate || 0) > 3 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          {kol.engagementRate ? kol.engagementRate.toFixed(1) + '%' : 'N/A'}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-400 text-sm">
                        No performance data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800/60 dark:border-slate-800/60 min-w-0 flex flex-col">
            <h2 className="text-lg font-medium tracking-tight text-slate-900 dark:text-white mb-6">Budget Utilization</h2>
            <div className="flex-1 flex items-end">
              {budgetUtilizationData.length > 0 ? (
                <BarChart data={budgetUtilizationData} height={200} showValues={true} />
              ) : (
                <div className="w-full h-40 flex items-center justify-center text-slate-400">No data available</div>
              )}
            </div>
            <div className="mt-4 text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400">Percentage of budget spent per campaign</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}















