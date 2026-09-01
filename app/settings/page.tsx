"use client";

import React, { useRef, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { useApp } from '../../components/AppProvider';
import { IconDownload, IconRefresh, IconCheck, IconAlertCircle } from '../../components/Icons';

export default function SettingsPage() {
  const { exportData, importData, resetData, showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleExport = () => {
    try {
      const dataStr = exportData();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kolflow-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Data exported successfully', 'success');
    } catch (err) {
      showToast('Failed to export data', 'error');
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        if (content) {
          importData(content);
          showToast('Data imported successfully', 'success');
        }
      } catch (err) {
        showToast('Invalid backup file format', 'error');
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReset = () => {
    resetData();
    setShowResetConfirm(false);
    showToast('All data has been reset', 'success');
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl mx-auto space-y-8 animate-fade-in-up">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-slate-900 dark:text-white">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your profile, data, and application preferences.</p>
        </div>

        {/* Profile Section */}
        <section className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800/60 dark:border-slate-800/60">
          <h2 className="text-lg font-medium tracking-tight text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Profile</h2>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-medium tracking-tight shadow-md">
              AD
            </div>
            <div>
              <h3 className="text-xl font-medium tracking-tight text-slate-900 dark:text-white">Admin</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-2">admin@kolflow.demo</p>
              <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Administrator
              </div>
            </div>
          </div>
          <div className="mt-6 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-2 text-sm text-blue-700">
            <IconAlertCircle className="w-4 h-4 shrink-0" />
            This is a demo account. Profile details cannot be changed.
          </div>
        </section>

        {/* Data Management Section */}
        <section className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800/60 dark:border-slate-800/60">
          <h2 className="text-lg font-medium tracking-tight text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Data Management</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* Export/Import */}
            <div className="space-y-4">
              <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-800/30">
                <h4 className="font-medium text-slate-900 dark:text-white mb-1">Export Data</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Download a JSON backup of all campaigns, KOLs, and settings.</p>
                <button 
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:bg-slate-800/30 transition-colors text-sm font-medium shadow-sm"
                >
                  <IconDownload className="w-4 h-4" />
                  Export Backup
                </button>
              </div>

              <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-800/30">
                <h4 className="font-medium text-slate-900 dark:text-white mb-1">Import Data</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Restore your workspace from a previous JSON backup file.</p>
                <input 
                  type="file" 
                  accept=".json" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleImport}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:bg-slate-800/30 transition-colors text-sm font-medium shadow-sm"
                >
                  <IconRefresh className="w-4 h-4" />
                  Import Backup
                </button>
              </div>
            </div>

            {/* Reset */}
            <div className="p-4 border border-red-100 rounded-lg bg-red-50/50 flex flex-col h-full">
              <h4 className="font-medium text-red-900 mb-1">Danger Zone</h4>
              <p className="text-sm text-red-700/80 mb-6 flex-1">
                Permanently delete all campaigns, KOLs, and logs. This action cannot be undone unless you have a backup.
              </p>
              
              {showResetConfirm ? (
                <div className="space-y-3 p-3 bg-white dark:bg-slate-900 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-900">Are you absolutely sure?</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleReset}
                      className="flex-1 px-3 py-1.5 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      Yes, Reset
                    </button>
                    <button 
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-sm font-medium hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setShowResetConfirm(true)}
                  className="self-start px-4 py-2 bg-white dark:bg-slate-900 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium shadow-sm"
                >
                  Reset Workspace
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Keyboard Shortcuts */}
        <section className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800/60 dark:border-slate-800/60">
          <h2 className="text-lg font-medium tracking-tight text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Keyboard Shortcuts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { keys: ['⌘', 'K'], label: 'Open Command Palette (Mac)' },
              { keys: ['Ctrl', 'K'], label: 'Open Command Palette (Win)' },
              { keys: ['Esc'], label: 'Close modals & menus' },
            ].map((shortcut, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:bg-slate-800/30 border border-transparent hover:border-slate-100 dark:border-slate-800 transition-colors">
                <span className="text-sm text-slate-600 dark:text-slate-400">{shortcut.label}</span>
                <div className="flex gap-1">
                  {shortcut.keys.map((k, j) => (
                    <kbd key={j} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded text-xs font-mono text-slate-600 dark:text-slate-400 shadow-sm">
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800/60 dark:border-slate-800/60 text-center">
          <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-medium tracking-tight text-xl">K</span>
          </div>
          <h3 className="font-medium tracking-tight text-slate-900 dark:text-white mb-1">KOLFlow</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Version 2.0.0</p>
          <div className="flex items-center justify-center gap-3 text-xs font-medium mb-6">
            <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Next.js 16</span>
            <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">React 19</span>
            <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Tailwind CSS 4</span>
          </div>
          <a 
            href="https://github.com/raflyr23/kolflow" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-slate-900 dark:text-white hover:text-slate-600 dark:text-slate-400 font-medium hover:underline"
          >
            View Source on GitHub
          </a>
        </section>
      </div>
    </DashboardLayout>
  );
}





