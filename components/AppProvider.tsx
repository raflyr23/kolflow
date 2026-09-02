"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Campaign, KOL, ActivityLog, KolStatus, CampaignStatus } from '../lib/types';
import { IconAlertCircle, IconCheck } from './Icons';

interface Toast {
  message: string;
  variant: 'success' | 'error' | 'info';
}

interface AppContextType {
  isAuth: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  campaigns: Campaign[];
  activityLog: ActivityLog[];
  addCampaign: (c: Campaign) => Promise<void>;
  updateCampaign: (id: string, updates: Partial<Campaign>) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
  updateCampaignStatus: (id: string, status: CampaignStatus) => Promise<void>;
  addKOL: (campaignId: string, kol: KOL) => Promise<void>;
  removeKOL: (campaignId: string, kolId: string) => Promise<void>;
  updateKOL: (campaignId: string, kolId: string, updates: Partial<KOL>) => Promise<void>;
  updateKOLStatus: (campaignId: string, kolId: string, status: KolStatus) => Promise<void>;
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
  const { data: session, status } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  const [theme, setTheme] = useState<'light'|'dark'>('light');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [toast, setToast] = useState<Toast | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuth = status === 'authenticated';

  useEffect(() => {
    setIsMounted(true);
    const storedTheme = localStorage.getItem('kolflow_theme');
    if (storedTheme === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      setIsLoading(true);
      fetch('/api/campaigns')
        .then(async res => {
          const text = await res.text();
          if (!res.ok) {
            console.error('API Error:', res.status, text);
            throw new Error(`API Error ${res.status}: ${text}`);
          }
          if (!text) return [];
          try {
            return JSON.parse(text);
          } catch (e) {
            console.error('JSON Parse Error on:', text);
            throw new Error('Invalid JSON response');
          }
        })
        .then(data => {
          if (Array.isArray(data)) {
            const parsed = data.map((c: any) => ({
              ...c,
              tags: typeof c.tags === 'string' ? JSON.parse(c.tags) : c.tags
            }));
            setCampaigns(parsed);
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else if (status === 'unauthenticated') {
      setCampaigns([]);
      setIsLoading(false);
    }
  }, [status]);

  const showToast = (message: string, variant: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, variant });
    setTimeout(() => setToast(null), 3000);
  };

  const login = () => router.push('/login');
  
  const logout = () => {
    signOut({ callbackUrl: '/login' });
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

  const addCampaign = async (campaign: Campaign) => {
    const res = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaign)
    });
    if (res.ok) {
      const newC = await res.json();
      newC.tags = typeof newC.tags === 'string' ? JSON.parse(newC.tags) : newC.tags;
      setCampaigns(prev => [newC, ...prev]);
      showToast('Campaign created successfully');
    }
  };

  const updateCampaign = async (id: string, updates: Partial<Campaign>) => {
    const res = await fetch('/api/campaigns/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      const updated = await res.json();
      updated.tags = typeof updated.tags === 'string' ? JSON.parse(updated.tags) : updated.tags;
      setCampaigns(prev => prev.map(c => c.id === id ? updated : c));
      showToast('Campaign updated successfully');
    }
  };

  const deleteCampaign = async (id: string) => {
    const res = await fetch('/api/campaigns/' + id, { method: 'DELETE' });
    if (res.ok) {
      setCampaigns(prev => prev.filter(c => c.id !== id));
      showToast('Campaign deleted successfully');
    }
  };

  const updateCampaignStatus = async (id: string, status: CampaignStatus) => {
    await updateCampaign(id, { status });
  };

  const addKOL = async (campaignId: string, kol: KOL) => {
    const res = await fetch('/api/kols', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...kol, campaignId })
    });
    if (res.ok) {
      const newKol = await res.json();
      setCampaigns(prev => prev.map(c => {
        if (c.id === campaignId) {
          return { ...c, kols: [...(c.kols || []), newKol] };
        }
        return c;
      }));
      showToast('KOL added successfully');
    }
  };

  const updateKOL = async (campaignId: string, kolId: string, updates: Partial<KOL>) => {
    const res = await fetch('/api/kols/' + kolId, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      const updatedKol = await res.json();
      setCampaigns(prev => prev.map(c => {
        if (c.id === campaignId) {
          return { ...c, kols: c.kols.map(k => k.id === kolId ? updatedKol : k) };
        }
        return c;
      }));
      showToast('KOL updated successfully');
    }
  };

  const updateKOLStatus = async (campaignId: string, kolId: string, status: KolStatus) => {
    await updateKOL(campaignId, kolId, { status });
  };

  const removeKOL = async (campaignId: string, kolId: string) => {
    const res = await fetch('/api/kols/' + kolId, { method: 'DELETE' });
    if (res.ok) {
      setCampaigns(prev => prev.map(c => {
        if (c.id === campaignId) {
          return { ...c, kols: c.kols.filter(k => k.id !== kolId) };
        }
        return c;
      }));
      showToast('KOL removed successfully');
    }
  };

  const resetData = () => {};
  const exportData = () => '';
  const importData = (str: string) => true;

  if (!isMounted) return null;

  return (
    <AppContext.Provider value={{
      isAuth,
      isLoading,
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
        <div className="fixed top-4 right-4 z-50 animate-toast-in">
          <div className={`relative flex items-center gap-3 pl-4 pr-10 py-3 rounded-xl shadow-lg border overflow-hidden ${
            toast.variant === 'error' ? 'bg-white dark:bg-slate-900 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400' :
            toast.variant === 'info' ? 'bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400' :
            'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
          }`}>
            {toast.variant === 'error' ? <IconAlertCircle className="w-4 h-4 shrink-0" /> : <IconCheck className="w-4 h-4 shrink-0" />}
            <p className="text-sm font-medium">{toast.message}</p>
            <button onClick={() => setToast(null)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className={`absolute bottom-0 left-0 h-0.5 animate-shrink ${
              toast.variant === 'error' ? 'bg-red-400' :
              toast.variant === 'info' ? 'bg-blue-400' :
              'bg-emerald-400'
            }`} />
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};


