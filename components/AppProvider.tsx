'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Campaign, KOL, ActivityLog, KolStatus, CampaignStatus } from '../lib/types';
import { initialCampaigns, initialActivityLog } from '../lib/mockData';
import { IconAlertCircle, IconCheck } from './Icons';

interface Toast {
  message: string;
  variant: 'success' | 'error' | 'info';
}

interface AppContextType {
  isAuth: boolean;
  login: () => void;
  logout: () => void;
  campaigns: Campaign[];
  activityLog: ActivityLog[];
  addCampaign: (c: Campaign) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  updateCampaignStatus: (id: string, status: CampaignStatus) => void;
  addKOL: (campaignId: string, kol: KOL) => void;
  removeKOL: (campaignId: string, kolId: string) => void;
  updateKOL: (campaignId: string, kolId: string, updates: Partial<KOL>) => void;
  updateKOLStatus: (campaignId: string, kolId: string, status: KolStatus) => void;
  resetData: () => void;
  exportData: () => string;
  importData: (jsonStr: string) => boolean;
  showToast: (msg: string, variant?: 'success' | 'error' | 'info') => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [theme, setTheme] = useState<'light'|'dark'>('light');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem('kolflow_auth');
    if (auth === 'true') {
      setIsAuth(true);
    }
    const storedTheme = localStorage.getItem('kolflow_theme');
    if (storedTheme === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
    
    const storedCampaigns = localStorage.getItem('kolflow_campaigns');
    if (storedCampaigns) {
      try {
        setCampaigns(JSON.parse(storedCampaigns));
      } catch (e) {
        setCampaigns(initialCampaigns);
      }
    } else {
      setCampaigns(initialCampaigns);
      localStorage.setItem('kolflow_campaigns', JSON.stringify(initialCampaigns));
    }
    
    const storedActivity = localStorage.getItem('kolflow_activity');
    if (storedActivity) {
      try {
        setActivityLog(JSON.parse(storedActivity));
      } catch (e) {
        setActivityLog(initialActivityLog);
      }
    } else {
      setActivityLog(initialActivityLog);
      localStorage.setItem('kolflow_activity', JSON.stringify(initialActivityLog));
    }
    
    setIsMounted(true);
  }, []);

  const showToast = (msg: string, variant: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message: msg, variant });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const saveCampaigns = (newCampaigns: Campaign[]) => {
    setCampaigns(newCampaigns);
    localStorage.setItem('kolflow_campaigns', JSON.stringify(newCampaigns));
  };

  const saveActivity = (newActivity: ActivityLog[]) => {
    setActivityLog(newActivity);
    localStorage.setItem('kolflow_activity', JSON.stringify(newActivity));
  };

  const addActivity = (action: ActivityLog['action'], details: string, campaignId?: string, kolId?: string) => {
    const newEntry: ActivityLog = {
      id: Math.random().toString(36).substring(2, 9),
      action,
      detail: details,
      timestamp: new Date().toISOString(),
      campaignId,
      campaignName: campaignId ? campaigns.find(c => c.id === campaignId)?.name : '',
      kolId
    };
    saveActivity([newEntry, ...activityLog]);
  };

    const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('kolflow_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const login = () => {
    setIsAuth(true);
    localStorage.setItem('kolflow_auth', 'true');
    router.push('/dashboard');
  };

  const logout = () => {
    setIsAuth(false);
    localStorage.removeItem('kolflow_auth');
    router.push('/login');
  };

  const addCampaign = (c: Campaign) => {
    saveCampaigns([c, ...campaigns]);
    addActivity('campaign_created', `Created campaign ${c.name}`, c.id);
    showToast('Campaign created successfully', 'success');
  };

  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    const newCampaigns = campaigns.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c);
    saveCampaigns(newCampaigns);
    addActivity('campaign_updated', `Updated campaign`, id);
    showToast('Campaign updated successfully', 'success');
  };

  const deleteCampaign = (id: string) => {
    const newCampaigns = campaigns.filter(c => c.id !== id);
    saveCampaigns(newCampaigns);
    addActivity('campaign_deleted', `Deleted campaign`, id);
    showToast('Campaign deleted successfully', 'success');
  };

  const updateCampaignStatus = (id: string, status: CampaignStatus) => {
    const newCampaigns = campaigns.map(c => c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c);
    saveCampaigns(newCampaigns);
    addActivity('campaign_status_changed', `Changed campaign status to ${status}`, id);
    showToast(`Campaign status updated to ${status}`, 'success');
  };

  const addKOL = (campaignId: string, kol: KOL) => {
    const newCampaigns = campaigns.map(c => c.id === campaignId ? { ...c, kols: [...c.kols, kol], updatedAt: new Date().toISOString() } : c);
    saveCampaigns(newCampaigns);
    addActivity('kol_added', `Added KOL ${kol.name}`, campaignId, kol.id);
    showToast('KOL added successfully', 'success');
  };

  const removeKOL = (campaignId: string, kolId: string) => {
    const newCampaigns = campaigns.map(c => c.id === campaignId ? { ...c, kols: c.kols.filter(k => k.id !== kolId), updatedAt: new Date().toISOString() } : c);
    saveCampaigns(newCampaigns);
    addActivity('kol_removed', `Removed KOL`, campaignId, kolId);
    showToast('KOL removed successfully', 'success');
  };

  const updateKOL = (campaignId: string, kolId: string, updates: Partial<KOL>) => {
    const newCampaigns = campaigns.map(c => c.id === campaignId ? {
      ...c,
      kols: c.kols.map(k => k.id === kolId ? { ...k, ...updates } : k),
      updatedAt: new Date().toISOString()
    } : c);
    saveCampaigns(newCampaigns);
    addActivity('kol_updated', `Updated KOL`, campaignId, kolId);
    showToast('KOL updated successfully', 'success');
  };

  const updateKOLStatus = (campaignId: string, kolId: string, status: KolStatus) => {
    const newCampaigns = campaigns.map(c => c.id === campaignId ? {
      ...c,
      kols: c.kols.map(k => k.id === kolId ? { ...k, status } : k),
      updatedAt: new Date().toISOString()
    } : c);
    saveCampaigns(newCampaigns);
    addActivity('kol_status_changed', `Changed KOL status to ${status}`, campaignId, kolId);
    showToast(`KOL status updated to ${status}`, 'success');
  };

  const resetData = () => {
    saveCampaigns(initialCampaigns);
    saveActivity(initialActivityLog);
    showToast('Data reset to default', 'info');
  };

  const exportData = () => {
    return JSON.stringify({ campaigns, activityLog }, null, 2);
  };

  const importData = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && Array.isArray(parsed.campaigns)) {
        saveCampaigns(parsed.campaigns);
        if (Array.isArray(parsed.activityLog)) {
          saveActivity(parsed.activityLog);
        }
        showToast('Data imported successfully', 'success');
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    showToast('Failed to import data', 'error');
    return false;
  };

  if (!isMounted) return null;

  return (
    <AppContext.Provider value={{
      isAuth,
      login,
      logout,
      campaigns,
      activityLog,
      addCampaign,
      updateCampaign,
      deleteCampaign,
      updateCampaignStatus,
      addKOL,
      removeKOL,
      updateKOL,
      updateKOLStatus,
      resetData,
      exportData,
      importData,
      showToast,
      theme,
      toggleTheme
    }}>
      {children}
      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 animate-slide-in-bottom flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium
          ${toast.variant === 'error' ? 'bg-red-600 text-white' 
            : toast.variant === 'info' ? 'bg-blue-600 text-white' 
            : 'bg-slate-900 text-white'}`}>
          {toast.variant === 'error' && <IconAlertCircle className="w-4 h-4" />}
          {toast.variant === 'success' && <IconCheck className="w-4 h-4" />}
          {toast.message}
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};


