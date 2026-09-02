'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from './AppProvider';
import { IconSearch, IconHome, IconChart, IconSettings, IconUsers, IconPlus, IconLogout, IconChevronRight } from './Icons';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  category: 'Navigation' | 'Campaigns' | 'Actions';
  icon: React.ReactNode;
  action: () => void;
}

const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { campaigns, logout } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const items = useMemo<CommandItem[]>(() => {
    const navItems: CommandItem[] = [
      { id: 'nav-dashboard', label: 'Dashboard', category: 'Navigation', icon: <IconHome className="w-4 h-4" />, action: () => router.push('/dashboard') },
      { id: 'nav-campaigns', label: 'Campaigns', category: 'Navigation', icon: <IconUsers className="w-4 h-4" />, action: () => router.push('/campaigns') },
      { id: 'nav-analytics', label: 'Analytics', category: 'Navigation', icon: <IconChart className="w-4 h-4" />, action: () => router.push('/analytics') },
      { id: 'nav-settings', label: 'Settings', category: 'Navigation', icon: <IconSettings className="w-4 h-4" />, action: () => router.push('/settings') },
    ];

    const campaignItems: CommandItem[] = campaigns.map(c => ({
      id: `camp-${c.id}`,
      label: c.name,
      description: `Campaign &bull; ${c.status}`,
      category: 'Campaigns',
      icon: <IconUsers className="w-4 h-4" />,
      action: () => router.push(`/campaigns/${c.id}`)
    }));

    const actionItems: CommandItem[] = [
      { id: 'act-create', label: 'Create Campaign', category: 'Actions', icon: <IconPlus className="w-4 h-4" />, action: () => router.push('/campaigns') },
      { id: 'act-logout', label: 'Logout', category: 'Actions', icon: <IconLogout className="w-4 h-4" />, action: () => logout() },
    ];

    return [...navItems, ...campaignItems, ...actionItems];
  }, [campaigns, router, logout]);

  const filteredItems = useMemo(() => {
    if (!query) return items;
    return items.filter(item => item.label.toLowerCase().includes(query.toLowerCase()) || item.description?.toLowerCase().includes(query.toLowerCase()));
  }, [items, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredItems.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selectedItem = filteredItems[selectedIndex];
        if (selectedItem) {
          selectedItem.action();
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex]);

  if (!isOpen) return null;

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  let absoluteIndex = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <IconSearch className="w-5 h-5 text-slate-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
            placeholder="Search commands, campaigns..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <span className="text-xs text-slate-400 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">Esc</span>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No results found.
            </div>
          ) : (
            Object.entries(groupedItems).map(([category, catItems]) => (
              <div key={category} className="mb-4 last:mb-0">
                <div className="px-2 py-1 text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                  {category}
                </div>
                {catItems.map(item => {
                  const currentIndex = absoluteIndex++;
                  const isSelected = currentIndex === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer group ${
                        isSelected ? 'bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-50 dark:bg-slate-800/30'
                      }`}
                      onClick={() => {
                        item.action();
                        setIsOpen(false);
                      }}
                      onMouseEnter={() => setSelectedIndex(currentIndex)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-md ${isSelected ? 'bg-white dark:bg-slate-900 shadow-sm' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:bg-slate-900 group-hover:shadow-sm'}`}>
                          {item.icon}
                        </div>
                        <div>
                          <div className={`text-sm font-medium ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                            {item.label}
                          </div>
                          {item.description && (
                            <div className="text-xs text-slate-500 dark:text-slate-400">{item.description}</div>
                          )}
                        </div>
                      </div>
                      <IconChevronRight className={`w-4 h-4 ${isSelected ? 'text-slate-400' : 'text-transparent group-hover:text-slate-300'}`} />
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-sans">&uarr;</kbd>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-sans">&darr;</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-sans">&crarr;</kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-sans">Esc</kbd>
              Close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;



