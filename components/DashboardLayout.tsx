'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from './AppProvider';
import { IconMenu, IconClose, IconHome, IconUsers, IconChart, IconSettings, IconSearch, IconLogout, IconChevronRight, IconSun, IconMoon } from './Icons';
import CommandPalette from './CommandPalette';

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
    if (pathname.startsWith('/analytics')) return 'Analytics';
    if (pathname.startsWith('/settings')) return 'Settings';
    return '';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-800/30 flex">
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between z-20">
        <span className="font-semibold tracking-tight text-slate-900 dark:text-white">KOLFlow</span>
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 -mr-2 text-slate-500 dark:text-slate-400">
          <IconMenu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 h-screen z-40 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300
        ${mobileMenuOpen ? 'left-0' : '-left-64 md:left-0'}
        ${sidebarCollapsed ? 'w-16' : 'w-64'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-14 flex items-center border-b border-slate-200 dark:border-slate-800 px-4 overflow-hidden">
            <span className="font-semibold tracking-tight text-lg text-slate-900 dark:text-white whitespace-nowrap">
              {sidebarCollapsed ? 'K' : 'KOLFlow'}
            </span>
            {mobileMenuOpen && (
              <button onClick={() => setMobileMenuOpen(false)} className="ml-auto p-1 text-slate-500 dark:text-slate-400 md:hidden">
                <IconClose className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors overflow-hidden ${
                        isActive
                          ? 'bg-slate-50 dark:bg-slate-800/30 text-slate-900 dark:text-white shadow-sm border-l-2 border-slate-900'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-50 dark:bg-slate-800/30'
                      }`}
                      title={sidebarCollapsed ? item.name : undefined}
                    >
                      <div className="flex-shrink-0">{item.icon}</div>
                      {!sidebarCollapsed && <span className="font-medium text-sm">{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User section & Collapse Toggle */}
          <div className="border-t border-slate-200 dark:border-slate-800 p-4">
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} overflow-hidden`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-medium flex-shrink-0">
                  AD
                </div>
                {!sidebarCollapsed && (
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">Admin</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">admin@kolflow.demo</span>
                  </div>
                )}
              </div>
              {!sidebarCollapsed && (
                <button onClick={logout} className="p-1.5 text-slate-400 hover:text-slate-900 dark:text-white rounded-md hover:bg-slate-100 dark:bg-slate-800">
                  <IconLogout className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <button 
              className="mt-4 hidden md:flex items-center justify-center w-full p-2 text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-50 dark:bg-slate-800/30 rounded-lg transition-colors"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <IconChevronRight className={`w-5 h-5 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen md:min-w-0">
        {/* Top bar (desktop only) */}
        <header className="hidden md:flex h-14 items-center justify-between px-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {getBreadcrumb()}
                      </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300 transition-colors rounded-full hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <IconSun className="w-5 h-5" /> : <IconMoon className="w-5 h-5" />}
              </button>
            <button 
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-100 dark:bg-slate-800 transition-colors"
              onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
            >
              <IconSearch className="w-4 h-4" />
              <span>Search...</span>
              <kbd className="hidden sm:inline-block px-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs ml-2 font-sans text-slate-400">Ctrl K</kbd>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto mt-14 md:mt-0">
          {children}
        </main>
      </div>

      <CommandPalette />
    </div>
  );
};

export { DashboardLayout };






