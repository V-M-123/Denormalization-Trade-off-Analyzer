import React, { useState } from 'react';
import { 
  ShoppingCart, 
  MessageSquare, 
  Landmark, 
  Cpu, 
  Activity, 
  Sliders, 
  HardDrive, 
  Server, 
  ShieldCheck, 
  Layers, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { WORKLOAD_PRESETS } from '../engine/presets';
import { HARDWARE_SPECS } from '../engine/costModel';
import MetricsCards from './MetricsCards';
import TradeoffCharts from './TradeoffCharts';
import SqlVisualizer from './SqlVisualizer';

export default function Workbench({ 
  params, 
  setParams, 
  metrics, 
  selectedPresetId, 
  setSelectedPresetId 
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Icon mapper
  const iconMap = {
    ShoppingCart,
    MessageSquare,
    Landmark,
    Cpu,
    Activity,
  };

  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setParams(preset.params);
  };

  const handleSliderChange = (field, val) => {
    setSelectedPresetId('custom');
    setParams(prev => ({
      ...prev,
      [field]: typeof val === 'string' ? val : Number(val)
    }));
  };

  const currentPreset = WORKLOAD_PRESETS.find(p => p.id === selectedPresetId) || WORKLOAD_PRESETS[0];

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. PRESET SELECTOR BAR */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Workload Architecture Presets
            </h3>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Select an industry preset to load pre-tuned parameters
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {WORKLOAD_PRESETS.map(preset => {
            const Icon = iconMap[preset.icon] || ShoppingCart;
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
                  isSelected 
                    ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/40 ring-2 ring-sky-500/20 shadow-xs' 
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-lg ${
                    isSelected 
                      ? 'bg-sky-500 text-white shadow-xs' 
                      : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {Math.round((preset.params.readQps / (preset.params.readQps + preset.params.writeQps)) * 100)}% R
                  </span>
                </div>
                <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {preset.title}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {preset.category}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. GRANULAR WORKLOAD & SCHEMA CONFIGURATOR */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Live Parameter Workbench
              </h3>
              <p className="text-[11px] text-slate-500">
                Adjust sliders to dynamically evaluate real-time I/O, latency, and risk
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-semibold"
            >
              {showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Hardware & Cache'}
            </button>
          </div>
        </div>

        {/* Primary Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Read QPS */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Read QPS</span>
              <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
                {params.readQps.toLocaleString()} /s
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="25000" 
              step="250"
              value={params.readQps} 
              onChange={(e) => handleSliderChange('readQps', e.target.value)}
              className="w-full accent-sky-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0 (Write-only)</span>
              <span>25,000 QPS</span>
            </div>
          </div>

          {/* Write QPS */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Write / Update QPS</span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                {params.writeQps.toLocaleString()} /s
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="10000" 
              step="100"
              value={params.writeQps} 
              onChange={(e) => handleSliderChange('writeQps', e.target.value)}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0 (Read-only)</span>
              <span>10,000 QPS</span>
            </div>
          </div>

          {/* Primary Table Rows */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Primary Table Rows</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {(params.table1Rows / 1000000).toFixed(1)} M
              </span>
            </div>
            <input 
              type="range" 
              min="100000" 
              max="20000000" 
              step="200000"
              value={params.table1Rows} 
              onChange={(e) => handleSliderChange('table1Rows', e.target.value)}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>100K</span>
              <span>20 Million</span>
            </div>
          </div>

          {/* Join Depth */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Normalized Join Depth</span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                {params.joinDepth} Tables
              </span>
            </div>
            <input 
              type="range" 
              min="2" 
              max="5" 
              step="1"
              value={params.joinDepth} 
              onChange={(e) => handleSliderChange('joinDepth', e.target.value)}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>2 Tables</span>
              <span>5 Tables (Deep Join)</span>
            </div>
          </div>

        </div>

        {/* Advanced Settings (Hardware, Buffer Cache, Row Sizes, Lock Levels) */}
        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
            
            {/* Storage Hardware Tier */}
            <div className="text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Storage Hardware Tier
              </label>
              <select
                value={params.hardwareTier}
                onChange={(e) => handleSliderChange('hardwareTier', e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100"
              >
                <option value="nvme">Enterprise NVMe SSD (0.04ms seek)</option>
                <option value="ssd">Cloud SSD EBS gp3 (0.35ms seek)</option>
                <option value="hdd">Mechanical 7.2k SAS HDD (6.5ms seek)</option>
              </select>
            </div>

            {/* Buffer Pool Hit Ratio */}
            <div className="text-xs">
              <div className="flex justify-between mb-1">
                <span className="font-bold text-slate-700 dark:text-slate-300">Buffer Cache Hit Ratio</span>
                <span className="font-mono font-bold text-emerald-600">{(params.bufferCacheHitRatio * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" 
                min="0.40" 
                max="0.99" 
                step="0.01"
                value={params.bufferCacheHitRatio}
                onChange={(e) => handleSliderChange('bufferCacheHitRatio', e.target.value)}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Row Size Inflation */}
            <div className="text-xs">
              <div className="flex justify-between mb-1">
                <span className="font-bold text-slate-700 dark:text-slate-300">Denorm Row Size</span>
                <span className="font-mono font-bold text-indigo-600">{params.denormRowSizeBytes} B</span>
              </div>
              <input 
                type="range" 
                min="200" 
                max="1000" 
                step="20"
                value={params.denormRowSizeBytes}
                onChange={(e) => handleSliderChange('denormRowSizeBytes', e.target.value)}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Synchronization Strategy */}
            <div className="text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Concurrency Lock Level
              </label>
              <select
                value={params.syncLockLevel}
                onChange={(e) => handleSliderChange('syncLockLevel', e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100"
              >
                <option value="strict">Strict Serializable (Zero drift, slow writes)</option>
                <option value="optimistic">Optimistic Locking with Versioning</option>
                <option value="none">Eventual / None (Fast, high anomaly risk)</option>
              </select>
            </div>

          </div>
        )}

      </div>

      {/* 3. KEY METRICS CARDS */}
      <MetricsCards metrics={metrics} />

      {/* 4. TRADEOFF CHARTS */}
      <TradeoffCharts metrics={metrics} />

      {/* 5. SQL QUERY & EXECUTION PLAN VISUALIZER */}
      <SqlVisualizer preset={currentPreset} />

    </div>
  );
}
