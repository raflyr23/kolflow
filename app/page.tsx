"use client";

import Link from 'next/link';
import { useApp } from '../components/AppProvider';
import {
  IconGrid,
  IconChart,
  IconSparkles,
  IconChevronRight,
  IconCheck,
  IconTrendingUp,
} from '../components/Icons';

export default function LandingPage() {
  const { isAuth } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-800/30 flex flex-col font-sans selection:bg-slate-200 selection:text-indigo-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <IconSparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold tracking-tight text-xl text-slate-900 dark:text-white tracking-tight">KOLFlow</span>
          </div>
          <nav>
            {isAuth ? (
              <Link
                href="/dashboard"
                className="text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Go to Workspace
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/login"
                  className="text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Try Demo
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="py-20 lg:py-32 px-6 overflow-hidden">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left Column */}
            <div className="flex-1 text-center lg:text-left animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-indigo-100 text-indigo-700 text-sm font-medium mb-6">
                <IconSparkles className="w-4 h-4" />
                <span>v2.0 â€” Now with Analytics</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-semibold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6">
                Track influencer campaigns with <span className="text-slate-900 dark:text-white">precision.</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Streamline your KOL marketing workflow. Manage creators, track budgets, and measure performance across all platforms in one powerful workspace.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                >
                  Start Demo Workspace
                  <IconChevronRight className="w-4 h-4" />
                </Link>
                <a
                  href="https://github.com/raflyr23/kolflow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-lg font-medium hover:bg-slate-50 dark:bg-slate-800/30 transition-colors"
                >
                  View on GitHub
                </a>
              </div>
            </div>

            {/* Right Column: Abstract Dashboard Preview */}
            <div className="flex-1 w-full max-w-lg lg:max-w-none animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-lg p-6 relative overflow-hidden">
                {/* Decorative header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                      <IconChart className="w-5 h-5 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <div className="h-4 w-24 bg-slate-200 rounded mb-1.5" />
                      <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800" />
                    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800" />
                  </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30/50 dark:bg-slate-800/50">
                    <div className="h-3 w-20 bg-slate-200 rounded mb-3" />
                    <div className="h-6 w-24 bg-slate-900 rounded mb-2" />
                    <div className="flex items-center gap-1">
                      <IconTrendingUp className="w-3 h-3 text-emerald-500" />
                      <div className="h-2 w-12 bg-emerald-100 rounded" />
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30/50 dark:bg-slate-800/50">
                    <div className="h-3 w-20 bg-slate-200 rounded mb-3" />
                    <div className="h-6 w-24 bg-slate-900 rounded mb-2" />
                    <div className="flex items-center gap-1">
                      <IconTrendingUp className="w-3 h-3 text-emerald-500" />
                      <div className="h-2 w-12 bg-emerald-100 rounded" />
                    </div>
                  </div>
                </div>

                {/* Abstract Bar Chart */}
                <div className="flex items-end gap-3 h-32 pt-4">
                  {[40, 70, 45, 90, 65, 80].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2 h-full">
                      <div 
                        className="w-full rounded-t-md bg-slate-100 dark:bg-slate-8000" 
                        style={{ height: `${h}%` }}
                      />
                    </div>
                  ))}
                </div>

                {/* Floating Status Pill */}
                <div className="absolute top-20 right-4 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full shadow-lg border border-slate-100 dark:border-slate-800 flex items-center gap-2 animate-bounce">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Campaign Active</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white dark:bg-slate-900 py-20 px-6 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white mb-4">Everything you need to scale</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                Built specifically for modern marketing teams to organize chaos into clarity.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-6 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-slate-200 text-slate-900 dark:text-white rounded-lg flex items-center justify-center mb-6">
                  <IconGrid className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white mb-3">Campaign Kanban</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Visual drag-and-drop boards to track influencer progress from initial outreach to final content publication.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-6">
                  <IconChart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white mb-3">Live Analytics</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Monitor campaign performance, track budget utilization, and measure ROI with beautiful, easy-to-read charts.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mb-6">
                  <IconSparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white mb-3">Smart Matching</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Keep a centralized database of all your creators, their platforms, engagement rates, and historical performance.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 bg-slate-900 text-slate-400 text-center text-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>Â© {new Date().getFullYear()} KOLFlow. Built as a portfolio project.</p>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="px-2 py-1 rounded bg-slate-800">React 19</span>
            <span className="px-2 py-1 rounded bg-slate-800">Next.js 16</span>
            <span className="px-2 py-1 rounded bg-slate-800">Tailwind CSS 4</span>
            <span className="px-2 py-1 rounded border border-slate-700 text-slate-300">No external UI libraries</span>
          </div>
        </div>
      </footer>
    </div>
  );
}




