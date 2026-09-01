'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export const Tabs = ({ tabs, activeTab, onChange }: TabsProps) => {
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeEl = tabRefs.current.get(activeTab);
    const container = containerRef.current;
    if (activeEl && container) {
      const containerRect = container.getBoundingClientRect();
      const tabRect = activeEl.getBoundingClientRect();
      setIndicatorStyle({
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
      });
    }
  }, [activeTab]);

  return (
    <div ref={containerRef} className="relative border-b border-slate-200 dark:border-slate-800">
      <div className="flex gap-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => { if (el) tabRefs.current.set(tab.id, el); }}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
      {/* Animated underline indicator */}
      <div
        className="absolute bottom-0 h-0.5 bg-slate-900 transition-all duration-200 ease-out"
        style={indicatorStyle}
      />
    </div>
  );
};


