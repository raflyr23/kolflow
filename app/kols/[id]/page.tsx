'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '../../../components/DashboardLayout';
import { useApp } from '../../../components/AppProvider';
import {
  IconArrowLeft,
  IconUsers,
  IconTrendingUp,
  IconDollarSign,
  IconEye,
} from '../../../components/Icons';
import {
  formatCurrency,
  formatCurrencyCompact,
  formatNumber,
  getInitials,
  generateAvatarColor,
  calculateCPE,
} from '../../../lib/utils';

export default function KolProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const decodedName = id ? decodeURIComponent(id) : '';

  const { campaigns } = useApp();

  // Aggregate KOL data across all campaigns
  let totalSpend = 0;
  let totalViews = 0;
  let totalEngagementRate = 0;
  let totalEngagements = 0;
  let platform = '';

  const kolHistory = campaigns.flatMap((campaign) => {
    const kolMatches = campaign.kols.filter(
      (k) => k.name.toLowerCase() === decodedName.toLowerCase()
    );

    return kolMatches.map((kol) => {
      totalSpend += kol.costPerPost || 0;
      totalViews += kol.views || 0;
      totalEngagementRate += kol.engagementRate || 0;
      totalEngagements += ((kol.views || 0) * (kol.engagementRate || 0)) / 100;
      if (kol.platform) platform = kol.platform;

      return {
        campaignId: campaign.id,
        campaignName: campaign.name,
        campaignStatus: campaign.status,
        ...kol,
      };
    });
  });

  const totalCampaigns = kolHistory.length;
  
  if (totalCampaigns === 0) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto space-y-5 animate-fade-in-up">
          <Link
            href="/kols"
            className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            <IconArrowLeft className="w-4 h-4 mr-2" />
            Back to KOL Database
          </Link>
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-8 text-center">
            <h2 className="text-xl font-medium text-slate-900 dark:text-white mb-2">
              KOL Not Found
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              We couldn't find any campaign records for "{decodedName}".
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const avgEngagementRate = totalCampaigns > 0 ? totalEngagementRate / totalCampaigns : 0;
  // Fallback if calculateCPE isn't easily compatible with total aggregations: calculate manually if needed
  // Using calculateCPE(totalSpend, totalViews, avgEngagementRate)
  const avgCpe = calculateCPE(totalSpend, totalViews, avgEngagementRate);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'draft':
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const getKolStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'published':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'scheduled':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'brief sent':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const handle = `@${decodedName.toLowerCase().replace(/\s+/g, '')}`;
  const avatarColor = generateAvatarColor(decodedName);
  const initials = getInitials(decodedName);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-5 animate-fade-in-up">
        {/* Header Link */}
        <Link
          href="/kols"
          className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <IconArrowLeft className="w-4 h-4 mr-2" />
          Back to KOL Database
        </Link>

        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 flex items-center gap-5">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-medium shrink-0"
            style={{ backgroundColor: avatarColor }}
          >
            {initials}
          </div>
          <div>
            <h1 className="text-xl font-medium text-slate-900 dark:text-white flex items-center gap-3">
              {decodedName}
              {platform && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  {platform}
                </span>
              )}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {handle}
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
              <IconUsers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Campaigns</p>
              <p className="text-lg font-medium text-slate-900 dark:text-white">
                {totalCampaigns}
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 shrink-0">
              <IconDollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Lifetime Value</p>
              <p className="text-lg font-medium text-slate-900 dark:text-white">
                {formatCurrencyCompact(totalSpend)}
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-500 shrink-0">
              <IconEye className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Views</p>
              <p className="text-lg font-medium text-slate-900 dark:text-white">
                {formatNumber(totalViews)}
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500 shrink-0">
              <IconTrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Avg. Engagement</p>
              <p className="text-lg font-medium text-slate-900 dark:text-white">
                {avgEngagementRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Campaign History Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-medium text-slate-900 dark:text-white">Campaign History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3 font-medium">Campaign Name</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Views</th>
                  <th className="px-5 py-3 font-medium">ER%</th>
                  <th className="px-5 py-3 font-medium">Cost/Post</th>
                  <th className="px-5 py-3 font-medium">KOL Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {kolHistory.map((history, idx) => (
                  <tr
                    key={`${history.campaignId}-${idx}`}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/campaigns/${history.campaignId}`}
                        className="font-medium text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {history.campaignName}
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(
                          history.campaignStatus
                        )}`}
                      >
                        {history.campaignStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                      {formatNumber(history.views)}
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                      {history.engagementRate}%
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                      {formatCurrency(history.costPerPost)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getKolStatusColor(
                          history.status
                        )}`}
                      >
                        {history.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
