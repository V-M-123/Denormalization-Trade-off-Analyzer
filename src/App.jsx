import React, { useState, useMemo } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Workbench from './components/Workbench';
import AnomalyLab from './components/AnomalyLab';
import RecommendationEngine from './components/RecommendationEngine';
import TestSuite from './components/TestSuite';
import LearnSection from './components/LearnSection';
import DevelopedBy from './components/DevelopedBy';
import HelpSection from './components/HelpSection';
import DownloadModal from './components/DownloadModal';
import GuidedTourModal from './components/GuidedTourModal';
import { calculateTradeoffs } from './engine/costModel';
import { WORKLOAD_PRESETS } from './engine/presets';
import { Database, GraduationCap } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('workbench');
  const [selectedPresetId, setSelectedPresetId] = useState('ecommerce');
  const [params, setParams] = useState(() => WORKLOAD_PRESETS[0].params);
  
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  // Compute live mathematical trade-offs
  const metrics = useMemo(() => {
    return calculateTradeoffs(params);
  }, [params]);

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        
        {/* Navigation Bar with Prominent Learn, Developed By, Help, Download, and Day/Night mode */}
        <Navbar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenDownload={() => setIsDownloadOpen(true)}
          onStartTour={() => setIsTourOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {activeTab === 'workbench' && (
            <Workbench 
              params={params}
              setParams={setParams}
              metrics={metrics}
              selectedPresetId={selectedPresetId}
              setSelectedPresetId={setSelectedPresetId}
            />
          )}

          {activeTab === 'anomalyLab' && (
            <AnomalyLab />
          )}

          {activeTab === 'advisor' && (
            <RecommendationEngine metrics={metrics} />
          )}

          {activeTab === 'tests' && (
            <TestSuite />
          )}

          {activeTab === 'learn' && (
            <LearnSection />
          )}

          {activeTab === 'developedBy' && (
            <DevelopedBy />
          )}

          {activeTab === 'help' && (
            <HelpSection />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span className="font-bold text-slate-700 dark:text-slate-200">
                Denormalization Trade-off Analyzer
              </span>
              <span>— DBMS Architectural Cost Engine</span>
            </div>

            <div className="flex items-center space-x-1.5">
              <span>Guided By:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Dr. Swaminathan A
              </span>
              <span>(Assistant Professor)</span>
            </div>

            <div className="text-[11px]">
              Academic Project Review (DA1) • Evaluated on 7 Core Criteria
            </div>
          </div>
        </footer>

        {/* Export / Download Report Modal */}
        <DownloadModal 
          isOpen={isDownloadOpen}
          onClose={() => setIsDownloadOpen(false)}
          metrics={metrics}
        />

        {/* Interactive Guided Tour Modal */}
        <GuidedTourModal 
          isOpen={isTourOpen}
          onClose={() => setIsTourOpen(false)}
          onNavigateTab={(tabId) => setActiveTab(tabId)}
        />

      </div>
    </ThemeProvider>
  );
}
