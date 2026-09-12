import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Compass, 
  Sliders, 
  Zap, 
  AlertTriangle, 
  Download,
  BookOpen
} from 'lucide-react';

export default function GuidedTourModal({ isOpen, onClose, onNavigateTab }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      title: 'Welcome to the Denormalization Analyzer',
      subtitle: 'Architecture Overview & Purpose',
      icon: Compass,
      description: 'This application rigorously evaluates the trade-offs between Normalized (3NF/BCNF) and Denormalized schemas. It provides mathematical cost models for read acceleration vs write amplification, storage bloat, and anomaly risks.',
      targetTab: 'workbench',
      highlight: 'Use the top tabs to navigate between the Analyzer Studio, Anomaly Lab, DBA Advisor, and Test Suite.'
    },
    {
      title: 'Step 1: Choose or Customize a Workload Preset',
      subtitle: 'Real-world scenarios from E-Commerce to Banking',
      icon: Sliders,
      description: 'Switch between production presets (E-Commerce, Social Media, Financial Banking, IoT Telemetry). Each preset automatically configures realistic row counts, query join depths, and read-to-write traffic ratios.',
      targetTab: 'workbench',
      highlight: 'Notice how read-heavy workloads favor denormalization, while write-heavy workloads suffer severe penalties.'
    },
    {
      title: 'Step 2: Review Trade-off KPIs & Crossover Curve',
      subtitle: 'Identifying the exact tipping point',
      icon: Zap,
      description: 'The Crossover Chart dynamically calculates the exact Read % where denormalization becomes beneficial. The KPIs immediately report read speedup (e.g. 8x faster) alongside write amplification fanout (e.g. 5x penalty).',
      targetTab: 'workbench',
      highlight: 'Check the Storage Allocation bar chart to see how duplicate columns bloat disk usage.'
    },
    {
      title: 'Step 3: Interactive Data Anomaly Simulator',
      subtitle: 'Why denormalization causes production bugs',
      icon: AlertTriangle,
      description: 'In the Anomaly Lab, simulate what happens when a customer address update encounters a partial worker failure. You will see duplicated columns drift into an inconsistent, corrupted state.',
      targetTab: 'anomalyLab',
      highlight: 'Normalized 3NF is immune to this bug because of the single source of truth principle.'
    },
    {
      title: 'Step 4: Automated Verification & Report Export',
      subtitle: 'Academic evaluation ready',
      icon: Download,
      description: 'Run the 8-test automated test suite to verify mathematical boundaries. Then click "Download" to generate a complete PDF or Word audit report documenting all user inputs, formulas, and results.',
      targetTab: 'tests',
      highlight: 'Mandatory sections (Learn, Developed By, Help, Download, Day/Night Mode) are all accessible via the top navigation.'
    }
  ];

  const step = tourSteps[currentStep];
  const StepIcon = step.icon;

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      const nextIndex = currentStep + 1;
      setCurrentStep(nextIndex);
      onNavigateTab(tourSteps[nextIndex].targetTab);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevIndex = currentStep - 1;
      setCurrentStep(prevIndex);
      onNavigateTab(tourSteps[prevIndex].targetTab);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center space-x-1.5 mb-4">
          {tourSteps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep 
                  ? 'w-8 bg-sky-600' 
                  : i < currentStep 
                    ? 'w-3 bg-sky-300 dark:bg-sky-800' 
                    : 'w-3 bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
          <span className="text-[11px] font-mono text-slate-400 pl-2">
            {currentStep + 1} / {tourSteps.length}
          </span>
        </div>

        {/* Header with Icon */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <StepIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              {step.subtitle}
            </span>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {step.title}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          {step.description}
        </div>

        {/* Highlight Note */}
        <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80 text-xs text-sky-900 dark:text-sky-300 mb-6 flex items-start space-x-2">
          <span className="font-bold text-sky-600 shrink-0">💡 Note:</span>
          <span>{step.highlight}</span>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-sm transition-all"
          >
            <span>{currentStep === tourSteps.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
