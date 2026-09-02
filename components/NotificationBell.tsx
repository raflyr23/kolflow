'use client';

import { useState, useRef, useEffect } from 'react';
import { useApp } from './AppProvider';
import { IconBell } from './Icons';
import { formatRelativeDate } from '../lib/utils';

export default function NotificationBell() {
  const { activityLog } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [readCount, setReadCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = Math.max(0, activityLog.length - readCount);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const markAllRead = () => setReadCount(activityLog.length);

  const recentActivities = activityLog.slice(0, 5);

  const getActionColor = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('add') || act.includes('create')) return 'bg-green-500';
    if (act.includes('delete') || act.includes('remove')) return 'bg-red-500';
    return 'bg-slate-400';
  };

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={toggleDropdown}
        className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors focus:outline-none"
        aria-label="Notifications"
      >
        <IconBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center bg-red-500 text-white text-[10px] font-medium rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-medium text-sm text-slate-900 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllRead}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
              >
                Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-[300px] overflow-y-auto">
            {recentActivities.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-slate-500">
                No notifications yet
              </div>
            ) : (
              <ul className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {recentActivities.map((activity) => (
                  <li key={activity.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex gap-3">
                      <div className="mt-1 flex-shrink-0">
                        <div className={`w-2 h-2 rounded-full ${getActionColor(activity.action)}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {activity.detail}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {formatRelativeDate(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
