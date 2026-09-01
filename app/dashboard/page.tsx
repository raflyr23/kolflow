'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '../../components/DashboardLayout';
import { useApp } from '../../components/AppProvider';
import { BarChart } from '../../components/BarChart';
import { DonutChart } from '../../components/DonutChart';
import { formatCurrency, formatNumber, formatRelativeDate, getInitials, generateAvatarColor } from '../../lib/utils';
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
  const totalEngagements = allKols.reduce((sum, k) => sum + k.engagements, 0);
  const avgEngagementRate = totalViews > 0 ? ((totalEngagements / totalViews) * 100).toFixed(1) : '0.0';

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
    if (action.includes('status')) return 'bg-blue-500';
    if (action.includes('remove') || action.includes('delete')) return 'bg-red-500';
    return 'bg-slate-400';
  };

  return (
    <DashboardLayout>
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {getGreeting()}, Admin
        </h1>
        <p className="text-sm text-slate-500 mt-1">Here's what's happening across your campaigns.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm animate-fade-in-up" style={{ animationDelay: '50ms' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <IconCalendar className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 tracking-tight">{activeCampaigns}</p>
          <p className="text-xs text-slate-500 mt-1">of {campaigns.length} total</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center">
              <IconUsers className="w-4 h-4 text-violet-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 tracking-tight">{totalKOLs}</p>
          <p className="text-xs text-slate-500 mt-1">{completedKOLsPercentage}% completed</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
              <IconDollarSign className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 tracking-tight">{formatCurrency(totalSpent)}</p>
          <p className="text-xs text-slate-500 mt-1">of {formatCurrency(totalBudget)}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
              <IconTrendingUp className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 tracking-tight">{formatNumber(totalViews)}</p>
          <p className="text-xs text-slate-500 mt-1">{avgEngagementRate}% avg engagement</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl shadow-sm p-5">
          <h3 className="text-base font-semibold text-slate-900 mb-6">Campaign Performance</h3>
          {barChartData.length > 0 ? (
            <BarChart data={barChartData} height={200} showValues={true} />
          ) : (
            <div className="h-[200px] flex items-center justify-center text-sm text-slate-500">
              No campaign data available.
            </div>
          )}
        </div>
        
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm p-5 flex flex-col">
          <h3 className="text-base font-semibold text-slate-900 mb-6">KOL Pipeline</h3>
          <div className="flex-1 flex items-center justify-center pb-4">
            {donutData.length > 0 ? (
              <DonutChart 
                data={donutData} 
                size={140} 
                strokeWidth={24} 
                centerLabel="KOLs" 
                centerValue={totalKOLs} 
              />
            ) : (
              <div className="text-sm text-slate-500">No KOLs in pipeline.</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900">Recent Activity</h3>
            <Link href="/analytics" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View all
            </Link>
          </div>
          <div className="flex flex-col gap-1">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, idx) => (
                <div key={activity.id || idx} className="flex gap-3 py-3 border-b border-slate-100 last:border-0 last:pb-1">
                  <div className="mt-1.5">
                    <div className={`w-2 h-2 rounded-full ${getActivityColor(activity.action)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">{activity.detail}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-400">{formatRelativeDate(activity.timestamp)}</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500 font-medium truncate">{activity.campaignName}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-sm text-slate-500">
                No activity yet
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900">Active Campaigns</h3>
            <Link href="/campaigns" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View all
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {activeCampaignsList.length > 0 ? (
              activeCampaignsList.slice(0, 5).map(c => {
                const progress = c.budget > 0 ? Math.round((c.spent / c.budget) * 100) : 0;
                return (
                  <Link key={c.id} href={`/campaigns/${c.id}`} className="block p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors truncate">{c.name}</h4>
                      <IconChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                        <div className="bg-slate-900 h-1.5 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }} />
                      </div>
                      <span className="text-xs font-medium text-slate-600 w-8">{progress}%</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5">{c.kols.length} KOLs</p>
                  </Link>
                );
              })
            ) : (
              <div className="py-6 text-center text-sm text-slate-500">
                No active campaigns
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}