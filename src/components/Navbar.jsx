import React from 'react';
import { 
  Database, 
  Sun, 
  Moon, 
  Download, 
  BookOpen, 
  HelpCircle, 
  UserCheck, 
  Sliders, 
  AlertTriangle, 
  Compass, 
  CheckCircle2, 
  Play 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenDownload, 
  onStartTour 
}) {
  const { theme, toggleTheme } = useTheme();

  const mainNavItems = [
    { id: 'workbench', label: 'Analyzer Studio', icon: Sliders },
    { id: 'anomalyLab', label: 'Anomaly Lab', icon: AlertTriangle },
    { id: 'advisor', label: 'DBA Advisor', icon: Compass },
    { id: 'tests', label: 'Test Suite', icon: CheckCircle2 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('workbench')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                  Denormalization Trade-off Analyzer
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  v2.4 Pro
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                DBMS Architectural Optimization & Analytical Cost Model Engine
              </p>
            </div>
          </div>

          {/* Primary Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1">
            {mainNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar: Learn (Prominent), Developed By, Help, Download, Theme */}
          <div className="flex items-center space-x-2">
            
            {/* Guided Tour Demo Button */}
            <button
              onClick={onStartTour}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
              title="Launch interactive walkthrough tour"
            >
              <Play className="w-3 h-3 text-indigo-600 fill-indigo-600 dark:text-indigo-400 dark:fill-indigo-400" />
              <span>Tour Demo</span>
            </button>

            {/* MANDATORY: Learn Tab (Prominently placed at top-right) */}
            <button
              id="nav-learn"
              onClick={() => setActiveTab('learn')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-sm ${
                activeTab === 'learn'
                  ? 'bg-sky-600 text-white shadow-sky-500/30'
                  : 'bg-sky-500/15 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 hover:bg-sky-500/25 border border-sky-300/40 dark:border-sky-500/30'
              }`}
            >
              <BookOpen className="w-4 h-4 text-sky-600 dark:text-sky-300" />
              <span>Learn</span>
            </button>

            {/* Developed By Tab */}
            <button
              onClick={() => setActiveTab('developedBy')}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'developedBy'
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Team details and supervisor guide"
            >
              <UserCheck className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline">Developed By</span>
            </button>

            {/* Help Tab */}
            <button
              onClick={() => setActiveTab('help')}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'help'
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="User manual and operating instructions"
            >
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline">Help</span>
            </button>

            {/* Download Report Button */}
            <button
              onClick={onOpenDownload}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 transition-all"
              title="Download audit report in PDF, DOC, or Text"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>

            {/* Day/Night Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
              aria-label="Toggle Day/Night Mode"
              title={theme === 'dark' ? 'Switch to Day Mode' : 'Switch to Night Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 transition-transform rotate-0 hover:-rotate-12" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation */}
        <div className="lg:hidden flex items-center space-x-2 py-2 border-t border-slate-200 dark:border-slate-800 overflow-x-auto">
          {mainNavItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
                  isActive 
                    ? 'bg-sky-500 text-white' 
                    : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
