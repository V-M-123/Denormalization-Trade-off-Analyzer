/**
 * Scoring & Recommendation Engine
 * Evaluates Normalized (3NF) vs. Denormalized architectures on a 0-10 scale
 * across the 5 core dimensions specified in PRD Section 4.2.
 */

export function calculateTradeoffScores(inputs) {
  const rowCount = Math.max(1, Number(inputs.rowCount) || 100000);
  const readPercent = Math.max(0, Math.min(100, Number(inputs.readPercent) || 80));
  const writePercent = Math.max(0, Math.min(100, Number(inputs.writePercent) || 20));
  const queryComplexity = inputs.queryComplexity || 'medium';
  const storageSensitivity = inputs.storageCostSensitivity || 'medium';
  const consistency = inputs.dataConsistencyCriticality || 'high';

  // --- 1. Read Performance (0 - 10) ---
  // Normalized read score: joins introduce latency
  let normRead = 8.0;
  if (queryComplexity === 'simple') normRead = 8.5;
  else if (queryComplexity === 'medium') normRead = 6.5;
  else if (queryComplexity === 'complex') normRead = 4.5;
  if (rowCount > 10000000) normRead -= 0.5;

  // Denormalized read score: joins eliminated
  let denormRead = 9.5;
  if (queryComplexity === 'simple') denormRead = 8.8; // less gain when queries are already trivial
  if (readPercent > 70 && (consistency === 'low' || consistency === 'medium')) {
    denormRead = Math.min(10, denormRead + 0.5);
  }
  // PRD Rule: Row count > ~10M exceeds typical RAM/cache buffer pool, dampening read bonus
  if (rowCount >= 10000000) {
    denormRead -= 1.8;
  } else if (rowCount >= 2000000) {
    denormRead -= 0.6;
  }

  normRead = Math.max(1, Math.min(10, Math.round(normRead * 10) / 10));
  denormRead = Math.max(1, Math.min(10, Math.round(denormRead * 10) / 10));

  // --- 2. Write Performance (0 - 10) ---
  // Normalized: single row update, minimal lock contention
  let normWrite = 9.2;
  if (writePercent > 40 && consistency === 'high') {
    normWrite = Math.min(10, normWrite + 0.6);
  }

  // Denormalized: multi-row rewrite amplification
  let denormWrite = 7.5 - ((writePercent / 100) * 5.0);
  if (rowCount > 5000000) denormWrite -= 1.0;

  normWrite = Math.max(1, Math.min(10, Math.round(normWrite * 10) / 10));
  denormWrite = Math.max(1, Math.min(10, Math.round(denormWrite * 10) / 10));

  // --- 3. Storage Efficiency (0 - 10) ---
  // Normalized: zero column duplication
  let normStorage = 9.5;

  // Denormalized: duplicated columns inflate storage
  let denormStorage = 6.5;
  if (storageSensitivity === 'high') denormStorage = 4.0;
  else if (storageSensitivity === 'medium') denormStorage = 6.0;
  else if (storageSensitivity === 'low') denormStorage = 7.5;

  normStorage = Math.max(1, Math.min(10, Math.round(normStorage * 10) / 10));
  denormStorage = Math.max(1, Math.min(10, Math.round(denormStorage * 10) / 10));

  // --- 4. Data Integrity (0 - 10) ---
  // Normalized: foreign keys guarantee ACID single-source-of-truth
  let normIntegrity = 10.0;

  // Denormalized: prone to update/deletion anomalies under concurrent writes
  let denormIntegrity = 8.0 - ((writePercent / 100) * 3.5);
  if (consistency === 'high') denormIntegrity -= 2.0;
  else if (consistency === 'medium') denormIntegrity -= 1.0;

  normIntegrity = Math.max(1, Math.min(10, Math.round(normIntegrity * 10) / 10));
  denormIntegrity = Math.max(1, Math.min(10, Math.round(denormIntegrity * 10) / 10));

  // --- 5. Query Complexity Handling (0 - 10) ---
  // Normalized: requires complex multi-table SQL queries with joins
  let normComplexity = queryComplexity === 'simple' ? 8.0 : queryComplexity === 'medium' ? 6.0 : 4.0;
  // Denormalized: flat queries without joins
  let denormComplexity = queryComplexity === 'simple' ? 8.5 : queryComplexity === 'medium' ? 9.0 : 9.5;

  normComplexity = Math.max(1, Math.min(10, Math.round(normComplexity * 10) / 10));
  denormComplexity = Math.max(1, Math.min(10, Math.round(denormComplexity * 10) / 10));

  // --- Textual Justifications ---
  const breakdown = {
    readPerformance: {
      label: 'Read Performance',
      normalized: normRead,
      denormalized: denormRead,
      justification: denormRead >= normRead
        ? `Denormalization avoids multi-table joins, yielding faster record lookups (${readPercent}% reads).`
        : `At ${rowCount.toLocaleString()} rows, wide denormalized rows exceed RAM cache, causing buffer misses.`
    },
    writePerformance: {
      label: 'Write Performance',
      normalized: normWrite,
      denormalized: denormWrite,
      justification: normWrite > denormWrite
        ? `Normalized updates touch only 1 row in 1 table, avoiding multi-record rewrite locks (${writePercent}% writes).`
        : `Low write traffic keeps denormalization update overhead minimal.`
    },
    storageEfficiency: {
      label: 'Storage Efficiency',
      normalized: normStorage,
      denormalized: denormStorage,
      justification: `Normalized schema eliminates column duplication. Denormalization multiplies disk and index footprint (${storageSensitivity} sensitivity).`
    },
    dataIntegrity: {
      label: 'Data Integrity',
      normalized: normIntegrity,
      denormalized: denormIntegrity,
      justification: `Normalized guarantees ACID integrity via foreign keys. Denormalization risks update/sync drift (${consistency} criticality).`
    },
    queryComplexity: {
      label: 'Query Simplicity',
      normalized: normComplexity,
      denormalized: denormComplexity,
      justification: `Denormalized queries are single-table SELECTs. Normalized queries require complex multi-table joins.`
    },
  };

  // --- Recommendation Logic (PRD Section 4.3) ---
  const normTotal = (normRead * (readPercent / 100)) + 
                    (normWrite * (writePercent / 100)) + 
                    (normStorage * 0.4) + 
                    (normIntegrity * (consistency === 'high' ? 1.0 : consistency === 'medium' ? 0.7 : 0.4)) + 
                    (normComplexity * 0.4);

  const denormTotal = (denormRead * (readPercent / 100)) + 
                      (denormWrite * (writePercent / 100)) + 
                      (denormStorage * 0.4) + 
                      (denormIntegrity * (consistency === 'high' ? 1.0 : consistency === 'medium' ? 0.7 : 0.4)) + 
                      (denormComplexity * 0.4);

  const delta = denormTotal - normTotal;
  let verdict = 'Hybrid';
  let badgeClass = 'hybrid';
  let explanation = '';
  let keyTakeaways = { why: '', whatCouldChange: '' };

  if (delta > 0.45 && readPercent >= 75 && consistency !== 'high') {
    verdict = 'Prefer Denormalization';
    badgeClass = 'denorm';
    explanation = `Your workload is heavily read-dominant (${readPercent}% reads) with ${consistency} consistency requirements. Denormalization removes join latency on ${queryComplexity} queries, while low write volume (${writePercent}%) keeps rewrite penalties and anomaly risks low.`;
    keyTakeaways.why = `Read throughput gains (${denormRead}/10 vs ${normRead}/10) decisively outweigh the moderate storage duplication under low write volume.`;
    keyTakeaways.whatCouldChange = `If write load exceeds 35% or if strict financial-grade consistency is mandated, write amplification and sync anomalies will shift the recommendation to Normalization.`;
  } else if (delta < -0.45 || writePercent >= 40 || consistency === 'high') {
    verdict = 'Prefer Normalization';
    badgeClass = 'norm';
    explanation = `Given the substantial write volume (${writePercent}% writes) and ${consistency} consistency criticality, strict Normalization (3NF) is strongly recommended. Normalization guarantees atomic single-row updates and zero data anomalies.`;
    keyTakeaways.why = `Write efficiency (${normWrite}/10 vs ${denormWrite}/10) and ACID integrity (${normIntegrity}/10) prevent multi-row rewrite locks and data corruption.`;
    keyTakeaways.whatCouldChange = `If the system transitions to read-only reporting (>85% reads) or if join execution times breach SLAs, introducing read replicas or materialized views can be explored.`;
  } else {
    verdict = 'Hybrid';
    badgeClass = 'hybrid';
    explanation = `Your workload exhibits a balanced mix (${readPercent}% reads, ${writePercent}% writes) with ${consistency} consistency needs. A Hybrid strategy is optimal: keep transactional entities normalized (3NF) while selectively denormalizing read-heavy summary tables or utilizing in-memory caching.`;
    keyTakeaways.why = `Neither pure Normalization nor pure Denormalization satisfies both write integrity and query latency across all access patterns.`;
    keyTakeaways.whatCouldChange = `A clear traffic shift toward pure reads (>85%) or heavy batch updates (>50%) would tip the balance toward one paradigm.`;
  }

  const normAvg = Number(((normRead + normWrite + normStorage + normIntegrity + normComplexity) / 5).toFixed(1));
  const denormAvg = Number(((denormRead + denormWrite + denormStorage + denormIntegrity + denormComplexity) / 5).toFixed(1));

  return {
    inputs: {
      rowCount,
      readPercent,
      writePercent,
      queryComplexity,
      storageCostSensitivity: storageSensitivity,
      dataConsistencyCriticality: consistency,
    },
    breakdown,
    scores: {
      normalizedAverage: normAvg,
      denormalizedAverage: denormAvg,
    },
    recommendation: {
      verdict,
      badgeClass,
      explanation,
      keyTakeaways,
    },
    timestamp: new Date().toISOString(),
  };
}
