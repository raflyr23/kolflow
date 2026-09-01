'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '../../components/DashboardLayout';
import { useApp } from '../../components/AppProvider';
import { BarChart } from '../../components/BarChart';

import { DonutChart } from '../../components/DonutChart';
import { formatCurrency, formatCurrencyCompact, formatNumber, formatRelativeDate, getInitials, generateAvatarColor } from '../../lib/utils';
import { IconTrendingUp, IconUsers, IconDollarSign, IconActivity, IconChevronRight, IconCalendar } from '../../components/Icons';

export default function DashboardPage() {
  const { campaigns, activityLog } = useApp();

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
    label: c.name.split(' ')[0],
    value: c.kols.reduce((sum, k) => sum + k.views, 0),
    color: c.status === 'Active' ? '#3b82f6' : c.status === 'Completed' ? '#22c55e' : '#94a3b8'
  }));

  const kolStatusCounts = {
    'Contacted': 0,
    'Brief Sent': 0,
    'Scheduled': 0,
    'Published': 0,
    'Completed': 0
  };
  
  allKols.forEach(k => {
    if (kolStatusCounts[k.status as keyof typeof kolStatusCounts] !== undefined) {
      kolStatusCounts[k.status as keyof typeof kolStatusCounts]++;
    }
  });

  const donutData = [
    { label: 'Contacted', value: kolStatusCounts['Contacted'], color: '#94a3b8' },
    { label: 'Brief Sent', value: kolStatusCounts['Brief Sent'], color: '#f59e0b' },
    { label: 'Scheduled', value: kolStatusCounts['Scheduled'], color: '#3b82f6' },
    { label: 'Published', value: kolStatusCounts['Published'], color: '#6366f1' },
    { label: 'Completed', value: kolStatusCounts['Completed'], color: '#22c55e' }
  ].filter(d => d.value > 0);

  const recentActivity = [...activityLog]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8);

  const getActivityColor = (action: string) => {
    if (action.includes('add') || action.includes('create')) return 'bg-green-500';
    if (action.includes('status')) return 'bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-8000';
    if (action.includes('remove') || action.includes('delete')) return 'bg-red-500';
    return 'bg-slate-400';
  };

  return (
    <DashboardLayout>
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-xl font-medium truncate tracking-tight text-slate-900 dark:text-white">
          {getGreeting()}, Admin
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Here's what's happening across your campaigns.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800/60 dark:border-slate-800/60 min-w-0 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">Active Campaigns</p>
            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0">
              <IconCalendar className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-2xl font-medium tracking-tight text-slate-900 dark:text-white truncate">{activeCampaigns}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">of {campaigns.length} total</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800/60 dark:border-slate-800/60 min-w-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">Total KOLs</p>
            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0">
              <IconUsers className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-2xl font-medium tracking-tight text-slate-900 dark:text-white truncate">{totalKOLs}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">{completedKOLsPercentage}% completed</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800/60 dark:border-slate-800/60 min-w-0 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">Total Spent</p>
            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0">
              <IconDollarSign className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-2xl font-medium tracking-tight text-slate-900 dark:text-white truncate" title={formatCurrency(totalSpent)}>{formatCurrencyCompact(totalSpent)}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">of {formatCurrencyCompact(totalBudget)}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800/60 dark:border-slate-800/60 min-w-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">Total Views</p>
            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0">
              <IconTrendingUp className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-2xl font-medium tracking-tight text-slate-900 dark:text-white truncate" title={totalViews.toString()}>{formatNumber(totalViews)}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">{avgEngagementRate}% avg engagement</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-4">
          <h3 className="text-base font-medium text-slate-900 dark:text-white mb-6">Campaign Performance</h3>
          {barChartData.length > 0 ? (
            <BarChart data={barChartData} height={200} showValues={true} />
          ) : (
            <div className="h-[200px] flex items-center justify-center text-sm text-slate-500 dark:text-slate-400">
              No campaign data available.
            </div>
          )}
        </div>
        
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-4 flex flex-col">
          <h3 className="text-base font-medium text-slate-900 dark:text-white mb-6">KOL Pipeline</h3>
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
              <div className="text-sm text-slate-500 dark:text-slate-400">No KOLs in pipeline.</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-8">
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-slate-900 dark:text-white">Recent Activity</h3>
            <Link href="/analytics" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-700">
              View all
            </Link>
          </div>
          <div className="flex flex-col gap-1">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, idx) => (
                <div key={activity.id || idx} className="flex gap-3 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-1">
                  <div className="mt-1.5">
                    <div className={`w-2 h-2 rounded-full ${getActivityColor(activity.action)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 dark:text-slate-300">{activity.detail}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-400" suppressHydrationWarning>{formatRelativeDate(activity.timestamp)}</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">{activity.campaignName}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                No activity yet
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-slate-900 dark:text-white">Active Campaigns</h3>
            <Link href="/campaigns" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-700">
              View all
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {activeCampaignsList.length > 0 ? (
              activeCampaignsList.slice(0, 5).map(c => {
                const progress = c.budget > 0 ? Math.round((c.spent / c.budget) * 100) : 0;
                return (
                  <Link key={c.id} href={`/campaigns/${c.id}`} className="block p-3 rounded-lg hover:bg-slate-50 dark:bg-slate-800/30 transition-colors group">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-slate-700 dark:text-slate-300 transition-colors truncate">{c.name}</h4>
                      <IconChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                        <div className="bg-slate-900 h-1.5 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }} />
                      </div>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400 w-8">{progress}%</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">{c.kols.length} KOLs</p>
                  </Link>
                );
              })
            ) : (
              <div className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                No active campaigns
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}









