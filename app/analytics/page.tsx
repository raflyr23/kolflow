"use client";

import React, { useMemo } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { useApp } from '../../components/AppProvider';
import { BarChart } from '../../components/BarChart';
import { DonutChart } from '../../components/DonutChart';
import { SkeletonCard, SkeletonChart, SkeletonTable } from '../../components/Skeleton';
import { formatCurrency, formatCurrencyCompact, formatNumber, getInitials, generateAvatarColor, calculateCPE } from '../../lib/utils';
import { IconTrendingUp, IconDollarSign, IconUsers, IconEye } from '../../components/Icons';

export default function AnalyticsPage() {
  const { campaigns, isLoading } = useApp();

  const totalBudget = useMemo(() => campaigns.reduce((sum, c) => sum + c.budget, 0), [campaigns]);
  const totalSpent = useMemo(() => campaigns.reduce((sum, c) => sum + c.spent, 0), [campaigns]);
  
  const allKols = useMemo(() => campaigns.flatMap(c => c.kols.map(k => ({ ...k, campaignName: c.name }))), [campaigns]);
  const totalKols = allKols.length;
  const totalViews = useMemo(() => allKols.reduce((sum, k) => sum + (k.views || 0), 0), [allKols]);

  const campaignPerformanceData = useMemo(() => {
    return campaigns.map(c => {
      const views = c.kols.reduce((sum, k) => sum + (k.views || 0), 0);
      let color = '#94a3b8';
      if (c.status === 'Active') color = '#3b82f6';
      else if (c.status === 'Completed') color = '#22c55e';
      return { label: c.name.length > 12 ? c.name.substring(0, 12) + '...' : c.name, value: views, color };
    }).filter(d => d.value > 0);
  }, [campaigns]);

  const platformDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    allKols.forEach(k => {
      counts[k.platform] = (counts[k.platform] || 0) + 1;
    });
    const colorMap: Record<string, string> = { Instagram: '#e1306c', TikTok: '#000000', YouTube: '#ff0000' };
    return Object.entries(counts).map(([label, value]) => ({
      label, value, color: colorMap[label] || '#6366f1'
    })).filter(d => d.value > 0);
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
    'Brief Sent': '#f59e0b',
    'Scheduled': '#3b82f6',
    'Content Review': '#8b5cf6',
    'Published': '#22c55e',
    'Completed': '#22c55e',
    'Rejected': '#ef4444'
  };

  const topKols = useMemo(() => {
    return [...allKols].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 10);
  }, [allKols]);

  const budgetUtilizationData = useMemo(() => {
    return campaigns.map(c => {
      const util = c.budget > 0 ? (c.spent / c.budget) * 100 : 0;
      return { label: c.name.length > 10 ? c.name.substring(0, 10) + '...' : c.name, value: Math.round(util), color: util > 100 ? '#ef4444' : '#6366f1' };
    });
  }, [campaigns]);

  const kpiCards = [
    { label: 'Total Budget', value: formatCurrencyCompact(totalBudget), icon: <IconDollarSign className="w-4 h-4" />, title: formatCurrency(totalBudget) },
    { label: 'Total Spent', value: formatCurrencyCompact(totalSpent), icon: <IconTrendingUp className="w-4 h-4" />, title: formatCurrency(totalSpent) },
    { label: 'Total KOLs', value: formatNumber(totalKols), icon: <IconUsers className="w-4 h-4" /> },
    { label: 'Total Views', value: formatNumber(totalViews), icon: <IconEye className="w-4 h-4" />, title: totalViews.toString() },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">Analytics</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Cross-campaign performance insights and metrics</p>
        </div>

        {/* KPI Row */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
            {kpiCards.map((card, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 animate-fade-in-up">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-slate-400">{card.icon}</div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
                </div>
                <div className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white" title={card.title}>{card.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Charts Row */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <SkeletonChart />
            <SkeletonChart />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-6">Campaign Views</h2>
              {campaignPerformanceData.length > 0 ? (
                <BarChart data={campaignPerformanceData} height={240} />
              ) : (
                <div className="w-full h-40 flex items-center justify-center text-sm text-slate-400">No data available</div>
              )}
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-6">Platform Distribution</h2>
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
                  <div className="w-full h-40 flex items-center justify-center text-sm text-slate-400">No data available</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* KOL Status Pipeline */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-6">KOL Status Pipeline</h2>
          <div className="flex h-7 rounded-lg overflow-hidden gap-0.5">
            {Object.entries(statusCounts).map(([status, count]) => {
              const percentage = totalKols > 0 ? (count / totalKols) * 100 : 0;
              return (
                <div 
                  key={status} 
                  style={{ width: `${percentage}%`, backgroundColor: statusColors[status] || '#cbd5e1' }}
                  className="h-full flex items-center justify-center group relative cursor-default transition-all hover:opacity-80 first:rounded-l-lg last:rounded-r-lg"
                >
                  {percentage > 12 && (
                    <span className="text-[11px] font-medium text-white drop-shadow-sm truncate px-1">
                      {count}
                    </span>
                  )}
                  <div className="absolute -top-9 opacity-0 group-hover:opacity-100 bg-slate-900 dark:bg-slate-700 text-white text-xs px-2.5 py-1 rounded-md transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    {status}: {count} ({percentage.toFixed(0)}%)
                  </div>
                </div>
              );
            })}
            {totalKols === 0 && <div className="w-full h-full bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-xs text-slate-400">No KOLs added yet</div>}
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColors[status] || '#cbd5e1' }} />
                <span className="text-xs text-slate-500 dark:text-slate-400">{status}</span>
                <span className="text-xs text-slate-400">({count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers & Budget Utilization */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2"><SkeletonTable /></div>
            <SkeletonChart />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-50 dark:border-slate-800">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Top Performers</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-50 dark:border-slate-800">
                      <th className="px-5 py-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">KOL</th>
                      <th className="px-5 py-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">Campaign</th>
                      <th className="px-5 py-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">Views</th>
                      <th className="px-5 py-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">ER%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topKols.length > 0 ? topKols.map((kol) => (
                      <tr key={kol.id} className="border-b border-slate-50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium text-white shrink-0" style={{ backgroundColor: generateAvatarColor(kol.name) }}>
                              {getInitials(kol.name)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900 dark:text-white">{kol.name}</p>
                              <p className="text-xs text-slate-400">{kol.platform}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm text-slate-500 dark:text-slate-400 truncate max-w-[140px]">{(kol as any).campaignName}</td>
                        <td className="px-5 py-3 text-sm font-medium text-slate-900 dark:text-white">{formatNumber(kol.views)}</td>
                        <td className="px-5 py-3">
                          <span className={`text-sm font-medium ${kol.engagementRate > 3 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                            {kol.engagementRate.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={4} className="px-5 py-8 text-center text-sm text-slate-400">No KOL data available</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-6">Budget Utilization</h2>
              {budgetUtilizationData.length > 0 ? (
                <BarChart data={budgetUtilizationData} height={260} showValues={true} />
              ) : (
                <div className="w-full h-40 flex items-center justify-center text-sm text-slate-400">No data available</div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
