import React from 'react';
import { 
  HelpCircle, 
  Sliders, 
  Play, 
  Download, 
  Sun, 
  Cpu, 
  BarChart3, 
  CheckCircle2, 
  Info 
} from 'lucide-react';

export default function HelpSection() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>User Manual & Guide</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Help & Operational Instructions
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Complete step-by-step guide on how to configure inputs, run simulations, interpret outputs, and export reports.
        </p>
      </div>

      {/* Step 1: What the Application Does */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-sm">1</span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            What the Application Does
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          The <strong>Denormalization Trade-off Analyzer</strong> is an interactive engineering simulator. It models what happens to database performance and data consistency when you transform a normalized relational database (3NF/BCNF) into a denormalized schema (pre-joined wide tables, redundant columns, or pre-computed rollups). It calculates the exact cost in terms of <strong>Read Latency, Write Penalty, Storage Bloat, Lock Contention, and Anomaly Risk</strong>.
        </p>
      </div>

      {/* Step 2: Available Inputs & How to Provide Them */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-sm">2</span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Available Inputs & How to Configure Them
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <strong className="text-sky-600 dark:text-sky-400 block mb-1">1. Workload Presets:</strong>
            <p className="text-slate-600 dark:text-slate-300">
              Click any of the preset cards (e.g., <em>E-Commerce Orders</em>, <em>Social Media Feed</em>, <em>Financial Ledger</em>, <em>IoT Stream</em>) to load real-world production configurations with pre-tuned parameters.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <strong className="text-sky-600 dark:text-sky-400 block mb-1">2. Read QPS & Write QPS:</strong>
            <p className="text-slate-600 dark:text-slate-300">
              Adjust the Read QPS and Write QPS sliders to match your application traffic. This shifts the <strong>Read:Write ratio</strong>, heavily influencing the break-even curve.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <strong className="text-sky-600 dark:text-sky-400 block mb-1">3. Table Cardinalities & Join Depth:</strong>
            <p className="text-slate-600 dark:text-slate-300">
              Set the number of rows in primary and dimension tables, plus the number of tables joined per normalized query (2 to 5 joins).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <strong className="text-sky-600 dark:text-sky-400 block mb-1">4. Storage Tier & Buffer Hit Ratio:</strong>
            <p className="text-slate-600 dark:text-slate-300">
              Select NVMe SSD, Cloud SSD, or Mechanical HDD, and toggle the database page buffer pool hit ratio from 50% to 99%.
            </p>
          </div>
        </div>
      </div>

      {/* Step 3: Controls & Buttons */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-sm">3</span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            What Each Button & Control Does
          </h2>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-start space-x-3">
            <span className="p-1.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
              <Play className="w-3.5 h-3.5" />
            </span>
            <div>
              <strong className="text-slate-900 dark:text-white">Tour Demo:</strong>
              <p className="text-slate-600 dark:text-slate-400">
                Launches an interactive guided walkthrough modal that demonstrates the end-to-end workflow of the website.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <span className="p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
              <Download className="w-3.5 h-3.5" />
            </span>
            <div>
              <strong className="text-slate-900 dark:text-white">Download:</strong>
              <p className="text-slate-600 dark:text-slate-400">
                Opens the export dialog offering PDF, Word (.doc), Structured Markdown/Text, and JSON downloads of the complete audit report.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <span className="p-1.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 font-bold shrink-0">
              <Sun className="w-3.5 h-3.5" />
            </span>
            <div>
              <strong className="text-slate-900 dark:text-white">Day/Night Mode Toggle:</strong>
              <p className="text-slate-600 dark:text-slate-400">
                Switches between light and dark visual themes with high contrast and accessibility compliance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 4: How Processing Takes Place */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-sm">4</span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            How the Processing Takes Place
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Whenever an input slider or preset is changed:
        </p>
        <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
          <li>The <strong>Storage Model</strong> computes total bytes and disk inflation including secondary B-tree indexes.</li>
          <li>The <strong>Read Latency Engine</strong> models CPU join traversal costs and physical page cache misses.</li>
          <li>The <strong>Write Latency Engine</strong> computes update fanout, multi-row rewrite amplification, and lock contention delays.</li>
          <li>The <strong>Crossover Engine</strong> computes the break-even read percentage where Normalized and Denormalized latencies intersect.</li>
          <li>The <strong>Anomaly Model</strong> assigns an integrity risk score (0 to 100) based on write frequency and synchronization locks.</li>
        </ol>
      </div>

      {/* Step 5: How to Interpret the Output */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-sm">5</span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            How to Interpret the Output
          </h2>
        </div>
        <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
          <li className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>Read Latency Card:</strong> Shows how many milliseconds each read takes. If speedup is &gt; 2.0x, denormalization is giving strong read wins.</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span><strong>Write Latency Card:</strong> Shows the write amplification factor. If penalty is &gt; 3.0x, updating parent entities will choke the database.</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
            <span><strong>Crossover Chart:</strong> If your current read ratio is to the right of the break-even point, denormalization provides a net latency advantage.</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span><strong>Anomaly Score:</strong> Normalized is always 0 (safe). A score above 50 indicates high danger of data corruption during network glitches or worker timeouts.</span>
          </li>
        </ul>
      </div>

    </div>
  );
}
