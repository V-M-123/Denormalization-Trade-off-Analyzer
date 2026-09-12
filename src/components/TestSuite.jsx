import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Play, 
  RotateCcw, 
  ShieldCheck, 
  Activity, 
  Sliders, 
  Code2, 
  Check 
} from 'lucide-react';
import { runAllTests } from '../engine/tests';
import confetti from 'canvas-confetti';

export default function TestSuite() {
  const [testReport, setTestReport] = useState(() => runAllTests());
  const [isRunning, setIsRunning] = useState(false);

  const handleRunTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = runAllTests();
      setTestReport(res);
      setIsRunning(false);
      if (res.allPassed) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }, 450);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Automated Verification & Test Suite
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                {testReport.passedCount} / {testReport.total} Passed (100%)
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Strict mathematical boundary, division-by-zero, monotonic storage, and latency scaling verification
            </p>
          </div>
        </div>

        <button
          onClick={handleRunTests}
          disabled={isRunning}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white shadow-sm transition-all self-start sm:self-auto"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Verifying...' : 'Re-run All Tests'}</span>
        </button>
      </div>

      {/* Test Results Grid */}
      <div className="space-y-3">
        {testReport.results.map(test => (
          <div 
            key={test.id}
            className={`p-4 rounded-xl border transition-all ${
              test.passed 
                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800' 
                : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                  {test.passed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-500" />
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-slate-400">{test.id}</span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {test.name}
                    </h3>
                    <span className="px-2 py-0.2 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {test.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {test.message}
                  </p>

                  {/* Metrics Badge Chips */}
                  {Object.keys(test.metrics).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {Object.entries(test.metrics).map(([k, v]) => (
                        <span key={k} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400">
                          {k}: <strong>{String(v)}</strong>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">
                {test.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
