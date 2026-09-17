/**
 * Input Parsing & Validation Module
 * Handles K/M/B shorthand parsing (e.g. 10k -> 10000, 2.5M -> 2500000)
 * and field-level validation rules.
 */

/**
 * Parses user row count string into an integer.
 * Accepts formats: "10000", "10k", "10K", "2.5M", "50m", "1B", "1,000,000".
 * Returns integer or NaN.
 */
export function parseRowCount(input) {
  if (input === null || input === undefined) return NaN;
  if (typeof input === 'number') return Math.round(input);

  const clean = String(input).trim().replace(/,/g, '');
  if (!clean) return NaN;

  // Match number with optional shorthand suffix
  const match = clean.match(/^([0-9.]+)\s*([kKmMbB])?$/);
  if (!match) return NaN;

  const num = parseFloat(match[1]);
  if (isNaN(num)) return NaN;

  const unit = match[2] ? match[2].toUpperCase() : '';
  let multiplier = 1;
  if (unit === 'K') multiplier = 1e3;
  else if (unit === 'M') multiplier = 1e6;
  else if (unit === 'B') multiplier = 1e9;

  return Math.round(num * multiplier);
}

/**
 * Formats a number with friendly K/M shorthand.
 */
export function formatRowShorthand(num) {
  if (isNaN(num)) return '0';
  if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toLocaleString();
}

/**
 * Validates all form inputs.
 * Returns { isValid: boolean, errors: Object, parsedRowCount: number }
 */
export function validateInputs(inputs) {
  const errors = {};
  const parsedRowCount = parseRowCount(inputs.rowCount);

  // 1. Row count validation
  if (isNaN(parsedRowCount) || parsedRowCount <= 0) {
    errors.rowCount = 'Row count must be a positive number greater than 0 (e.g. 50K, 2M).';
  }

  // 2. Read and Write percentages
  const read = Number(inputs.readPercent);
  const write = Number(inputs.writePercent);

  if (isNaN(read) || read < 0 || read > 100) {
    errors.readPercent = 'Read ratio must be between 0% and 100%.';
  }
  if (isNaN(write) || write < 0 || write > 100) {
    errors.writePercent = 'Write ratio must be between 0% and 100%.';
  }
  if (!isNaN(read) && !isNaN(write) && Math.round(read + write) !== 100) {
    errors.ratioSum = `Read (${read}%) and Write (${write}%) must sum to 100% (currently ${read + write}%).`;
  }

  // 3. Enums validation
  if (!['simple', 'medium', 'complex'].includes(inputs.queryComplexity)) {
    errors.queryComplexity = 'Please select a query complexity level.';
  }
  if (!['low', 'medium', 'high'].includes(inputs.storageCostSensitivity)) {
    errors.storageCostSensitivity = 'Please select storage cost sensitivity.';
  }
  if (!['low', 'medium', 'high'].includes(inputs.dataConsistencyCriticality)) {
    errors.dataConsistencyCriticality = 'Please select data consistency criticality.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    parsedRowCount: isNaN(parsedRowCount) ? 0 : parsedRowCount,
  };
}
