"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '../../../components/DashboardLayout';
import { useApp } from '../../../components/AppProvider';
import { Modal } from '../../../components/Modal';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { Tabs } from '../../../components/Tabs';
import { EmptyState } from '../../../components/EmptyState';
import { DonutChart } from '../../../components/DonutChart';
import { 
  IconTrash, 
  IconDownload, 
  IconSparkles, 
  IconEdit, 
  IconPlus,
  IconCheck,
  IconChevronRight,
  IconCalendar,
  IconUsers,
  IconTrendingUp,
  IconActivity,
  IconAlertCircle
} from '../../../components/Icons';
import { KOL, KolStatus, CampaignStatus, Campaign } from '../../../lib/types';
import { formatCurrency, formatNumber, formatDate, getInitials, generateAvatarColor, cn } from '../../../lib/utils';

const MASTER_KOL_DB = [
  { name: 'Reza Mahendra', platform: 'Instagram' as const, followers: 125000, contentTarget: 2, views: 0, engagementRate: 4.5, costPerPost: 3500000, notes: '' },
  { name: 'Rina Outdoor', platform: 'TikTok' as const, followers: 85000, contentTarget: 3, views: 0, engagementRate: 7.2, costPerPost: 2000000, notes: '' },
  { name: 'Tari Devs', platform: 'Instagram' as const, followers: 42000, contentTarget: 1, views: 0, engagementRate: 5.8, costPerPost: 1500000, notes: '' },
  { name: 'Kak Jeje', platform: 'TikTok' as const, followers: 210000, contentTarget: 4, views: 0, engagementRate: 6.1, costPerPost: 5000000, notes: '' },
  { name: 'TechBoy ID', platform: 'YouTube' as const, followers: 500000, contentTarget: 2, views: 0, engagementRate: 3.9, costPerPost: 10000000, notes: '' },
];

const COLUMNS: { label: KolStatus; color: string; bgColor: string }[] = [
  { label: 'Contacted', color: 'text-slate-600', bgColor: 'bg-slate-100' },
  { label: 'Brief Sent', color: 'text-amber-600', bgColor: 'bg-amber-100' },
  { label: 'Scheduled', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { label: 'Published', color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  { label: 'Completed', color: 'text-green-600', bgColor: 'bg-green-100' },
];

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { 
    campaigns, 
    activityLog,
    addKOL, 
    removeKOL, 
    updateKOLStatus, 
    updateCampaign, 
    updateCampaignStatus, 
    deleteCampaign,
    showToast
  } = useApp();

  const campaign = campaigns.find(c => c.id === params.id);
  
  const [activeTab, setActiveTab] = useState('workflow');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const [kolFormData, setKolFormData] = useState({
    name: '',
    platform: 'Instagram' as KOL['platform'],
    followers: '',
    contentTarget: '1',
    engagementRate: '',
    costPerPost: ''
  });

  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    tags: ''
  });

  const openEditModal = () => {
    if (campaign) {
      setEditFormData({
        name: campaign.name,
        description: campaign.description,
        startDate: campaign.startDate || '',
        endDate: campaign.endDate || '',
        budget: campaign.budget.toString(),
        tags: campaign.tags?.join(', ') || ''
      });
      setIsEditModalOpen(true);
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign) return;

    const tagsArray = editFormData.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    updateCampaign(campaign.id, {
      name: editFormData.name,
      description: editFormData.description,
      startDate: editFormData.startDate,
      endDate: editFormData.endDate,
      budget: Number(editFormData.budget),
      tags: tagsArray
    });

    setIsEditModalOpen(false);
    showToast('Campaign updated successfully');
  };

  const handleDeleteCampaign = () => {
    if (!campaign) return;
    deleteCampaign(campaign.id);
    router.push('/campaigns');
    showToast('Campaign deleted');
  };

  const handleAddKol = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign) return;
    
    const newKol: KOL = {
      id: 'k' + Date.now(),
      name: kolFormData.name,
      platform: kolFormData.platform,
      followers: Number(kolFormData.followers),
      contentTarget: Number(kolFormData.contentTarget),
      engagementRate: Number(kolFormData.engagementRate),
      costPerPost: Number(kolFormData.costPerPost),
      status: 'Contacted',
      views: 0,
      addedAt: new Date().toISOString(),
      notes: ''
    };

    addKOL(campaign.id, newKol);
    setIsAddModalOpen(false);
    setKolFormData({
      name: '', platform: 'Instagram', followers: '', contentTarget: '1', engagementRate: '', costPerPost: ''
    });
    showToast('KOL added to campaign');
  };

  const handleSuggestKols = () => {
    if (!campaign) return;
    const remainingBudget = campaign.budget - campaign.spent;
    let added = 0;

    MASTER_KOL_DB.forEach(suggestion => {
      const exists = campaign.kols.some(k => k.name === suggestion.name);
      if (!exists && suggestion.costPerPost <= remainingBudget) {
        const newKol: KOL = {
          id: 'k' + Date.now() + Math.random().toString(36).substr(2, 5),
          ...suggestion,
          status: 'Contacted',
          addedAt: new Date().toISOString()
        };
        addKOL(campaign.id, newKol);
        added++;
      }
    });

    setIsSuggestModalOpen(false);
    if (added > 0) {
      showToast(`Added ${added} suggested KOLs`);
    } else {
      showToast('No matching KOLs found within budget');
    }
  };

  const handleExportCSV = () => {
    if (!campaign) return;
    
    const headers = ['Name', 'Platform', 'Followers', 'Status', 'Content Target', 'Cost Per Post', 'Engagement Rate', 'Views'];
    const csvData = campaign.kols.map(k => [
      k.name,
      k.platform,
      k.followers,
      k.status,
      k.contentTarget,
      k.costPerPost,
      k.engagementRate,
      k.views
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${campaign.name.replace(/\s+/g, '_')}_kols.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Drag and Drop
  const onDragStart = (e: React.DragEvent, kolId: string) => {
    e.dataTransfer.setData('kolId', kolId);
    setActiveDragId(kolId);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, status: KolStatus) => {
    e.preventDefault();
    setActiveDragId(null);
    const kolId = e.dataTransfer.getData('kolId');
    if (kolId && campaign) {
      updateKOLStatus(campaign.id, kolId, status);
    }
  };

  const getStatusColor = (status: CampaignStatus) => {
    switch (status) {
      case 'Active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Draft': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!campaign) {
    return (
      <DashboardLayout>
        <EmptyState
          variant="error"
          title="Campaign Not Found"
          description="The campaign you are looking for does not exist or has been deleted."
          action={
            <Link href="/campaigns" className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
              Back to Campaigns
            </Link>
          }
        />
      </DashboardLayout>
    );
  }

  const progress = campaign.budget > 0 ? Math.min(100, Math.round((campaign.spent / campaign.budget) * 100)) : 0;
  const totalViews = campaign.kols.reduce((sum, kol) => sum + kol.views, 0);
  const avgER = campaign.kols.length > 0 
    ? (campaign.kols.reduce((sum, kol) => sum + kol.engagementRate, 0) / campaign.kols.length).toFixed(1)
    : '0';

  const donutData = COLUMNS.map(col => ({
    label: col.label,
    value: campaign.kols.filter(k => k.status === col.label).length,
    color: col.bgColor.replace('bg-', 'text-').replace('-100', '-500') // approximation for chart colors
  })).filter(d => d.value > 0);

  const campaignLogs = activityLog.filter(log => log.campaignId === campaign.id).slice(0, 5);

  const tabs = [
    { id: 'workflow', label: 'Workflow', count: campaign.kols.length },
    { id: 'table', label: 'Table View', count: campaign.kols.length },
    { id: 'overview', label: 'Overview' }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in-up">
        {/* Header Breadcrumbs */}
        <div className="flex items-center text-sm text-slate-500 gap-2 mb-2">
          <Link href="/campaigns" className="hover:text-indigo-600 transition-colors">Campaigns</Link>
          <IconChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-medium truncate max-w-xs">{campaign.name}</span>
        </div>

        {/* Header Area */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col xl:flex-row gap-6 justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold text-slate-900 truncate">{campaign.name}</h1>
              <span className={cn("px-3 py-1 rounded-full text-sm font-medium border", getStatusColor(campaign.status))}>
                {campaign.status}
              </span>
            </div>
            {campaign.description && (
              <p className="text-slate-600 mb-4 line-clamp-2 max-w-3xl">{campaign.description}</p>
            )}
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <IconCalendar className="w-4 h-4 text-slate-400" />
                <span>{campaign.startDate ? formatDate(campaign.startDate) : 'No start'} - {campaign.endDate ? formatDate(campaign.endDate) : 'No end'}</span>
              </div>
              <div className="flex items-center gap-2">
                <IconUsers className="w-4 h-4 text-slate-400" />
                <span>{campaign.kols.length} KOLs</span>
              </div>
            </div>
            
            {campaign.tags && campaign.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {campaign.tags.map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between w-full xl:w-96 shrink-0 gap-6">
            <div className="flex flex-wrap items-center gap-2 xl:justify-end">
              <select
                value={campaign.status}
                onChange={(e) => updateCampaignStatus(campaign.id, e.target.value as CampaignStatus)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-indigo-500"
              >
                <option value="Draft">Set as Draft</option>
                <option value="Active">Set as Active</option>
                <option value="Completed">Set as Completed</option>
              </select>
              
              <button onClick={openEditModal} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors" title="Edit Campaign">
                <IconEdit className="w-5 h-5" />
              </button>
              <button onClick={handleExportCSV} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors" title="Export to CSV">
                <IconDownload className="w-5 h-5" />
              </button>
              <button onClick={() => setIsDeleteDialogOpen(true)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Delete Campaign">
                <IconTrash className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">Budget Spent</span>
                <span className="font-semibold text-slate-900">{formatCurrency(campaign.spent)} <span className="text-slate-400 font-normal text-xs">of {formatCurrency(campaign.budget)}</span></span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    progress > 90 ? "bg-red-500" : progress > 70 ? "bg-amber-500" : "bg-indigo-500"
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 text-right text-xs font-medium text-slate-500">{progress}% Utilized</div>
            </div>
          </div>
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'workflow' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200/60">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <IconActivity className="w-5 h-5 text-indigo-500" />
                  KOL Pipeline
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsSuggestModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-sm font-medium gap-2"
                  >
                    <IconSparkles className="w-4 h-4 text-amber-500" />
                    Smart Match
                  </button>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm text-sm font-medium gap-2"
                  >
                    <IconPlus className="w-4 h-4" />
                    Add KOL
                  </button>
                </div>
              </div>

              <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
                {COLUMNS.map(column => {
                  const columnKols = campaign.kols.filter(k => k.status === column.label);
                  return (
                    <div
                      key={column.label}
                      className="flex-shrink-0 w-80 bg-slate-50 rounded-2xl flex flex-col max-h-[70vh] border border-slate-200/60"
                      onDragOver={onDragOver}
                      onDrop={(e) => onDrop(e, column.label)}
                    >
                      <div className="p-4 border-b border-slate-200/50 bg-slate-50 rounded-t-2xl flex items-center justify-between sticky top-0">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", column.bgColor.replace('bg-', 'bg-').replace('100', '500'))} />
                          <h3 className="font-semibold text-slate-700">{column.label}</h3>
                        </div>
                        <span className="px-2 py-1 bg-white text-slate-500 text-xs font-medium rounded-lg shadow-sm border border-slate-100">
                          {columnKols.length}
                        </span>
                      </div>

                      <div className="flex-1 p-3 overflow-y-auto space-y-3 min-h-[150px]">
                        {columnKols.length === 0 ? (
                          <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
                            <span className="text-sm text-slate-400">Drop here</span>
                          </div>
                        ) : (
                          columnKols.map((kol) => (
                            <div
                              key={kol.id}
                              draggable
                              onDragStart={(e) => onDragStart(e, kol.id)}
                              onDragEnd={() => setActiveDragId(null)}
                              className={cn(
                                "bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing hover:border-indigo-300 transition-all group",
                                activeDragId === kol.id ? "opacity-50 scale-95" : "opacity-100"
                              )}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm shadow-sm", generateAvatarColor(kol.name))}>
                                    {getInitials(kol.name)}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-slate-900 text-sm leading-tight">{kol.name}</h4>
                                    <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>
                                      {kol.platform}
                                    </span>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => removeKOL(campaign.id, kol.id)}
                                  className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  <IconTrash className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-slate-50 p-2 rounded-lg">
                                  <div className="text-slate-500 mb-0.5">Followers</div>
                                  <div className="font-medium text-slate-700">{formatNumber(kol.followers)}</div>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-lg">
                                  <div className="text-slate-500 mb-0.5">Cost/Post</div>
                                  <div className="font-medium text-slate-700">{formatCurrency(kol.costPerPost)}</div>
                                </div>
                                <div className="bg-indigo-50 p-2 rounded-lg col-span-2 flex justify-between items-center">
                                  <span className="text-indigo-600/70 font-medium">Est. ER</span>
                                  <span className="font-bold text-indigo-700">{kol.engagementRate}%</span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'table' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="p-4 border-b border-slate-200/60 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-semibold text-slate-800">All Campaign KOLs</h3>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-sm font-medium gap-1.5"
                >
                  <IconPlus className="w-4 h-4" />
                  Add KOL
                </button>
              </div>
              
              {campaign.kols.length === 0 ? (
                <EmptyState
                  variant="no-data"
                  title="No KOLs added yet"
                  description="Start by adding influencers to this campaign."
                  action={
                    <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
                      Add First KOL
                    </button>
                  }
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-slate-200/60">
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">KOL</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Platform</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Metrics</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Content Target</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cost/Post</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {campaign.kols.map((kol) => (
                        <tr key={kol.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-xs shadow-sm", generateAvatarColor(kol.name))}>
                                {getInitials(kol.name)}
                              </div>
                              <div className="font-medium text-slate-900">{kol.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                              {kol.platform}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">
                              <div className="text-slate-900 font-medium">{formatNumber(kol.followers)} <span className="text-slate-500 font-normal text-xs">flw</span></div>
                              <div className="text-indigo-600 text-xs font-medium mt-0.5">{kol.engagementRate}% ER</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                            {kol.contentTarget} posts
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                            {formatCurrency(kol.costPerPost)}
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={kol.status}
                              onChange={(e) => updateKOLStatus(campaign.id, kol.id, e.target.value as KolStatus)}
                              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            >
                              {COLUMNS.map(col => (
                                <option key={col.label} value={col.label}>{col.label}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => removeKOL(campaign.id, kol.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove KOL"
                            >
                              <IconTrash className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/60">
                    <div className="flex items-center gap-3 text-slate-500 mb-2">
                      <IconTrendingUp className="w-5 h-5 text-indigo-500" />
                      <span className="font-medium text-sm">Total Views</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{formatNumber(totalViews)}</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/60">
                    <div className="flex items-center gap-3 text-slate-500 mb-2">
                      <IconActivity className="w-5 h-5 text-amber-500" />
                      <span className="font-medium text-sm">Avg. Engagement</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{avgER}%</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/60">
                    <div className="flex items-center gap-3 text-slate-500 mb-2">
                      <IconUsers className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-sm">KOLs Active</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{campaign.kols.length}</div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
                  <h3 className="font-semibold text-slate-800 mb-6">Budget Breakdown</h3>
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-48 h-48 relative shrink-0">
                      <DonutChart 
                        data={[
                          { label: 'Spent', value: campaign.spent, color: '#6366f1' },
                          { label: 'Remaining', value: Math.max(0, campaign.budget - campaign.spent), color: '#e2e8f0' }
                        ]} 
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-bold text-slate-900">{progress}%</span>
                        <span className="text-xs text-slate-500">Utilized</span>
                      </div>
                    </div>
                    <div className="flex-1 w-full space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-500 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-slate-200 block"></span>
                            Total Budget
                          </span>
                          <span className="font-semibold text-slate-900">{formatCurrency(campaign.budget)}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-500 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-indigo-500 block"></span>
                            Total Spent
                          </span>
                          <span className="font-semibold text-slate-900">{formatCurrency(campaign.spent)}</span>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-slate-100">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-slate-700">Remaining</span>
                          <span className="font-bold text-green-600">{formatCurrency(Math.max(0, campaign.budget - campaign.spent))}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
                  <h3 className="font-semibold text-slate-800 mb-4">Pipeline Status</h3>
                  {donutData.length > 0 ? (
                    <div className="space-y-4">
                      {COLUMNS.map(col => {
                        const count = campaign.kols.filter(k => k.status === col.label).length;
                        const percentage = campaign.kols.length > 0 ? (count / campaign.kols.length) * 100 : 0;
                        if (count === 0) return null;
                        return (
                          <div key={col.label}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-slate-600">{col.label}</span>
                              <span className="font-medium text-slate-900">{count}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                              <div className={cn("h-full rounded-full", col.bgColor.replace('bg-', 'bg-').replace('100', '500'))} style={{ width: `${percentage}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 text-center py-4">No KOLs added yet</p>
                  )}
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
                  <h3 className="font-semibold text-slate-800 mb-4">Recent Activity</h3>
                  {campaignLogs.length > 0 ? (
                    <div className="space-y-4">
                      {campaignLogs.map(log => (
                        <div key={log.id} className="flex gap-3">
                          <div className="mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                          </div>
                          <div>
                            <p className="text-sm text-slate-700">{log.action}</p>
                            <span className="text-xs text-slate-400">{formatDate(log.timestamp)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 text-center py-4">No activity yet</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {isAddModalOpen && (
        <Modal title="Add New KOL" onClose={() => setIsAddModalOpen(false)} size="md">
          <form onSubmit={handleAddKol} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input required type="text" value={kolFormData.name} onChange={e => setKolFormData({...kolFormData, name: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Platform</label>
              <select value={kolFormData.platform} onChange={e => setKolFormData({...kolFormData, platform: e.target.value as KOL['platform']})} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="YouTube">YouTube</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Followers</label>
                <input required type="number" min="0" value={kolFormData.followers} onChange={e => setKolFormData({...kolFormData, followers: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Content Target</label>
                <input required type="number" min="1" value={kolFormData.contentTarget} onChange={e => setKolFormData({...kolFormData, contentTarget: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Est. Engagement Rate (%)</label>
                <input required type="number" step="0.1" min="0" value={kolFormData.engagementRate} onChange={e => setKolFormData({...kolFormData, engagementRate: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cost Per Post (IDR)</label>
                <input required type="number" min="0" value={kolFormData.costPerPost} onChange={e => setKolFormData({...kolFormData, costPerPost: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium">Add KOL</button>
            </div>
          </form>
        </Modal>
      )}

      {isSuggestModalOpen && (
        <Modal title="Smart Match Suggestions" onClose={() => setIsSuggestModalOpen(false)}>
          <div className="space-y-4">
            <p className="text-slate-600 text-sm">We'll scan our database to find KOLs that match your campaign's target audience and fit within your remaining budget of {formatCurrency(Math.max(0, campaign.budget - campaign.spent))}.</p>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsSuggestModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium">Cancel</button>
              <button onClick={handleSuggestKols} className="px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 font-medium flex items-center gap-2">
                <IconSparkles className="w-4 h-4" />
                Find Matches
              </button>
            </div>
          </div>
        </Modal>
      )}

      {isEditModalOpen && (
        <Modal title="Edit Campaign" onClose={() => setIsEditModalOpen(false)}>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Name</label>
              <input required type="text" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea value={editFormData.description} onChange={e => setEditFormData({...editFormData, description: e.target.value})} rows={3} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                <input type="date" value={editFormData.startDate} onChange={e => setEditFormData({...editFormData, startDate: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                <input type="date" value={editFormData.endDate} onChange={e => setEditFormData({...editFormData, endDate: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Total Budget (IDR)</label>
              <input required type="number" min="0" value={editFormData.budget} onChange={e => setEditFormData({...editFormData, budget: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
              <input type="text" value={editFormData.tags} onChange={e => setEditFormData({...editFormData, tags: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Comma separated" />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium flex items-center gap-2">
                <IconCheck className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {isDeleteDialogOpen && (
        <ConfirmDialog
          title="Delete Campaign"
          message={`Are you sure you want to delete "${campaign.name}"? This action cannot be undone.`}
          variant="danger"
          onConfirm={handleDeleteCampaign}
          onCancel={() => setIsDeleteDialogOpen(false)}
        />
      )}
    </DashboardLayout>
  );
}