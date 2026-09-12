import React, { useState } from 'react';
import { Database, Terminal, GitFork, Cpu, Copy, Check } from 'lucide-react';

export default function SqlVisualizer({ preset }) {
  const [copiedNorm, setCopiedNorm] = useState(false);
  const [copiedDenorm, setCopiedDenorm] = useState(false);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'norm') {
      setCopiedNorm(true);
      setTimeout(() => setCopiedNorm(false), 2000);
    } else {
      setCopiedDenorm(true);
      setTimeout(() => setCopiedDenorm(false), 2000);
    }
  };

  const norm = preset.schema.normalized;
  const denorm = preset.schema.denormalized;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm mt-6">
      
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Query & Execution Plan Workbench ({preset.title})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Side-by-side architectural inspection of relational multi-table JOINs vs denormalized point lookups
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Normalized Side */}
        <div className="rounded-xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/30 dark:bg-sky-950/20 p-4">
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
              <h4 className="font-bold text-sm text-sky-900 dark:text-sky-200">
                Normalized Schema (3NF / BCNF)
              </h4>
            </div>
            <button
              onClick={() => copyToClipboard(norm.query, 'norm')}
              className="text-xs text-slate-500 hover:text-sky-600 flex items-center space-x-1"
            >
              {copiedNorm ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedNorm ? 'Copied' : 'Copy SQL'}</span>
            </button>
          </div>

          {/* Table Schema Badges */}
          <div className="mb-3">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Physical Tables ({norm.tables.length})
            </div>
            <div className="space-y-1.5">
              {norm.tables.map(t => (
                <div key={t.name} className="text-xs bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">
                  <span className="font-mono font-bold text-sky-600 dark:text-sky-400 mr-2">{t.name}:</span>
                  <span className="font-mono text-slate-600 dark:text-slate-300 text-[11px]">{t.cols.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SQL Query */}
          <div className="mb-3">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Query (Requires Multi-Table JOINs)
            </div>
            <pre className="p-3 bg-slate-950 text-sky-300 rounded-lg text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed">
              {norm.query}
            </pre>
          </div>

          {/* Query Execution Plan */}
          <div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <Cpu className="w-3.5 h-3.5 text-sky-500" />
              <span>Simulated Query Execution Plan (DBMS Optimizer)</span>
            </div>
            <div className="space-y-1 bg-white dark:bg-slate-900/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
              {norm.plan.map((p, idx) => (
                <div key={idx} className="flex items-start justify-between py-1 border-b last:border-0 border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono text-[11px]">{p.step}</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] text-right ml-2">{p.detail}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Denormalized Side */}
        <div className="rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 p-4">
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <h4 className="font-bold text-sm text-rose-900 dark:text-rose-200">
                Denormalized / Pre-Joined Schema
              </h4>
            </div>
            <button
              onClick={() => copyToClipboard(denorm.query, 'denorm')}
              className="text-xs text-slate-500 hover:text-rose-600 flex items-center space-x-1"
            >
              {copiedDenorm ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedDenorm ? 'Copied' : 'Copy SQL'}</span>
            </button>
          </div>

          {/* Table Schema Badges */}
          <div className="mb-3">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Physical Tables ({denorm.tables.length})
            </div>
            <div className="space-y-1.5">
              {denorm.tables.map(t => (
                <div key={t.name} className="text-xs bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400 mr-2">{t.name}:</span>
                  <span className="font-mono text-slate-600 dark:text-slate-300 text-[11px]">{t.cols.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SQL Query */}
          <div className="mb-3">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Query (Single Clustered Index Seek, 0 JOINs)
            </div>
            <pre className="p-3 bg-slate-950 text-rose-300 rounded-lg text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed">
              {denorm.query}
            </pre>
          </div>

          {/* Query Execution Plan */}
          <div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <Cpu className="w-3.5 h-3.5 text-rose-500" />
              <span>Simulated Query Execution Plan (DBMS Optimizer)</span>
            </div>
            <div className="space-y-1 bg-white dark:bg-slate-900/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
              {denorm.plan.map((p, idx) => (
                <div key={idx} className="flex items-start justify-between py-1 border-b last:border-0 border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono text-[11px]">{p.step}</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] text-right ml-2">{p.detail}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
