'use client';

import React, { useMemo } from 'react';
import { useApp } from '../../components/AppProvider';
import { DashboardLayout } from '../../components/DashboardLayout';
import { KOL } from '../../lib/types';
import { formatCurrency, formatNumber, calculateCPE, generateAvatarColor, getInitials } from '../../lib/utils';
import { EmptyState } from '../../components/EmptyState';

export default function KolDatabasePage() {
  const { campaigns } = useApp();

  const kolDatabase = useMemo(() => {
    const kolsMap = new Map<string, any>();
    
    campaigns.forEach(campaign => {
      campaign.kols.forEach(kol => {
        const key = kol.name.toLowerCase();
        if (!kolsMap.has(key)) {
          kolsMap.set(key, {
            name: kol.name,
            handle: '@' + kol.name.toLowerCase().replace(/\s+/g, ''),
            platform: kol.platform,
            campaignsCount: 1,
            totalSpent: kol.costPerPost,
            totalViews: kol.views || 0,
            engagementRates: [kol.engagementRate || 0]
          });
        } else {
          const existing = kolsMap.get(key);
          existing.campaignsCount += 1;
          existing.totalSpent += kol.costPerPost;
          existing.totalViews += (kol.views || 0);
          existing.engagementRates.push(kol.engagementRate || 0);
        }
      });
    });

    return Array.from(kolsMap.values()).map(k => {
      const avgER = k.engagementRates.reduce((a: number, b: number) => a + b, 0) / k.engagementRates.length;
      return {
        ...k,
        avgEngagementRate: avgER,
        avgCPE: k.totalViews > 0 && avgER > 0 ? k.totalSpent / (k.totalViews * (avgER / 100)) : 0
      };
    }).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [campaigns]);

  return (
    <DashboardLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-medium tracking-tight text-slate-900 dark:text-white">KOL Database (CRM)</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Aggregated history of all influencers you have worked with.</p>
          </div>
        </div>

        {kolDatabase.length === 0 ? (
          <EmptyState 
            title="No KOLs found"
            description="Start adding KOLs to your campaigns to build your database."
          />
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200/60 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200/60 dark:border-slate-800">
                    <th className="px-6 py-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Influencer</th>
                    <th className="px-6 py-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Campaigns</th>
                    <th className="px-6 py-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Lifetime Value (LTV)</th>
                    <th className="px-6 py-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Avg Views</th>
                    <th className="px-6 py-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Avg Eng. Rate</th>
                    <th className="px-6 py-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Avg CPE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
                  {kolDatabase.map((kol, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm shrink-0"
                            style={{ backgroundColor: generateAvatarColor(kol.name) }}
                          >
                            {getInitials(kol.name)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-slate-900 dark:text-white truncate">{kol.name}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{kol.handle} &bull; {kol.platform}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {kol.campaignsCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-slate-900 dark:text-white">
                        {formatCurrency(kol.totalSpent)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-slate-600 dark:text-slate-300">
                        {formatNumber(kol.totalViews / kol.campaignsCount)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-slate-600 dark:text-slate-300">
                        {kol.avgEngagementRate.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-slate-600 dark:text-slate-300">
                        {kol.avgCPE > 0 ? formatCurrency(Math.round(kol.avgCPE)) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}


