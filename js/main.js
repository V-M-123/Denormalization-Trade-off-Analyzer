/**
 * Main Application Orchestrator
 * Coordinates form input, validation, real-time What-If slider reactivity,
 * Chart.js visualization, tab navigation, download modals, and dev test runner.
 */

import { validateInputs } from './validation.js';
import { calculateTradeoffScores } from './scoring.js';
import { PRESET_SCENARIOS } from './scenarios.js';
import { renderTradeoffChart, toggleChartType } from './chart.js';
import { downloadPdfReport, downloadDocReport, downloadTextReport } from './pdfExport.js';
import { getInitialTheme, applyTheme, toggleTheme } from './theme.js';

// Application State
let currentEvaluation = null;
let currentChartType = 'radar';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Theme (Night by default per Modal reference)
  const initialTheme = getInitialTheme();
  applyTheme(initialTheme, handleThemeChange);

  // Setup Theme Toggle Button
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      toggleTheme(handleThemeChange);
    });
  }

  // 2. Setup Tab Navigation
  setupNavigation();

  // 3. Setup Workload Presets
  setupPresets();

  // 4. Setup Form Event Listeners & Live What-If Slider
  setupForm();

  // 5. Setup Chart Toggle Button
  setupChartControls();

  // 6. Setup Download Report Modal
  setupDownloadModal();

  // 7. Setup Dev/Test Runner Panel
  setupTestPanel();

  // 8. Initial calculation with default Analytics Dashboard preset
  loadScenario(PRESET_SCENARIOS[1]);
});

function handleThemeChange(newTheme) {
  const isDay = newTheme === 'day';
  const canvas = document.getElementById('tradeoff-chart');
  if (canvas && currentEvaluation) {
    renderTradeoffChart(canvas, currentEvaluation.breakdown, isDay, currentChartType);
  }
}

/**
 * Tab Navigation Routing
 */
function setupNavigation() {
  const navButtons = document.querySelectorAll('[data-nav-target]');
  const tabSections = document.querySelectorAll('.tab-section');

  function switchTab(targetId) {
    navButtons.forEach(btn => {
      if (btn.getAttribute('data-nav-target') === targetId) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    tabSections.forEach(section => {
      if (section.id === targetId) {
        section.classList.remove('sr-only');
        section.style.display = 'block';
      } else {
        section.classList.add('sr-only');
        section.style.display = 'none';
      }
    });

    // If switching to analyzer, ensure chart renders properly
    if (targetId === 'tab-analyzer' && currentEvaluation) {
      setTimeout(() => {
        const isDay = document.documentElement.getAttribute('data-theme') === 'day';
        const canvas = document.getElementById('tradeoff-chart');
        renderTradeoffChart(canvas, currentEvaluation.breakdown, isDay, currentChartType);
      }, 50);
    }
  }

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-nav-target');
      switchTab(target);
    });
  });

  // Logo also links to Analyzer tab
  const brandLink = document.querySelector('.brand-link');
  if (brandLink) {
    brandLink.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab('tab-analyzer');
    });
  }
}

/**
 * Setup Preset Scenario Buttons
 */
function setupPresets() {
  const container = document.getElementById('preset-chips-container');
  if (!container) return;

  container.innerHTML = '';
  PRESET_SCENARIOS.forEach(scenario => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'preset-chip';
    chip.textContent = scenario.name;
    chip.title = scenario.description;
    chip.addEventListener('click', () => {
      loadScenario(scenario);
    });
    container.appendChild(chip);
  });
}

function loadScenario(scenario) {
  const form = document.getElementById('analyzer-form');
  if (!form) return;

  // Populate inputs
  document.getElementById('input-row-count').value = scenario.inputs.rowCount;
  document.getElementById('input-read-ratio').value = scenario.inputs.readPercent;
  document.getElementById('input-read-slider').value = scenario.inputs.readPercent;
  document.getElementById('input-write-ratio').value = scenario.inputs.writePercent;

  // Segmented buttons
  setSegmentedValue('queryComplexity', scenario.inputs.queryComplexity);
  setSegmentedValue('storageCostSensitivity', scenario.inputs.storageCostSensitivity);
  setSegmentedValue('dataConsistencyCriticality', scenario.inputs.dataConsistencyCriticality);

  // Mark active preset chip
  document.querySelectorAll('.preset-chip').forEach(chip => {
    if (chip.textContent === scenario.name) chip.classList.add('active');
    else chip.classList.remove('active');
  });

  // Run calculation immediately
  evaluateForm();
}

function setSegmentedValue(groupName, value) {
  const buttons = document.querySelectorAll(`[data-segmented-group="${groupName}"]`);
  buttons.forEach(btn => {
    if (btn.getAttribute('data-value') === value) {
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
    } else {
      btn.classList.remove('active');
      btn.setAttribute('aria-checked', 'false');
    }
  });
}

function getSegmentedValue(groupName) {
  const activeBtn = document.querySelector(`[data-segmented-group="${groupName}"].active`);
  return activeBtn ? activeBtn.getAttribute('data-value') : '';
}

/**
 * Form Event Handling & Live What-If Slider
 */
function setupForm() {
  const form = document.getElementById('analyzer-form');
  const readSlider = document.getElementById('input-read-slider');
  const readInput = document.getElementById('input-read-ratio');
  const writeInput = document.getElementById('input-write-ratio');
  const rowInput = document.getElementById('input-row-count');
  const resetBtn = document.getElementById('btn-reset');
  const liveToggle = document.getElementById('live-what-if-toggle');

  // Slider <-> Read/Write ratio synchronization
  readSlider.addEventListener('input', () => {
    const val = parseInt(readSlider.value, 10);
    readInput.value = val;
    writeInput.value = 100 - val;
    document.getElementById('display-read-val').textContent = `${val}%`;
    document.getElementById('display-write-val').textContent = `${100 - val}%`;
    if (liveToggle && liveToggle.checked) {
      evaluateForm();
    }
  });

  readInput.addEventListener('input', () => {
    let val = parseInt(readInput.value, 10);
    if (isNaN(val)) val = 0;
    val = Math.max(0, Math.min(100, val));
    readSlider.value = val;
    writeInput.value = 100 - val;
    document.getElementById('display-read-val').textContent = `${val}%`;
    document.getElementById('display-write-val').textContent = `${100 - val}%`;
    if (liveToggle && liveToggle.checked) {
      evaluateForm();
    }
  });

  writeInput.addEventListener('input', () => {
    let w = parseInt(writeInput.value, 10);
    if (isNaN(w)) w = 0;
    w = Math.max(0, Math.min(100, w));
    const r = 100 - w;
    readInput.value = r;
    readSlider.value = r;
    document.getElementById('display-read-val').textContent = `${r}%`;
    document.getElementById('display-write-val').textContent = `${w}%`;
    if (liveToggle && liveToggle.checked) {
      evaluateForm();
    }
  });

  rowInput.addEventListener('input', () => {
    if (liveToggle && liveToggle.checked) {
      evaluateForm();
    }
  });

  // Segmented button groups
  document.querySelectorAll('.segmented-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.getAttribute('data-segmented-group');
      const val = btn.getAttribute('data-value');
      setSegmentedValue(group, val);
      if (liveToggle && liveToggle.checked) {
        evaluateForm();
      }
    });
  });

  // Quick Row Presets (10K, 500K, 2M, 10M, 50M)
  document.querySelectorAll('[data-row-preset]').forEach(btn => {
    btn.addEventListener('click', () => {
      rowInput.value = btn.getAttribute('data-row-preset');
      if (liveToggle && liveToggle.checked) {
        evaluateForm();
      }
    });
  });

  // Reset Button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      loadScenario(PRESET_SCENARIOS[0]); // Reset to Small OLTP
    });
  }

  // Calculate Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    evaluateForm();
  });
}

/**
 * Gather form values and run validation & scoring
 */
function evaluateForm() {
  const rowCountRaw = document.getElementById('input-row-count').value;
  const readPercent = document.getElementById('input-read-ratio').value;
  const writePercent = document.getElementById('input-write-ratio').value;
  const queryComplexity = getSegmentedValue('queryComplexity');
  const storageCostSensitivity = getSegmentedValue('storageCostSensitivity');
  const dataConsistencyCriticality = getSegmentedValue('dataConsistencyCriticality');

  const rawInputs = {
    rowCount: rowCountRaw,
    readPercent,
    writePercent,
    queryComplexity,
    storageCostSensitivity,
    dataConsistencyCriticality,
  };

  const validation = validateInputs(rawInputs);
  renderValidationErrors(validation.errors);

  const calcBtn = document.getElementById('btn-calculate');
  if (calcBtn) {
    calcBtn.disabled = !validation.isValid;
  }

  if (!validation.isValid) {
    return;
  }

  // Calculate scores
  const evalInputs = {
    rowCount: validation.parsedRowCount,
    readPercent: Number(readPercent),
    writePercent: Number(writePercent),
    queryComplexity,
    storageCostSensitivity,
    dataConsistencyCriticality,
  };

  const evaluation = calculateTradeoffScores(evalInputs);
  currentEvaluation = evaluation;

  // Update Output UI
  renderResults(evaluation);
}

function renderValidationErrors(errors) {
  const fields = ['rowCount', 'ratioSum', 'queryComplexity', 'storageCostSensitivity', 'dataConsistencyCriticality'];
  fields.forEach(f => {
    const errorEl = document.getElementById(`error-${f}`);
    if (errorEl) {
      if (errors[f]) {
        errorEl.textContent = errors[f];
        errorEl.style.display = 'flex';
      } else {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
      }
    }
  });
}

/**
 * Render Results (Recommendation, Scores, and Chart)
 */
function renderResults(evaluation) {
  const { breakdown, scores, recommendation } = evaluation;

  // 1. Recommendation Banner
  const banner = document.getElementById('recommendation-banner');
  const verdictTag = document.getElementById('recommendation-verdict-tag');
  const verdictHeading = document.getElementById('recommendation-heading');
  const explanationEl = document.getElementById('recommendation-explanation');
  const whyEl = document.getElementById('takeaway-why');
  const flipEl = document.getElementById('takeaway-flip');

  if (banner) {
    banner.className = `recommendation-banner ${recommendation.badgeClass === 'denorm' ? 'prefer-denormalization' : recommendation.badgeClass === 'norm' ? 'prefer-normalization' : 'hybrid'}`;
    verdictTag.className = `verdict-tag ${recommendation.badgeClass}`;
    verdictTag.textContent = `${recommendation.verdict} (Norm: ${scores.normalizedAverage} vs Denorm: ${scores.denormalizedAverage})`;
    verdictHeading.textContent = recommendation.verdict;
    explanationEl.textContent = recommendation.explanation;
    whyEl.textContent = recommendation.keyTakeaways.why;
    flipEl.textContent = recommendation.keyTakeaways.whatCouldChange;
  }

  // 2. Score Cards
  const cardsContainer = document.getElementById('dimension-cards-container');
  if (cardsContainer) {
    cardsContainer.innerHTML = '';
    Object.values(breakdown).forEach(dim => {
      const card = document.createElement('div');
      card.className = 'dim-card';
      card.innerHTML = `
        <div class="dim-card-header">
          <span class="dim-card-title">${dim.label}</span>
          <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-muted); text-transform: uppercase;">
            ${dim.denormalized > dim.normalized ? '⚡ Denorm Favored' : dim.normalized > dim.denormalized ? '🛡️ Norm Favored' : 'Tied'}
          </span>
        </div>
        <div class="dim-score-row">
          <span style="color: var(--indicator-norm);">Norm: ${dim.normalized} / 10</span>
          <span style="color: var(--text-muted);">vs</span>
          <span style="color: var(--accent);">Denorm: ${dim.denormalized} / 10</span>
        </div>
        <p class="dim-justification">${dim.justification}</p>
      `;
      cardsContainer.appendChild(card);
    });
  }

  // 3. Render Chart
  const isDay = document.documentElement.getAttribute('data-theme') === 'day';
  const canvas = document.getElementById('tradeoff-chart');
  renderTradeoffChart(canvas, breakdown, isDay, currentChartType);
}

/**
 * Setup Chart Toggle Button (Radar vs Grouped Bar)
 */
function setupChartControls() {
  const toggleBtn = document.getElementById('btn-toggle-chart-type');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (!currentEvaluation) return;
    const isDay = document.documentElement.getAttribute('data-theme') === 'day';
    const canvas = document.getElementById('tradeoff-chart');
    currentChartType = toggleChartType(canvas, currentEvaluation.breakdown, isDay);
    toggleBtn.textContent = currentChartType === 'radar' ? 'Switch to Bar Chart' : 'Switch to Radar Chart';
  });
}

/**
 * Setup Download Modal
 */
function setupDownloadModal() {
  const openButtons = document.querySelectorAll('[data-action="open-download"]');
  const modal = document.getElementById('download-modal');
  const closeBtn = document.getElementById('close-download-modal');

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!currentEvaluation) evaluateForm();
      if (modal) modal.style.display = 'flex';
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  // Download Action Buttons inside modal
  const btnPdf = document.getElementById('dl-pdf');
  const btnDoc = document.getElementById('dl-doc');
  const btnTxt = document.getElementById('dl-txt');

  if (btnPdf) {
    btnPdf.addEventListener('click', () => {
      if (currentEvaluation) downloadPdfReport(currentEvaluation);
    });
  }
  if (btnDoc) {
    btnDoc.addEventListener('click', () => {
      if (currentEvaluation) downloadDocReport(currentEvaluation);
    });
  }
  if (btnTxt) {
    btnTxt.addEventListener('click', () => {
      if (currentEvaluation) downloadTextReport(currentEvaluation);
    });
  }
}

/**
 * Dev/Test Runner Panel (PRD Section 10 & Rubric Verification)
 */
function setupTestPanel() {
  const panel = document.getElementById('test-results-container');
  const runBtn = document.getElementById('btn-run-tests');

  if (runBtn && panel) {
    runBtn.addEventListener('click', () => {
      runAutomatedTests();
    });
  }
}

function runAutomatedTests() {
  const panel = document.getElementById('test-results-container');
  if (!panel) return;

  const testCases = [
    {
      id: 'T1',
      title: 'Small dataset, read-heavy, low consistency',
      inputs: { rowCount: 10000, readPercent: 95, writePercent: 5, queryComplexity: 'complex', storageCostSensitivity: 'low', dataConsistencyCriticality: 'low' },
      expected: 'Prefer Denormalization'
    },
    {
      id: 'T2',
      title: 'Large dataset, write-heavy, high consistency',
      inputs: { rowCount: 15000000, readPercent: 20, writePercent: 80, queryComplexity: 'simple', storageCostSensitivity: 'medium', dataConsistencyCriticality: 'high' },
      expected: 'Prefer Normalization'
    },
    {
      id: 'T3',
      title: 'Mixed / moderate everything',
      inputs: { rowCount: 2000000, readPercent: 70, writePercent: 30, queryComplexity: 'medium', storageCostSensitivity: 'medium', dataConsistencyCriticality: 'medium' },
      expected: 'Hybrid'
    },
    {
      id: 'T4',
      title: 'Validation: Read% + Write% != 100',
      validationCheck: () => {
        const val = validateInputs({ rowCount: '10K', readPercent: 60, writePercent: 50, queryComplexity: 'simple', storageCostSensitivity: 'low', dataConsistencyCriticality: 'low' });
        return !val.isValid && !!val.errors.ratioSum;
      },
      expected: 'Invalid sum caught'
    },
    {
      id: 'T5',
      title: 'Validation: Negative or non-numeric row count',
      validationCheck: () => {
        const val1 = validateInputs({ rowCount: '-500', readPercent: 80, writePercent: 20, queryComplexity: 'simple', storageCostSensitivity: 'low', dataConsistencyCriticality: 'low' });
        const val2 = validateInputs({ rowCount: 'abc', readPercent: 80, writePercent: 20, queryComplexity: 'simple', storageCostSensitivity: 'low', dataConsistencyCriticality: 'low' });
        return !val1.isValid && !val2.isValid;
      },
      expected: 'Invalid row count caught'
    }
  ];

  panel.innerHTML = '';
  let allPass = true;

  testCases.forEach(tc => {
    let pass = false;
    let actual = '';

    if (tc.validationCheck) {
      pass = tc.validationCheck();
      actual = pass ? tc.expected : 'Failed validation';
    } else {
      const res = calculateTradeoffScores(tc.inputs);
      actual = res.recommendation.verdict;
      pass = actual === tc.expected;
    }

    if (!pass) allPass = false;

    const row = document.createElement('div');
    row.style.cssText = 'padding: 10px; border-radius: 6px; margin-bottom: 8px; font-family: var(--font-mono); font-size: 12px; display: flex; justify-content: space-between; align-items: center; background: var(--surface-code); border: 1px solid var(--border);';
    row.innerHTML = `
      <div>
        <strong style="color: var(--text-primary);">${tc.id}: ${tc.title}</strong>
        <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">
          Expected: <span style="color: var(--accent);">${tc.expected}</span> | Actual: <span>${actual}</span>
        </div>
      </div>
      <span style="padding: 2px 8px; border-radius: 9999px; font-weight: bold; font-size: 11px; ${pass ? 'background: rgba(127, 238, 100, 0.2); color: var(--accent);' : 'background: rgba(248, 113, 113, 0.2); color: var(--error);'}">
        ${pass ? 'PASSED ✓' : 'FAILED ✗'}
      </span>
    `;
    panel.appendChild(row);
  });

  const banner = document.getElementById('test-summary-banner');
  if (banner) {
    banner.innerHTML = allPass 
      ? `<span style="color: var(--accent); font-weight: bold;">✓ 5 of 5 Test Cases Passed (100% Pass Rate)</span>`
      : `<span style="color: var(--error); font-weight: bold;">✗ Some Tests Failed</span>`;
  }
}
