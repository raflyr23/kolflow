"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '../../components/DashboardLayout';
import { useApp } from '../../components/AppProvider';
import { Modal } from '../../components/Modal';
import { EmptyState } from '../../components/EmptyState';
import { 
  IconSearch, 
  IconPlus, 
  IconGrid, 
  IconList, 
  IconCalendar,
  IconUsers,
  IconArrowUp,
  IconArrowDown,
  IconAlertCircle
} from '../../components/Icons';
import { formatCurrency, formatCurrencyCompact, formatNumber, formatDate, cn } from '../../lib/utils';
import { Campaign, CampaignStatus } from '../../lib/types';

export default function CampaignsPage() {
  const { campaigns, addCampaign } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | CampaignStatus>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'budget' | 'progress'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    tags: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const stats = useMemo(() => {
    return {
      active: campaigns.filter(c => c.status === 'Active').length,
      draft: campaigns.filter(c => c.status === 'Draft').length,
      completed: campaigns.filter(c => c.status === 'Completed').length,
    };
  }, [campaigns]);

  const filteredAndSortedCampaigns = useMemo(() => {
    let result = [...campaigns];
    
    // Filter by search
    if (debouncedSearch) {
      const lowerSearch = debouncedSearch.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(lowerSearch) || 
        c.description.toLowerCase().includes(lowerSearch)
      );
    }
    
    // Filter by status
    if (statusFilter !== 'All') {
      result = result.filter(c => c.status === statusFilter);
    }
    
    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'budget':
          comparison = a.budget - b.budget;
          break;
        case 'progress':
          const aProgress = a.budget > 0 ? a.spent / a.budget : 0;
          const bProgress = b.budget > 0 ? b.spent / b.budget : 0;
          comparison = aProgress - bProgress;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [campaigns, debouncedSearch, statusFilter, sortBy, sortOrder]);

  const toggleSort = (field: 'name' | 'date' | 'budget' | 'progress') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder(field === 'name' ? 'asc' : 'desc');
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Campaign name is required.');
      return;
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const budgetNum = Number(formData.budget);

    if (formData.startDate && formData.endDate && endDate < startDate) {
      setError('End date must be after start date.');
      return;
    }

    if (isNaN(budgetNum) || budgetNum < 0) {
      setError('Budget must be a positive number.');
      return;
    }

    const tagsArray = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const now = new Date().toISOString();
    
    const newCampaign: Campaign = {
      id: 'c' + Date.now(),
      name: formData.name,
      description: formData.description,
      startDate: formData.startDate || '',
      endDate: formData.endDate || '',
      budget: budgetNum,
      spent: 0,
      status: 'Draft',
      kols: [],
      tags: tagsArray,
      createdAt: now,
      updatedAt: now,
    };

    addCampaign(newCampaign);
    setIsModalOpen(false);
    setFormData({ name: '', description: '', startDate: '', endDate: '', budget: '', tags: '' });
  };

  const getStatusColor = (status: CampaignStatus) => {
    switch (status) {
      case 'Active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Draft': return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-slate-900 dark:text-white tracking-tight">Campaigns</h1>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-sm text-slate-500 dark:text-slate-400">Overview:</span>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {stats.active} Active
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  {stats.draft} Draft
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {stats.completed} Completed
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center px-3 py-1.5 bg-slate-900 text-sm text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm font-medium gap-2"
          >
            <IconPlus className="w-5 h-5" />
            New Campaign
          </button>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800/60 dark:border-slate-800/60">
          <div className="flex flex-1 flex-col sm:flex-row gap-4 w-full">
            <div className="relative flex-1 max-w-md">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all bg-white dark:bg-slate-900"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800/30">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 transition-colors",
                  viewMode === 'grid' ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300"
                )}
                title="Grid View"
              >
                <IconGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 transition-colors",
                  viewMode === 'list' ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300"
                )}
                title="List View"
              >
                <IconList className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all bg-white dark:bg-slate-900 text-sm"
              >
                <option value="date">Date Created</option>
                <option value="name">Name</option>
                <option value="budget">Budget</option>
                <option value="progress">Progress</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:bg-slate-800/30 transition-colors text-slate-600 dark:text-slate-400"
                title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              >
                {sortOrder === 'asc' ? <IconArrowUp className="w-4 h-4" /> : <IconArrowDown className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredAndSortedCampaigns.length === 0 ? (
          <EmptyState
            variant="no-results"
            title="No campaigns found"
            description={searchTerm ? `No campaigns matching "${searchTerm}"` : "Get started by creating your first campaign."}
            action={
              !searchTerm && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-3 py-1.5 bg-slate-900 text-sm text-white rounded-lg hover:bg-slate-800 font-medium transition-colors"
                >
                  Create Campaign
                </button>
              )
            }
          />
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAndSortedCampaigns.map((campaign, idx) => {
                  const progress = campaign.budget > 0 ? Math.min(100, Math.round((campaign.spent / campaign.budget) * 100)) : 0;
                  const totalViews = campaign.kols.reduce((sum, kol) => sum + kol.views, 0);
                  
                  return (
                    <Link
                      key={campaign.id}
                      href={`/campaigns/${campaign.id}`}
                      className="group block bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800/60 dark:border-slate-800/60 hover:shadow-md hover:border-indigo-300 transition-all duration-200 animate-fade-in-up"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium text-lg text-slate-900 dark:text-white group-hover:text-slate-900 dark:text-white transition-colors line-clamp-1">
                          {campaign.name}
                        </h3>
                        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", getStatusColor(campaign.status))}>
                          {campaign.status}
                        </span>
                      </div>
                      
                      {campaign.tags && campaign.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {campaign.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] rounded-md font-medium">
                              #{tag}
                            </span>
                          ))}
                          {campaign.tags.length > 3 && (
                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] rounded-md font-medium">
                              +{campaign.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-4 mb-4 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <IconUsers className="w-4 h-4 text-slate-400" />
                          <span>{campaign.kols.length} KOLs</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <IconArrowUp className="w-4 h-4 text-slate-400" />
                          <span>{formatNumber(totalViews)} Views</span>
                        </div>
                      </div>

                      <div className="space-y-1 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500 dark:text-slate-400">Budget</span>
                          <span className="font-medium text-slate-900 dark:text-white truncate ml-2">{formatCurrencyCompact(campaign.budget)}</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              progress > 90 ? "bg-red-500" : progress > 70 ? "bg-amber-500" : "bg-slate-100 dark:bg-slate-8000"
                            )}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span className="truncate mr-2">{formatCurrencyCompact(campaign.spent)} spent</span>
                          <span>{progress}%</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs text-slate-500 dark:text-slate-400 gap-1.5">
                        <IconCalendar className="w-3.5 h-3.5" />
                        <span>
                          {campaign.startDate ? formatDate(campaign.startDate) : 'No Start'} &mdash; {campaign.endDate ? formatDate(campaign.endDate) : 'No End'}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800/60 dark:border-slate-800/60 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/30/80 border-b border-slate-200 dark:border-slate-800/60 dark:border-slate-800/60">
                        <th className="px-6 py-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-900 dark:text-white" onClick={() => toggleSort('name')}>
                          Campaign Name
                        </th>
                        <th className="px-6 py-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">KOLs</th>
                        <th className="px-6 py-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-900 dark:text-white" onClick={() => toggleSort('budget')}>
                          Budget & Spent
                        </th>
                        <th className="px-6 py-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-900 dark:text-white" onClick={() => toggleSort('progress')}>
                          Progress
                        </th>
                        <th className="px-6 py-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Timeline</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAndSortedCampaigns.map((campaign) => {
                        const progress = campaign.budget > 0 ? Math.min(100, Math.round((campaign.spent / campaign.budget) * 100)) : 0;
                        return (
                          <tr key={campaign.id} className="hover:bg-slate-50 dark:bg-slate-800/30/50 dark:bg-slate-800/50 transition-colors group">
                            <td className="px-6 py-4">
                              <Link href={`/campaigns/${campaign.id}`} className="block">
                                <div className="font-medium text-slate-900 dark:text-white group-hover:text-slate-900 dark:text-white transition-colors">{campaign.name}</div>
                                {campaign.tags && campaign.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {campaign.tags.slice(0, 2).map((tag, i) => (
                                      <span key={i} className="text-[10px] text-slate-500 dark:text-slate-400">#{tag}</span>
                                    ))}
                                    {campaign.tags.length > 2 && <span className="text-[10px] text-slate-400">+{campaign.tags.length - 2}</span>}
                                  </div>
                                )}
                              </Link>
                            </td>
                            <td className="px-6 py-4">
                              <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border", getStatusColor(campaign.status))}>
                                {campaign.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                              {campaign.kols.length}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-slate-900 dark:text-white">{formatCurrencyCompact(campaign.budget)}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">{formatCurrencyCompact(campaign.spent)} spent</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="w-24">
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden mb-1">
                                  <div 
                                    className={cn(
                                      "h-full rounded-full transition-all",
                                      progress > 90 ? "bg-red-500" : progress > 70 ? "bg-amber-500" : "bg-slate-100 dark:bg-slate-8000"
                                    )}
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 text-right">{progress}%</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400">
                              <div className="whitespace-nowrap" suppressHydrationWarning>{campaign.startDate ? formatDate(campaign.startDate) : '-'}</div>
                              <div className="whitespace-nowrap text-slate-400" suppressHydrationWarning>to {campaign.endDate ? formatDate(campaign.endDate) : '-'}</div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {isModalOpen && (
        <Modal
          title="Create New Campaign"
          onClose={() => {
            setIsModalOpen(false);
            setError('');
          }}
          size="md"
          footer={
            <div className="flex justify-end gap-3 w-full">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="create-campaign-form"
                className="px-3 py-1.5 bg-slate-900 text-sm text-white font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
              >
                Create Campaign
              </button>
            </div>
          }
        >
          <form id="create-campaign-form" onSubmit={handleCreateSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700 text-sm">
                <IconAlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Campaign Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                placeholder="e.g. Summer Sale 2024"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all resize-none"
                placeholder="Brief description of the campaign goals..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Total Budget (IDR) *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">Rp</span>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.budget}
                  onChange={e => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tags</label>
              <input
                type="text"
                value={formData.tags}
                onChange={e => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                placeholder="Comma separated (e.g. fashion, summer, promo)"
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Separate multiple tags with commas.</p>
            </div>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  );
}







