import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  FileCode, 
  Download, 
  Check, 
  Sparkles, 
  FileSpreadsheet,
  Layers
} from 'lucide-react';
import { 
  downloadPdfReport, 
  downloadWordDocument, 
  downloadText, 
  formatReportMarkdown 
} from '../engine/reportGenerator';

export default function DownloadModal({ isOpen, onClose, metrics }) {
  const [downloadingFormat, setDownloadingFormat] = useState(null);

  if (!isOpen) return null;

  const handleDownload = async (format) => {
    setDownloadingFormat(format);
    try {
      if (format === 'pdf') {
        downloadPdfReport(metrics);
      } else if (format === 'doc') {
        downloadWordDocument(metrics);
      } else if (format === 'md') {
        const md = formatReportMarkdown(metrics);
        downloadText(`denormalization-report-${Date.now()}.md`, md, 'text/markdown;charset=utf-8');
      } else if (format === 'txt') {
        const txt = formatReportMarkdown(metrics);
        downloadText(`denormalization-report-${Date.now()}.txt`, txt, 'text/plain;charset=utf-8');
      } else if (format === 'json') {
        const jsonStr = JSON.stringify(metrics, null, 2);
        downloadText(`denormalization-config-${Date.now()}.json`, jsonStr, 'application/json;charset=utf-8');
      }
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setTimeout(() => setDownloadingFormat(null), 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Export Comprehensive Audit Report
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Includes user inputs, processing steps, intermediate calculations, and final output
            </p>
          </div>
        </div>

        {/* Report Preview Highlights */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 mb-5 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-500">Selected Workload:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {metrics.latency.readRatioPercent}% Reads / {metrics.latency.writeRatioPercent}% Writes
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Recommendation:</span>
            <span className="font-bold text-sky-600 dark:text-sky-400">
              {metrics.recommendation.verdict}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Break-Even Point:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {metrics.latency.breakEvenPercent}% Reads
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Supervisor:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Dr. Swaminathan A, Assistant Professor
            </span>
          </div>
        </div>

        {/* Format Selection Buttons */}
        <div className="space-y-2.5">
          
          {/* 1. PDF Report */}
          <button
            onClick={() => handleDownload('pdf')}
            disabled={downloadingFormat === 'pdf'}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-white dark:bg-slate-800/40 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 transition-all text-left group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <span>PDF Document (.pdf)</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    Recommended
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Formatted print-ready report with header banner, tables, and DBA roadmap
                </div>
              </div>
            </div>
            {downloadingFormat === 'pdf' ? (
              <Check className="w-4 h-4 text-emerald-500 animate-bounce" />
            ) : (
              <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
            )}
          </button>

          {/* 2. Word Document (.doc) */}
          <button
            onClick={() => handleDownload('doc')}
            disabled={downloadingFormat === 'doc'}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 bg-white dark:bg-slate-800/40 hover:bg-sky-50/30 dark:hover:bg-sky-950/20 transition-all text-left group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  Word Document (.doc)
                </div>
                <div className="text-[11px] text-slate-500">
                  Editable Microsoft Word / LibreOffice formatted document
                </div>
              </div>
            </div>
            {downloadingFormat === 'doc' ? (
              <Check className="w-4 h-4 text-sky-500 animate-bounce" />
            ) : (
              <Download className="w-4 h-4 text-slate-400 group-hover:text-sky-500 transition-colors" />
            )}
          </button>

          {/* 3. Text / Markdown (.md / .txt) */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDownload('md')}
              className="flex items-center justify-center space-x-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Markdown (.md)</span>
            </button>

            <button
              onClick={() => handleDownload('txt')}
              className="flex items-center justify-center space-x-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Plain Text (.txt)</span>
            </button>
          </div>

          {/* 4. Raw JSON Config */}
          <button
            onClick={() => handleDownload('json')}
            className="w-full flex items-center justify-center space-x-2 p-2 rounded-xl text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Download Raw JSON Data Payload</span>
          </button>

        </div>

      </div>
    </div>
  );
}
