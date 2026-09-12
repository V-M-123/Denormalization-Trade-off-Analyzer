/**
 * Report Generator Module
 * Supports PDF, DOC (Word), Text/Markdown, and JSON formats.
 */

import jsPDF from 'jspdf';

export function formatReportMarkdown(metrics) {
  const { inputs, storage, latency, throughput, anomaly, recommendation, hardware } = metrics;
  
  return `# Denormalization Trade-off Analysis Report
**Generated on:** ${new Date().toLocaleString()}  
**Application:** Denormalization Trade-off Analyzer (DBMS Architecture Optimizer)  
**Guided By:** Dr. Swaminathan A, Assistant Professor  

---

## 1. Executive Summary & Verdict
- **Recommendation:** **${recommendation.verdict}**
- **Recommended Strategy:** ${recommendation.strategy}
- **Analysis Summary:** ${recommendation.summary}

### Key Action Items:
${recommendation.actionItems.map(item => `- ${item}`).join('\n')}

---

## 2. Workload & System Inputs
| Parameter | Value | Unit / Description |
| :--- | :--- | :--- |
| Read QPS | ${inputs.readQps.toLocaleString()} | Queries per second (${latency.readRatioPercent}%) |
| Write QPS | ${inputs.writeQps.toLocaleString()} | Writes/Updates per second (${latency.writeRatioPercent}%) |
| Primary Table Rows (e.g. Orders) | ${inputs.table1Rows.toLocaleString()} | High-frequency entity |
| Dimension Table 1 Rows (e.g. Customers) | ${inputs.table2Rows.toLocaleString()} | Normalized parent entity |
| Child Table Rows (e.g. Order Items) | ${inputs.table3Rows.toLocaleString()} | Normalized child records |
| Normalized Query Join Depth | ${inputs.joinDepth} | Tables joined per read |
| Base Row Size (Norm) | ${inputs.normRowSizeBytes} | Bytes per record |
| Denormalized Row Size | ${inputs.denormRowSizeBytes} | Bytes per record (includes duplicated fields) |
| Hardware Tier | ${hardware.label} | Base seek: ${hardware.baseSeekMs}ms, Page fetch: ${hardware.diskPageFetchMs}ms |
| Buffer Pool Hit Ratio | ${(inputs.bufferCacheHitRatio * 100).toFixed(0)}% | In-memory page cache efficiency |
| Index Overhead | ${inputs.indexOverheadPercent}% | Secondary indexes footprint |
| Client Concurrency | ${inputs.concurrency} | Simultaneous active connections |
| Synchronization Lock Level | ${anomaly.syncLockLevel.toUpperCase()} | Concurrency control strategy |

---

## 3. Comparative Performance & Trade-off Metrics
| Metric | Normalized (3NF / BCNF) | Denormalized | Trade-off Delta |
| :--- | :--- | :--- | :--- |
| **Read Latency (Single Query)** | **${latency.normReadLatencyMs} ms** | **${latency.denormReadLatencyMs} ms** | **${latency.readSpeedupFactor}x faster read** |
| **Write Latency (Per Update)** | **${latency.normWriteLatencyMs} ms** | **${latency.denormWriteLatencyMs} ms** | **${latency.writePenaltyFactor}x write penalty** |
| **Effective Weighted Latency** | **${latency.normOverallLatencyMs} ms** | **${latency.denormOverallLatencyMs} ms** | ${latency.denormOverallLatencyMs < latency.normOverallLatencyMs ? 'Denormalized wins' : 'Normalized wins'} |
| **Write Amplification Factor** | **1.00x** (Single row update) | **${latency.denormWriteAmplification}x** | Fanout = ${anomaly.fanoutRatio} updates/parent |
| **Total Disk Storage** | **${storage.normStorageGb} GB** | **${storage.denormStorageGb} GB** | **+${(storage.storageInflationFactor * 100 - 100).toFixed(0)}% storage bloat** |
| **Redundant Storage Overhead** | **0.00 GB** | **${storage.redundantStorageGb} GB** | Pure duplicated columns |
| **Estimated Monthly Storage Cost** | **$${storage.normMonthlyCost}** | **$${storage.denormMonthlyCost}** | Based on ${hardware.label} |
| **Max Sustainable Throughput** | **${throughput.normMaxQps.toLocaleString()} QPS** | **${throughput.denormMaxQps.toLocaleString()} QPS** | At concurrency ${throughput.concurrency} |
| **Data Anomaly Risk Index** | **0 / 100** (Guaranteed ACID 3NF) | **${anomaly.denormAnomalyRisk} / 100** | ${anomaly.denormAnomalyRisk > 50 ? 'High Inconsistency Risk' : 'Moderate Inconsistency Risk'} |
| **Break-Even Crossover Point** | **${latency.breakEvenPercent}% Reads** | -- | Workload read threshold |

---

## 4. Mathematical Processing Steps & Formulas
1. **Normalized Storage**:
   $$\\text{Size}_{\\text{norm}} = (N_1 \\times S_1) + (N_2 \\times S_2) + (N_3 \\times S_3) + \\text{IndexFootprint} = ${storage.normStorageGb}\\text{ GB}$$

2. **Denormalized Storage & Redundancy**:
   $$\\text{Size}_{\\text{denorm}} = N_1 \\times S_{\\text{denorm}} + \\text{IndexFootprint} = ${storage.denormStorageGb}\\text{ GB}$$
   $$\\text{Redundant Overhead} = N_1 \\times (S_{\\text{denorm}} - S_{\\text{norm}}) = ${storage.redundantStorageGb}\\text{ GB}$$

3. **Read Latency ($\\\\mathcal{L}_{\\text{read}}$)**:
   - *Normalized*: $T_{\\text{seek}} + (\\text{JoinDepth} - 1) \\times T_{\\text{join\\_cpu}} + \\text{PagesTouched} \\times (1 - \\text{HitRatio}) \\times T_{\\text{page\\_io}} = ${latency.normReadLatencyMs}\\text{ ms}$
   - *Denormalized*: $T_{\\text{seek}} + T_{\\text{single\\_table}} + \\text{PagesTouched} \\times (1 - \\text{HitRatio}) \\times T_{\\text{page\\_io}} = ${latency.denormReadLatencyMs}\\text{ ms}$

4. **Write Amplification & Update Latency ($\\\\mathcal{L}_{\\text{write}}$)**:
   - Fanout: $N_1 / N_2 = ${anomaly.fanoutRatio} records affected per parent update.
   - Write Amplification: $1 + (\\text{Fanout} \\times 0.4) = ${latency.denormWriteAmplification}x.
   - Normalized Write: ${latency.normWriteLatencyMs}\\text{ ms} vs Denormalized Write: ${latency.denormWriteLatencyMs}\\text{ ms}.

5. **Effective Weighted Latency**:
   $$\\\\mathcal{L}_{\\text{avg}} = (R_{\\%} \\times \\\\mathcal{L}_{\\text{read}}) + (W_{\\%} \\times \\\\mathcal{L}_{\\text{write}})$$
   - Normalized: ${latency.normOverallLatencyMs} ms
   - Denormalized: ${latency.denormOverallLatencyMs} ms

---
*Report generated by Denormalization Trade-off Analyzer.*
`;
}

export function downloadText(filename, content, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadWordDocument(metrics) {
  const md = formatReportMarkdown(metrics);
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Denormalization Trade-off Analysis Report</title>
      <style>
        body { font-family: Calibri, Arial, sans-serif; line-height: 1.5; color: #1e293b; padding: 40px; }
        h1 { color: #0284c7; border-bottom: 2px solid #0284c7; padding-bottom: 8px; }
        h2 { color: #0f172a; margin-top: 24px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; }
        table { border-collapse: collapse; width: 100%; margin: 16px 0; }
        th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
        th { background-color: #f1f5f9; color: #0f172a; }
        tr:nth-child(even) { background-color: #f8fafc; }
        .highlight { background-color: #e0f2fe; font-weight: bold; }
        .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; background: #0284c7; color: white; font-weight: bold; }
      </style>
    </head>
    <body>
      ${md
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/gim, '<b>$1</b>')
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        .replace(/---/g, '<hr/>')
        .replace(/\n\n/g, '<br/>')
      }
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + htmlContent], {
    type: 'application/msword'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `denormalization-report-${Date.now()}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadPdfReport(metrics) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const { inputs, storage, latency, throughput, anomaly, recommendation, hardware } = metrics;
  
  // Header Banner
  doc.setFillColor(2, 132, 199); // Brand blue
  doc.rect(0, 0, 210, 24, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Denormalization Trade-off Analysis Report', 14, 12);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Guided By: Dr. Swaminathan A, Assistant Professor | DBMS Architectural Optimizer', 14, 18);

  // Date & Subtitle
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 140, 18);

  let y = 34;

  // Verdict Box
  doc.setFillColor(240, 249, 255);
  doc.setDrawColor(186, 230, 253);
  doc.roundedRect(14, y, 182, 26, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Recommendation: ${recommendation.verdict}`, 18, y + 8);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(recommendation.summary, 174);
  doc.text(summaryLines, 18, y + 14);

  y += 34;

  // Section 1: Comparative Table
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('1. Performance & Trade-off Comparison', 14, y);
  y += 6;

  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, 182, 7, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Metric', 18, y + 5);
  doc.text('Normalized (3NF/BCNF)', 75, y + 5);
  doc.text('Denormalized', 125, y + 5);
  doc.text('Trade-off Impact', 165, y + 5);
  y += 7;

  const rows = [
    ['Read Latency', `${latency.normReadLatencyMs} ms`, `${latency.denormReadLatencyMs} ms`, `${latency.readSpeedupFactor}x Faster Read`],
    ['Write Latency', `${latency.normWriteLatencyMs} ms`, `${latency.denormWriteLatencyMs} ms`, `${latency.writePenaltyFactor}x Write Penalty`],
    ['Effective Latency', `${latency.normOverallLatencyMs} ms`, `${latency.denormOverallLatencyMs} ms`, latency.denormOverallLatencyMs < latency.normOverallLatencyMs ? 'Denorm Wins' : 'Norm Wins'],
    ['Write Amplification', '1.0x (Isolated)', `${latency.denormWriteAmplification}x`, `Fanout: ${anomaly.fanoutRatio}x`],
    ['Total Disk Storage', `${storage.normStorageGb} GB`, `${storage.denormStorageGb} GB`, `+${(storage.storageInflationFactor * 100 - 100).toFixed(0)}% Bloat`],
    ['Redundant Overhead', '0.00 GB', `${storage.redundantStorageGb} GB`, 'Duplicate columns'],
    ['Max Throughput', `${throughput.normMaxQps.toLocaleString()} QPS`, `${throughput.denormMaxQps.toLocaleString()} QPS`, `Conc: ${throughput.concurrency}`],
    ['Anomaly Risk Index', '0 / 100 (Safe 3NF)', `${anomaly.denormAnomalyRisk} / 100`, `${anomaly.syncLockLevel.toUpperCase()} lock`],
    ['Break-Even Point', `${latency.breakEvenPercent}% Reads`, '--', 'Workload Threshold'],
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  rows.forEach((row, i) => {
    if (i % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, 182, 6, 'F');
    }
    doc.setTextColor(30, 41, 59);
    doc.text(row[0], 18, y + 4.5);
    doc.text(row[1], 75, y + 4.5);
    doc.text(row[2], 125, y + 4.5);
    doc.text(row[3], 165, y + 4.5);
    y += 6;
  });

  y += 8;

  // Section 2: Input Parameters
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('2. Workload & Architectural Parameters', 14, y);
  y += 6;

  const paramRows = [
    ['Read Workload', `${inputs.readQps.toLocaleString()} QPS (${latency.readRatioPercent}%)`, 'Buffer Pool Hit Ratio', `${(inputs.bufferCacheHitRatio * 100).toFixed(0)}%`],
    ['Write Workload', `${inputs.writeQps.toLocaleString()} QPS (${latency.writeRatioPercent}%)`, 'Hardware Tier', hardware.label],
    ['Primary Table Rows', inputs.table1Rows.toLocaleString(), 'Index Overhead', `${inputs.indexOverheadPercent}%`],
    ['Dimension Table Rows', inputs.table2Rows.toLocaleString(), 'Join Depth (Normalized)', `${inputs.joinDepth} Tables`],
    ['Normalized Row Size', `${inputs.normRowSizeBytes} Bytes`, 'Denormalized Row Size', `${inputs.denormRowSizeBytes} Bytes`],
  ];

  paramRows.forEach(r => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text(`${r[0]}:`, 18, y + 4);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(r[1], 55, y + 4);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text(`${r[2]}:`, 110, y + 4);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(r[3], 148, y + 4);
    y += 5.5;
  });

  y += 8;

  // Section 3: Recommended Action Items
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('3. Recommended Architecture & DBA Action Items', 14, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  recommendation.actionItems.forEach(item => {
    const lines = doc.splitTextToSize(`•  ${item}`, 178);
    doc.text(lines, 18, y + 3);
    y += (lines.length * 4.5);
  });

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Denormalization Trade-off Analyzer | Academic Evaluation Report', 14, 287);
  doc.text('Page 1 of 1', 180, 287);

  doc.save(`denormalization-report-${Date.now()}.pdf`);
}
