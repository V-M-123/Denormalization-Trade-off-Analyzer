import React from 'react';
import { 
  Zap, 
  Clock, 
  HardDrive, 
  AlertTriangle, 
  Activity, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Check 
} from 'lucide-react';

export default function MetricsCards({ metrics }) {
  const { latency, storage, throughput, anomaly, recommendation } = metrics;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* 1. Read Latency Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all hover:border-sky-300 dark:hover:border-sky-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Read Latency (Single Query)
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {latency.denormReadLatencyMs} <span className="text-sm font-normal text-slate-500">ms</span>
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center">
            <ArrowDownRight className="w-3 h-3 mr-0.5" />
            {latency.readSpeedupFactor}x faster
          </span>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Normalized 3NF:</span>
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {latency.normReadLatencyMs} ms ({metrics.inputs.joinDepth} joins)
          </span>
        </div>
      </div>

      {/* 2. Write Latency & Amplification Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all hover:border-rose-300 dark:hover:border-rose-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Write / Update Latency
          </span>
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {latency.denormWriteLatencyMs} <span className="text-sm font-normal text-slate-500">ms</span>
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 flex items-center">
            <ArrowUpRight className="w-3 h-3 mr-0.5" />
            {latency.writePenaltyFactor}x penalty
          </span>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Write Amplification:</span>
          <span className="font-semibold text-rose-600 dark:text-rose-400">
            {latency.denormWriteAmplification}x fanout (Norm: 1.0x)
          </span>
        </div>
      </div>

      {/* 3. Disk Storage Footprint Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all hover:border-indigo-300 dark:hover:border-indigo-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Storage Footprint
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <HardDrive className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {storage.denormStorageGb} <span className="text-sm font-normal text-slate-500">GB</span>
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
            +{((storage.storageInflationFactor - 1) * 100).toFixed(0)}% bloat
          </span>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Normalized Size:</span>
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {storage.normStorageGb} GB (Redundant: {storage.redundantStorageGb} GB)
          </span>
        </div>
      </div>

      {/* 4. Anomaly Risk Index Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all hover:border-amber-300 dark:hover:border-amber-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Anomaly Risk Score
          </span>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            anomaly.denormAnomalyRisk > 50 
              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' 
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
          }`}>
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline space-x-2">
          <span className={`text-2xl font-black ${
            anomaly.denormAnomalyRisk > 60 
              ? 'text-rose-600 dark:text-rose-400' 
              : anomaly.denormAnomalyRisk > 25 
                ? 'text-amber-600 dark:text-amber-400' 
                : 'text-emerald-600 dark:text-emerald-400'
          }`}>
            {anomaly.denormAnomalyRisk} <span className="text-sm font-normal text-slate-500">/ 100</span>
          </span>
          <span className="text-xs text-slate-500">
            (Norm: <strong className="text-emerald-600">0 Safe</strong>)
          </span>
        </div>

        <div className="mt-3">
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                anomaly.denormAnomalyRisk > 60 
                  ? 'bg-rose-500' 
                  : anomaly.denormAnomalyRisk > 25 
                    ? 'bg-amber-500' 
                    : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(5, anomaly.denormAnomalyRisk))}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
            <span>Lock: {anomaly.syncLockLevel.toUpperCase()}</span>
            <span>Fanout: {anomaly.fanoutRatio} records</span>
          </div>
        </div>
      </div>

    </div>
  );
}
