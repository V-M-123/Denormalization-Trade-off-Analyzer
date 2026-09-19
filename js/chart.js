/**
 * Chart Visualization Module
 * Handles Chart.js 5-axis Radar & Grouped Bar chart rendering and theme updates.
 */

let chartInstance = null;
let currentChartType = 'radar'; // 'radar' or 'bar'
let lastCanvas = null;
let lastThemeMode = null;

export function renderTradeoffChart(canvasElement, breakdown, isDayMode = false, forcedType = null) {
  if (!canvasElement) return null;
  if (forcedType) currentChartType = forcedType;

  // Verify Chart.js availability
  if (typeof window.Chart === 'undefined') {
    canvasElement.parentElement.innerHTML = `
      <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 13px;">
        <p>Chart.js CDN library is unavailable or offline.</p>
        <p>Numerical scores are available in the table below.</p>
      </div>`;
    return null;
  }

  const labels = [
    'Read Performance',
    'Write Performance',
    'Storage Efficiency',
    'Data Integrity',
    'Query Simplicity',
  ];

  const normData = [
    breakdown.readPerformance.normalized,
    breakdown.writePerformance.normalized,
    breakdown.storageEfficiency.normalized,
    breakdown.dataIntegrity.normalized,
    breakdown.queryComplexity.normalized,
  ];

  const denormData = [
    breakdown.readPerformance.denormalized,
    breakdown.writePerformance.denormalized,
    breakdown.storageEfficiency.denormalized,
    breakdown.dataIntegrity.denormalized,
    breakdown.queryComplexity.denormalized,
  ];

  // In-place update: if chart instance exists on the same canvas with same type and theme,
  // update data arrays directly and avoid costly tear-down and re-allocation.
  if (
    chartInstance &&
    lastCanvas === canvasElement &&
    chartInstance.config?.type === currentChartType &&
    lastThemeMode === isDayMode
  ) {
    chartInstance.data.datasets[0].data = normData;
    chartInstance.data.datasets[1].data = denormData;
    chartInstance.update('none');
    return chartInstance;
  }

  // Palette from theme
  const textColor = isDayMode ? '#121a11' : '#ddffdc';
  const gridColor = isDayMode ? 'rgba(194, 212, 192, 0.6)' : 'rgba(72, 83, 70, 0.4)';
  const normColor = isDayMode ? '#2563eb' : '#60a5fa';
  const denormColor = isDayMode ? '#16a34a' : '#7fee64';

  if (chartInstance) {
    chartInstance.destroy();
  }

  lastCanvas = canvasElement;
  lastThemeMode = isDayMode;
  const ctx = canvasElement.getContext('2d');

  if (currentChartType === 'radar') {
    chartInstance = new window.Chart(ctx, {
      type: 'radar',
      data: {
        labels,
        datasets: [
          {
            label: 'Normalized (3NF)',
            data: normData,
            backgroundColor: isDayMode ? 'rgba(37, 99, 235, 0.15)' : 'rgba(96, 165, 250, 0.2)',
            borderColor: normColor,
            borderWidth: 2,
            pointBackgroundColor: normColor,
            pointBorderColor: '#fff',
            pointRadius: 4,
          },
          {
            label: 'Denormalized',
            data: denormData,
            backgroundColor: isDayMode ? 'rgba(22, 163, 74, 0.2)' : 'rgba(127, 238, 100, 0.22)',
            borderColor: denormColor,
            borderWidth: 2,
            pointBackgroundColor: denormColor,
            pointBorderColor: '#fff',
            pointRadius: 4,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: textColor,
              font: { family: 'Inter', size: 12, weight: '600' }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.dataset.label}: ${context.raw} / 10`
            }
          }
        },
        scales: {
          r: {
            min: 0,
            max: 10,
            ticks: {
              stepSize: 2,
              color: isDayMode ? '#536b51' : '#8cab87',
              backdropColor: 'transparent',
              font: { size: 10 }
            },
            grid: { color: gridColor },
            angleLines: { color: gridColor },
            pointLabels: {
              color: textColor,
              font: { family: 'Inter', size: 11, weight: '600' }
            }
          }
        }
      }
    });
  } else {
    // Grouped Bar Chart
    chartInstance = new window.Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Normalized (3NF)',
            data: normData,
            backgroundColor: normColor,
            borderRadius: 6,
          },
          {
            label: 'Denormalized',
            data: denormData,
            backgroundColor: denormColor,
            borderRadius: 6,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: textColor,
              font: { family: 'Inter', size: 12, weight: '600' }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.dataset.label}: ${context.raw} / 10`
            }
          }
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              font: { family: 'Inter', size: 11, weight: '600' }
            }
          },
          y: {
            min: 0,
            max: 10,
            grid: { color: gridColor },
            ticks: {
              stepSize: 2,
              color: isDayMode ? '#536b51' : '#8cab87',
              font: { size: 10 }
            },
            title: {
              display: true,
              text: 'Score (0 - 10 scale)',
              color: textColor,
              font: { size: 11, weight: '600' }
            }
          }
        }
      }
    });
  }

  return chartInstance;
}

export function toggleChartType(canvasElement, breakdown, isDayMode) {
  currentChartType = currentChartType === 'radar' ? 'bar' : 'radar';
  renderTradeoffChart(canvasElement, breakdown, isDayMode, currentChartType);
  return currentChartType;
}

export function getChartImageBase64() {
  if (chartInstance) {
    try {
      return chartInstance.toBase64Image();
    } catch (e) {
      console.warn('Could not export chart image:', e);
    }
  }
  return null;
}
