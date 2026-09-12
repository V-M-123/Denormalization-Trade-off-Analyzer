/**
 * Automated Verification & Test Suite for Denormalization Trade-off Analyzer
 * 
 * Verifies calculation logic, boundary conditions, edge cases, and mathematical models.
 */

import { calculateTradeoffs, generateWorkloadSweepData } from './costModel.js';

export function runAllTests() {
  const results = [];

  const addResult = (id, name, category, passed, message, metrics = {}) => {
    results.push({
      id,
      name,
      category,
      passed,
      message,
      metrics,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  // Test 1: Read-Heavy Dominance
  try {
    const res = calculateTradeoffs({
      readQps: 9500,
      writeQps: 500,
      joinDepth: 3,
      table1Rows: 1000000,
      table2Rows: 100000,
    });
    const speedup = res.latency.readSpeedupFactor;
    const passed = speedup >= 1.8 && res.latency.denormReadLatencyMs < res.latency.normReadLatencyMs;
    addResult(
      'T1',
      'Read-Heavy Workload Advantage',
      'Performance Scaling',
      passed,
      passed 
        ? `Passed: Denormalized read latency (${res.latency.denormReadLatencyMs}ms) outperforms Normalized (${res.latency.normReadLatencyMs}ms) with ${speedup}x speedup.`
        : `Failed: Expected read speedup >= 1.8x, got ${speedup}x.`,
      { normRead: res.latency.normReadLatencyMs, denormRead: res.latency.denormReadLatencyMs, speedup }
    );
  } catch (err) {
    addResult('T1', 'Read-Heavy Workload Advantage', 'Performance Scaling', false, `Exception: ${err.message}`);
  }

  // Test 2: Write-Heavy Penalty & Write Amplification
  try {
    const res = calculateTradeoffs({
      readQps: 1000,
      writeQps: 9000,
      joinDepth: 2,
      table1Rows: 2000000,
      table2Rows: 50000, // High fanout = 40
    });
    const amp = res.latency.denormWriteAmplification;
    const passed = amp > 2.0 && res.latency.denormWriteLatencyMs > res.latency.normWriteLatencyMs;
    addResult(
      'T2',
      'Write-Heavy Penalty & Amplification',
      'Locking & I/O',
      passed,
      passed
        ? `Passed: Denormalized write amplification (${amp}x) correctly penalizes write latency (${res.latency.denormWriteLatencyMs}ms vs ${res.latency.normWriteLatencyMs}ms).`
        : `Failed: Expected write amplification > 2.0x, got ${amp}x.`,
      { writeAmp: amp, normWrite: res.latency.normWriteLatencyMs, denormWrite: res.latency.denormWriteLatencyMs }
    );
  } catch (err) {
    addResult('T2', 'Write-Heavy Penalty', 'Locking & I/O', false, `Exception: ${err.message}`);
  }

  // Test 3: Zero-Write Boundary Edge Case
  try {
    const res = calculateTradeoffs({
      readQps: 5000,
      writeQps: 0, // Zero writes
    });
    const passed = !isNaN(res.latency.normOverallLatencyMs) && 
                   !isNaN(res.latency.denormOverallLatencyMs) &&
                   res.latency.writeRatioPercent === 0;
    addResult(
      'T3',
      'Zero-Write Boundary Condition',
      'Edge Case / Safety',
      passed,
      passed
        ? `Passed: Clean execution with 0 writes. No NaN or division-by-zero. Anomaly risk handled gracefully.`
        : `Failed: Division by zero or NaN detected.`,
      { overallNorm: res.latency.normOverallLatencyMs, overallDenorm: res.latency.denormOverallLatencyMs }
    );
  } catch (err) {
    addResult('T3', 'Zero-Write Boundary Condition', 'Edge Case / Safety', false, `Exception: ${err.message}`);
  }

  // Test 4: Zero-Read Boundary Edge Case
  try {
    const res = calculateTradeoffs({
      readQps: 0, // Zero reads
      writeQps: 5000,
    });
    const passed = !isNaN(res.latency.normOverallLatencyMs) && 
                   res.latency.readRatioPercent === 0 &&
                   res.latency.normOverallLatencyMs === res.latency.normWriteLatencyMs;
    addResult(
      'T4',
      'Zero-Read Boundary Condition',
      'Edge Case / Safety',
      passed,
      passed
        ? `Passed: Pure write stream evaluated accurately. Latency aligns exactly with write cost (${res.latency.normWriteLatencyMs}ms).`
        : `Failed: Zero-read calculation error.`,
      { readRatio: res.latency.readRatioPercent }
    );
  } catch (err) {
    addResult('T4', 'Zero-Read Boundary Condition', 'Edge Case / Safety', false, `Exception: ${err.message}`);
  }

  // Test 5: Storage Footprint Monotonicity
  try {
    const res = calculateTradeoffs({
      table1Rows: 1000000,
      normRowSizeBytes: 150,
      denormRowSizeBytes: 450,
    });
    const passed = res.storage.denormStorageGb > res.storage.normStorageGb && 
                   res.storage.storageInflationFactor >= 1.0;
    addResult(
      'T5',
      'Storage Footprint Monotonicity',
      'Storage Invariant',
      passed,
      passed
        ? `Passed: Denormalized storage (${res.storage.denormStorageGb} GB) exceeds Normalized (${res.storage.normStorageGb} GB) with inflation factor ${res.storage.storageInflationFactor}x.`
        : `Failed: Storage invariant violated.`,
      { normGb: res.storage.normStorageGb, denormGb: res.storage.denormStorageGb, factor: res.storage.storageInflationFactor }
    );
  } catch (err) {
    addResult('T5', 'Storage Monotonicity', 'Storage Invariant', false, `Exception: ${err.message}`);
  }

  // Test 6: Anomaly Risk Bounds [0, 100]
  try {
    const resStrict = calculateTradeoffs({ syncLockLevel: 'strict', writeQps: 200 });
    const resNone = calculateTradeoffs({ syncLockLevel: 'none', writeQps: 8000, readQps: 200 });
    const passed = resStrict.anomaly.normAnomalyRisk === 0 &&
                   resNone.anomaly.denormAnomalyRisk <= 100 &&
                   resNone.anomaly.denormAnomalyRisk >= 0 &&
                   resStrict.anomaly.denormAnomalyRisk <= resNone.anomaly.denormAnomalyRisk;
    addResult(
      'T6',
      'Anomaly Risk Mathematical Bounds',
      'Data Integrity',
      passed,
      passed
        ? `Passed: Normalized anomaly risk is strictly 0. Denormalized risk bounded [0, 100] (Strict lock: ${resStrict.anomaly.denormAnomalyRisk}/100, None: ${resNone.anomaly.denormAnomalyRisk}/100).`
        : `Failed: Anomaly risk out of bounds.`,
      { normRisk: 0, strictRisk: resStrict.anomaly.denormAnomalyRisk, eventualRisk: resNone.anomaly.denormAnomalyRisk }
    );
  } catch (err) {
    addResult('T6', 'Anomaly Risk Bounds', 'Data Integrity', false, `Exception: ${err.message}`);
  }

  // Test 7: Buffer Pool Cache Eviction Sensitivity
  try {
    const highCache = calculateTradeoffs({ bufferCacheHitRatio: 0.95 });
    const lowCache = calculateTradeoffs({ bufferCacheHitRatio: 0.40 });
    const passed = lowCache.latency.normReadLatencyMs > highCache.latency.normReadLatencyMs &&
                   lowCache.latency.denormReadLatencyMs > highCache.latency.denormReadLatencyMs;
    addResult(
      'T7',
      'Buffer Cache Eviction Sensitivity',
      'Hardware & I/O',
      passed,
      passed
        ? `Passed: Lower buffer cache hit ratio (40% vs 95%) properly increases read latency due to physical page fetch delays.`
        : `Failed: Cache miss didn't inflate disk I/O latency.`,
      { highHitLatency: highCache.latency.normReadLatencyMs, lowHitLatency: lowCache.latency.normReadLatencyMs }
    );
  } catch (err) {
    addResult('T7', 'Buffer Cache Eviction', 'Hardware & I/O', false, `Exception: ${err.message}`);
  }

  // Test 8: Sweep Curve & Break-Even Continuity
  try {
    const sweep = generateWorkloadSweepData({ readQps: 5000, writeQps: 500 });
    const passed = sweep.length === 21 && 
                   sweep[0].readPercent === 0 && 
                   sweep[20].readPercent === 100 &&
                   !sweep.some(p => isNaN(p.normLatency) || isNaN(p.denormLatency));
    addResult(
      'T8',
      'Workload Sweep Curve Continuity',
      'Algorithmic Consistency',
      passed,
      passed
        ? `Passed: Successfully generated 21 smooth sweep points from 0% to 100% read ratio with valid latencies.`
        : `Failed: Sweep points corrupted or incomplete.`,
      { pointCount: sweep.length }
    );
  } catch (err) {
    addResult('T8', 'Sweep Curve Continuity', 'Algorithmic Consistency', false, `Exception: ${err.message}`);
  }

  const passedCount = results.filter(r => r.passed).length;
  return {
    total: results.length,
    passedCount,
    failedCount: results.length - passedCount,
    allPassed: passedCount === results.length,
    results,
  };
}
