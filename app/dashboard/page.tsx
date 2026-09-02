'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '../../components/DashboardLayout';
import { useApp } from '../../components/AppProvider';
import { BarChart } from '../../components/BarChart';
import { DonutChart } from '../../components/DonutChart';
import { SkeletonCard, SkeletonChart } from '../../components/Skeleton';
import { formatCurrency, formatCurrencyCompact, formatNumber, formatRelativeDate } from '../../lib/utils';
import { IconTrendingUp, IconUsers, IconDollarSign, IconCalendar, IconChevronRight } from '../../components/Icons';

export default function DashboardPage() {
  const { campaigns, activityLog, isLoading } = useApp();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const activeCampaignsList = campaigns.filter(c => c.status === 'Active');
  const activeCampaigns = activeCampaignsList.length;
  
  const totalKOLs = campaigns.reduce((sum, c) => sum + c.kols.length, 0);
  const completedKOLs = campaigns.reduce((sum, c) => sum + c.kols.filter(k => k.status === 'Completed').length, 0);
  const completedKOLsPercentage = totalKOLs > 0 ? Math.round((completedKOLs / totalKOLs) * 100) : 0;
  
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  
  const allKols = campaigns.flatMap(c => c.kols);
  const totalViews = allKols.reduce((sum, k) => sum + k.views, 0);
  const totalEngagementRateSum = allKols.reduce((sum, k) => sum + k.engagementRate, 0);
  const avgEngagementRate = allKols.length > 0 ? (totalEngagementRateSum / allKols.length).toFixed(1) : '0.0';

  const barChartData = campaigns.map(c => ({
    label: c.name.length > 12 ? c.name.substring(0, 12) + '...' : c.name,
    value: c.kols.reduce((sum, k) => sum + k.views, 0),
    color: c.status === 'Active' ? '#3b82f6' : c.status === 'Completed' ? '#22c55e' : '#94a3b8'
  }));

  const kolStatusCounts: Record<string, number> = {};
  allKols.forEach(k => {
    kolStatusCounts[k.status] = (kolStatusCounts[k.status] || 0) + 1;
  });

  const donutData = [
    { label: 'Contacted', value: kolStatusCounts['Contacted'] || 0, color: '#94a3b8' },
    { label: 'Brief Sent', value: kolStatusCounts['Brief Sent'] || 0, color: '#f59e0b' },
    { label: 'Scheduled', value: kolStatusCounts['Scheduled'] || 0, color: '#3b82f6' },
    { label: 'Published', value: kolStatusCounts['Published'] || 0, color: '#6366f1' },
    { label: 'Completed', value: kolStatusCounts['Completed'] || 0, color: '#22c55e' }
  ].filter(d => d.value > 0);

  const recentActivity = [...activityLog]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8);

  const getActivityColor = (action: string) => {
    if (action.includes('add') || action.includes('create')) return 'bg-emerald-500';
    if (action.includes('status')) return 'bg-blue-500';
    if (action.includes('remove') || action.includes('delete')) return 'bg-red-500';
    return 'bg-slate-400';
  };

  const kpiCards = [
    { label: 'Active Campaigns', value: activeCampaigns, sub: `of ${campaigns.length} total`, icon: <IconCalendar className="w-4 h-4" /> },
    { label: 'Total KOLs', value: totalKOLs, sub: `${completedKOLsPercentage}% completed`, icon: <IconUsers className="w-4 h-4" /> },
    { label: 'Total Spent', value: formatCurrencyCompact(totalSpent), sub: `of ${formatCurrencyCompact(totalBudget)}`, icon: <IconDollarSign className="w-4 h-4" />, title: formatCurrency(totalSpent) },
    { label: 'Total Views', value: formatNumber(totalViews), sub: `${avgEngagementRate}% avg engagement`, icon: <IconTrendingUp className="w-4 h-4" />, title: totalViews.toString() },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white" suppressHydrationWarning>
          {getGreeting()}, Admin
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Here&apos;s what&apos;s happening across your campaigns.</p>
      </div>

      {/* KPI Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8 stagger-children">
          {kpiCards.map((card, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 animate-fade-in-up">
              <div className="flex items-center gap-2 mb-3">
                <div className="text-slate-400">{card.icon}</div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
              </div>
              <div className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white" title={card.title}>{card.value}</div>
              <p className="text-xs text-slate-400 mt-1">{card.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Charts Row */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-6">
          <div className="lg:col-span-3"><SkeletonChart /></div>
          <div className="lg:col-span-2"><SkeletonChart /></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-6">
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-6">Campaign Performance</h3>
            {barChartData.length > 0 ? (
              <BarChart data={barChartData} height={200} showValues={true} />
            ) : (
              <div className="h-[200px] flex items-center justify-center text-sm text-slate-400">
                No campaign data available.
              </div>
            )}
          </div>
          
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 flex flex-col">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-6">KOL Pipeline</h3>
            <div className="flex-1 flex items-center justify-center pb-4">
              {donutData.length > 0 ? (
                <DonutChart 
                  data={donutData} 
                  size={140} 
                  strokeWidth={24} 
                  centerLabel="KOLs" 
                  centerValue={totalKOLs.toString()} 
                />
              ) : (
                <div className="text-sm text-slate-400">No KOLs in pipeline.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Activity & Active Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-8">
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
            <Link href="/analytics" className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              View all
            </Link>
          </div>
          <div className="flex flex-col">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, idx) => (
                <div key={activity.id || idx} className="flex gap-3 py-3 border-b border-slate-50 dark:border-slate-800/50 last:border-0 last:pb-0">
                  <div className="mt-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${getActivityColor(activity.action)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-600 dark:text-slate-300">{activity.detail}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-400" suppressHydrationWarning>{formatRelativeDate(activity.timestamp)}</span>
                      <span className="text-xs text-slate-300 dark:text-slate-600">·</span>
                      <span className="text-xs text-slate-400 font-medium truncate">{activity.campaignName}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-sm text-slate-400">
                No activity yet
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Active Campaigns</h3>
            <Link href="/campaigns" className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              View all
            </Link>
          </div>
          <div className="flex flex-col gap-1">
            {activeCampaignsList.length > 0 ? (
              activeCampaignsList.slice(0, 5).map(c => {
                const progress = c.budget > 0 ? Math.round((c.spent / c.budget) * 100) : 0;
                return (
                  <Link key={c.id} href={`/campaigns/${c.id}`} className="block p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors truncate">{c.name}</h4>
                      <IconChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 transition-colors" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-1">
                        <div className="bg-slate-900 dark:bg-slate-300 h-1 rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
                      </div>
                      <span className="text-xs font-medium text-slate-400 w-8">{progress}%</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">{c.kols.length} KOLs</p>
                  </Link>
                );
              })
            ) : (
              <div className="py-8 text-center text-sm text-slate-400">
                No active campaigns
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
