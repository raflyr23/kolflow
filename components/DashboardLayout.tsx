'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from './AppProvider';
import { IconMenu, IconClose, IconHome, IconUsers, IconChart, IconSettings, IconSearch, IconLogout, IconChevronRight, IconSun, IconMoon } from './Icons';
import CommandPalette from './CommandPalette';
import NotificationBell from './NotificationBell';
import { Tooltip } from './Tooltip';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: <IconHome className="w-5 h-5" /> },
  { name: 'Campaigns', href: '/campaigns', icon: <IconChart className="w-5 h-5" /> },
  { name: 'KOL Database', href: '/kols', icon: <IconUsers className="w-5 h-5" /> },
  { name: 'Analytics', href: '/analytics', icon: <IconChart className="w-5 h-5" /> },
  { name: 'Settings', href: '/settings', icon: <IconSettings className="w-5 h-5" /> },
];

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuth, logout, theme, toggleTheme } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuth) {
      router.push('/login');
    }
  }, [isAuth, router]);

  if (!isAuth) return null;

  const getBreadcrumb = () => {
    if (pathname.startsWith('/dashboard')) return 'Dashboard';
    if (pathname === '/campaigns') return 'Campaigns';
    if (pathname.startsWith('/campaigns/')) return 'Campaigns > Detail';
    if (pathname === '/kols') return 'KOL Database';
    if (pathname.startsWith('/kols/')) return 'KOL Database > Profile';
    if (pathname.startsWith('/analytics')) return 'Analytics';
    if (pathname.startsWith('/settings')) return 'Settings';
    return '';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 flex items-center justify-between z-20">
        <span className="font-semibold tracking-tight text-slate-900 dark:text-white">KOLFlow</span>
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 -mr-2 text-slate-500 dark:text-slate-400">
          <IconMenu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 h-screen z-40 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 transition-all duration-300 ease-in-out
        ${mobileMenuOpen ? 'left-0' : '-left-64 md:left-0'}
        ${sidebarCollapsed ? 'w-16' : 'w-60'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-14 flex items-center border-b border-slate-100 dark:border-slate-800 px-4 overflow-hidden">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white dark:text-slate-900 text-xs font-bold">K</span>
              </div>
              <span className={`font-semibold tracking-tight text-slate-900 dark:text-white whitespace-nowrap transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                KOLFlow
              </span>
            </div>
            {mobileMenuOpen && (
              <button onClick={() => setMobileMenuOpen(false)} className="ml-auto p-1 text-slate-400 md:hidden">
                <IconClose className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto py-3">
            <ul className="space-y-0.5 px-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                
                const linkContent = (
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 overflow-hidden ${
                      isActive
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex-shrink-0">{item.icon}</div>
                    <span className={`font-medium text-sm transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>{item.name}</span>
                  </Link>
                );

                return (
                  <li key={item.href}>
                    {sidebarCollapsed ? (
                      <Tooltip content={item.name} position="right">
                        {linkContent}
                      </Tooltip>
                    ) : linkContent}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User section & Collapse Toggle */}
          <div className="border-t border-slate-100 dark:border-slate-800 p-3">
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} overflow-hidden`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center text-xs font-medium flex-shrink-0">
                  AD
                </div>
                <div className={`flex flex-col transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">Admin</span>
                  <span className="text-xs text-slate-400">admin@kolflow.demo</span>
                </div>
              </div>
              {!sidebarCollapsed && (
                <button onClick={logout} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <IconLogout className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <button 
              className="mt-3 hidden md:flex items-center justify-center w-full p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <IconChevronRight className={`w-4 h-4 transition-transform duration-200 ${sidebarCollapsed ? '' : 'rotate-180'}`} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen md:min-w-0">
        {/* Top bar (desktop only) */}
        <header className="hidden md:flex h-14 items-center justify-between px-8 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {getBreadcrumb()}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <IconSun className="w-4 h-4" /> : <IconMoon className="w-4 h-4" />}
            </button>

            <NotificationBell />

            <button 
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-400 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
              onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
            >
              <IconSearch className="w-3.5 h-3.5" />
              <span className="text-xs">Search...</span>
              <kbd className="hidden sm:inline-block px-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-[10px] ml-1 font-mono text-slate-400">Ctrl K</kbd>
            </button>
          </div>
        </header>

        {/* Content with page transition */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto mt-14 md:mt-0" key={pathname}>
          <div className="animate-page-enter">
            {children}
          </div>
        </main>
      </div>

      <CommandPalette />
    </div>
  );
};

export { DashboardLayout };
