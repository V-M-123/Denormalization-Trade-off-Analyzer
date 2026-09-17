/**
 * Report Generation & PDF Export Module
 * Generates client-side reports in PDF (via jsPDF), Word (.doc), and Plain Text (.txt).
 * Features graceful fallbacks if CDN libraries are unavailable.
 */

import { getChartImageBase64 } from './chart.js';

export function generateTextReport(evaluation) {
  const { inputs, breakdown, scores, recommendation, timestamp } = evaluation;

  return `================================================================================
DENORMALIZATION TRADE-OFF ANALYZER — EXECUTIVE AUDIT REPORT
================================================================================
Generated: ${new Date(timestamp).toLocaleString()}
Project:   Denormalization Trade-off Analyzer (DBMS Course Project)
Supervisor: Dr. Swaminathan A, Assistant Professor, SCOPE

--------------------------------------------------------------------------------
1. ARCHITECTURAL RECOMMENDATION
--------------------------------------------------------------------------------
Verdict:      ${recommendation.verdict.toUpperCase()}
Average Score: Normalized 3NF: ${scores.normalizedAverage}/10 | Denormalized: ${scores.denormalizedAverage}/10

Summary:
${recommendation.explanation}

Key Takeaways:
• Why this recommendation was made:
  ${recommendation.keyTakeaways.why}
• What could trigger a change in recommendation:
  ${recommendation.keyTakeaways.whatCouldChange}

--------------------------------------------------------------------------------
2. EVALUATED WORKLOAD INPUTS
--------------------------------------------------------------------------------
• Estimated Table Row Count:   ${Number(inputs.rowCount).toLocaleString()} rows
• Read / Write Workload Ratio:  ${inputs.readPercent}% Reads / ${inputs.writePercent}% Writes
• Query Complexity Level:       ${inputs.queryComplexity.toUpperCase()}
• Storage Cost Sensitivity:     ${inputs.storageCostSensitivity.toUpperCase()}
• Data Consistency Criticality: ${inputs.dataConsistencyCriticality.toUpperCase()}

--------------------------------------------------------------------------------
3. SCORED TRADE-OFF BREAKDOWN (0 - 10 SCALE)
--------------------------------------------------------------------------------
${Object.values(breakdown).map(item => `
[${item.label}]
  Normalized:   ${item.normalized}/10
  Denormalized: ${item.denormalized}/10
  Justification: ${item.justification}
`).join('')}

--------------------------------------------------------------------------------
End of Report — Denormalization Trade-off Analyzer
================================================================================`;
}

export function downloadBlob(filename, content, mimeType) {
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

export function downloadTextReport(evaluation) {
  const text = generateTextReport(evaluation);
  downloadBlob(`denormalization-audit-${Date.now()}.txt`, text, 'text/plain;charset=utf-8');
}

export function downloadDocReport(evaluation) {
  const { inputs, breakdown, recommendation, timestamp } = evaluation;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Denormalization Trade-off Audit Report</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.5; color: #1e293b; padding: 32px; }
    h1 { color: #166534; border-bottom: 2px solid #166534; padding-bottom: 8px; }
    h2 { color: #0f172a; margin-top: 24px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; }
    table { border-collapse: collapse; width: 100%; margin: 16px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
    th { background-color: #f1f5f9; color: #0f172a; }
    .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; background: #166534; color: #fff; font-weight: bold; }
    .box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; margin: 12px 0; }
  </style>
</head>
<body>
  <h1>Denormalization Trade-off Analyzer — Report</h1>
  <p><strong>Generated:</strong> ${new Date(timestamp).toLocaleString()} | <strong>Guided By:</strong> Dr. Swaminathan A, Assistant Professor</p>
  
  <h2>1. Executive Recommendation</h2>
  <div class="box">
    <p><strong>Verdict:</strong> <span class="badge">${recommendation.verdict}</span></p>
    <p>${recommendation.explanation}</p>
    <p><strong>Key Takeaway (Why):</strong> ${recommendation.keyTakeaways.why}</p>
    <p><strong>Key Takeaway (Trigger for Change):</strong> ${recommendation.keyTakeaways.whatCouldChange}</p>
  </div>

  <h2>2. Evaluated Inputs</h2>
  <table>
    <tr><th>Parameter</th><th>Value</th></tr>
    <tr><td>Table Row Count</td><td>${Number(inputs.rowCount).toLocaleString()}</td></tr>
    <tr><td>Read / Write Ratio</td><td>${inputs.readPercent}% Reads / ${inputs.writePercent}% Writes</td></tr>
    <tr><td>Query Complexity</td><td>${inputs.queryComplexity.toUpperCase()}</td></tr>
    <tr><td>Storage Cost Sensitivity</td><td>${inputs.storageCostSensitivity.toUpperCase()}</td></tr>
    <tr><td>Data Consistency Criticality</td><td>${inputs.dataConsistencyCriticality.toUpperCase()}</td></tr>
  </table>

  <h2>3. 5-Dimension Scored Trade-off Breakdown</h2>
  <table>
    <tr><th>Dimension</th><th>Normalized (3NF)</th><th>Denormalized</th><th>Justification</th></tr>
    ${Object.values(breakdown).map(b => `
      <tr>
        <td><strong>${b.label}</strong></td>
        <td>${b.normalized} / 10</td>
        <td>${b.denormalized} / 10</td>
        <td>${b.justification}</td>
      </tr>
    `).join('')}
  </table>
</body>
</html>`;

  downloadBlob(`denormalization-audit-${Date.now()}.doc`, '\ufeff' + html, 'application/msword');
}

export function downloadPdfReport(evaluation) {
  // Feature-detect jsPDF; if missing, fallback to text download
  if (!window.jspdf || !window.jspdf.jsPDF) {
    console.warn('jsPDF is not loaded. Falling back to plain-text report.');
    alert('PDF generation library is unavailable. Downloading plain-text report fallback.');
    downloadTextReport(evaluation);
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const { inputs, breakdown, scores, recommendation, timestamp } = evaluation;

  // Header Banner: Modal Ground / Phosphor Border
  doc.setFillColor(24, 24, 24); // Ground Iron
  doc.rect(0, 0, 210, 24, 'F');
  
  doc.setTextColor(221, 255, 220); // Phosphor White
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Denormalization Trade-off Analysis Report', 14, 11);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(140, 171, 135); // Sage 60
  doc.text('Guided By: Dr. Swaminathan A, Assistant Professor | Academic Project Review', 14, 17);
  doc.text(`Generated: ${new Date(timestamp).toLocaleString()}`, 135, 17);

  let y = 32;

  // Recommendation Box
  doc.setFillColor(33, 37, 37); // Carbon Veil
  doc.setDrawColor(72, 83, 70); // Circuit Border
  doc.roundedRect(14, y, 182, 28, 2, 2, 'FD');

  doc.setTextColor(127, 238, 100); // Lime Pulse
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Verdict: ${recommendation.verdict}`, 18, y + 7);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(221, 255, 220);
  const summaryLines = doc.splitTextToSize(recommendation.explanation, 174);
  doc.text(summaryLines, 18, y + 13);

  y += 35;

  // Section 1: Inputs
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 26, 22);
  doc.text('1. Evaluated Workload Characteristics', 14, y);
  y += 5;

  const inputRows = [
    ['Estimated Row Count', `${Number(inputs.rowCount).toLocaleString()} rows`, 'Query Complexity', inputs.queryComplexity.toUpperCase()],
    ['Read / Write Ratio', `${inputs.readPercent}% Reads / ${inputs.writePercent}% Writes`, 'Storage Sensitivity', inputs.storageCostSensitivity.toUpperCase()],
    ['Consistency Criticality', inputs.dataConsistencyCriticality.toUpperCase(), 'Average Scores', `Norm: ${scores.normalizedAverage}/10 vs Denorm: ${scores.denormalizedAverage}/10`],
  ];

  doc.setFontSize(8);
  inputRows.forEach(r => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 100, 80);
    doc.text(`${r[0]}:`, 18, y + 4);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(20, 30, 20);
    doc.text(r[1], 58, y + 4);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 100, 80);
    doc.text(`${r[2]}:`, 110, y + 4);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(20, 30, 20);
    doc.text(r[3], 150, y + 4);
    y += 5.5;
  });

  y += 6;

  // Section 2: 5-Dimension Scores
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 26, 22);
  doc.text('2. Scored Trade-off Breakdown (0 - 10 Scale)', 14, y);
  y += 5;

  // Table Header
  doc.setFillColor(240, 245, 240);
  doc.rect(14, y, 182, 6.5, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 70, 50);
  doc.text('Dimension', 18, y + 4.5);
  doc.text('Normalized', 65, y + 4.5);
  doc.text('Denormalized', 92, y + 4.5);
  doc.text('Technical Justification', 122, y + 4.5);
  y += 6.5;

  const dimensionRows = [
    ['Read Performance', `${breakdown.readPerformance.normalized}/10`, `${breakdown.readPerformance.denormalized}/10`, breakdown.readPerformance.justification],
    ['Write Performance', `${breakdown.writePerformance.normalized}/10`, `${breakdown.writePerformance.denormalized}/10`, breakdown.writePerformance.justification],
    ['Storage Efficiency', `${breakdown.storageEfficiency.normalized}/10`, `${breakdown.storageEfficiency.denormalized}/10`, breakdown.storageEfficiency.justification],
    ['Data Integrity', `${breakdown.dataIntegrity.normalized}/10`, `${breakdown.dataIntegrity.denormalized}/10`, breakdown.dataIntegrity.justification],
    ['Query Simplicity', `${breakdown.queryComplexity.normalized}/10`, `${breakdown.queryComplexity.denormalized}/10`, breakdown.queryComplexity.justification],
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  dimensionRows.forEach((row, i) => {
    if (i % 2 === 1) {
      doc.setFillColor(248, 252, 248);
      doc.rect(14, y, 182, 9, 'F');
    }
    doc.setTextColor(20, 30, 20);
    doc.setFont('helvetica', 'bold');
    doc.text(row[0], 18, y + 4.5);
    doc.setFont('helvetica', 'normal');
    doc.text(row[1], 68, y + 4.5);
    doc.text(row[2], 95, y + 4.5);

    const justLines = doc.splitTextToSize(row[3], 72);
    doc.text(justLines, 122, y + 3.5);
    y += 9;
  });

  y += 6;

  // Chart Image Embedding (if available)
  const chartImg = getChartImageBase64();
  if (chartImg) {
    try {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(22, 26, 22);
      doc.text('3. Radar Comparison Chart', 14, y);
      y += 4;
      doc.addImage(chartImg, 'PNG', 55, y, 100, 60);
      y += 64;
    } catch (e) {
      console.warn('Chart image embed failed:', e);
    }
  }

  // Section 3: Key Takeaways
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 26, 22);
  doc.text('Key Architectural Takeaways', 14, y);
  y += 5;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(40, 60, 40);
  doc.text('• Why this recommendation was made:', 18, y + 3);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 80, 60);
  const whyLines = doc.splitTextToSize(recommendation.keyTakeaways.why, 174);
  doc.text(whyLines, 22, y + 7);
  y += (whyLines.length * 4) + 8;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(40, 60, 40);
  doc.text('• What could change the recommendation:', 18, y + 3);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 80, 60);
  const whatLines = doc.splitTextToSize(recommendation.keyTakeaways.whatCouldChange, 174);
  doc.text(whatLines, 22, y + 7);

  // Footer
  doc.setFontSize(7.5);
  doc.setTextColor(140, 160, 140);
  doc.text('Denormalization Trade-off Analyzer | Academic Course Project Report', 14, 287);
  doc.text('Page 1 of 1', 185, 287);

  doc.save(`denormalization-audit-${Date.now()}.pdf`);
}
