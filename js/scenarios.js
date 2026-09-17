/**
 * Preset Scenarios Module
 * Defines the 3 standard presets required by PRD Section 4.5.
 */

export const PRESET_SCENARIOS = [
  {
    id: 'small-oltp',
    name: 'Small OLTP App',
    category: 'Transactional Banking / Ledger',
    description: 'Low rows, high write and update traffic, strict ACID consistency required.',
    expected: 'Prefer Normalization',
    inputs: {
      rowCount: '50K',
      readPercent: 30,
      writePercent: 70,
      queryComplexity: 'simple',
      storageCostSensitivity: 'medium',
      dataConsistencyCriticality: 'high',
    }
  },
  {
    id: 'analytics-dashboard',
    name: 'Analytics Dashboard',
    category: 'OLAP / Data Warehouse',
    description: 'Huge rows, heavily read-dominant, complex queries, low consistency criticality.',
    expected: 'Prefer Denormalization',
    inputs: {
      rowCount: '10M',
      readPercent: 95,
      writePercent: 5,
      queryComplexity: 'complex',
      storageCostSensitivity: 'low',
      dataConsistencyCriticality: 'low',
    }
  },
  {
    id: 'mixed-workload',
    name: 'Mixed Workload',
    category: 'Standard Multi-Tenant SaaS',
    description: 'Moderate row volume, balanced read/write traffic, medium complexity.',
    expected: 'Hybrid',
    inputs: {
      rowCount: '2M',
      readPercent: 70,
      writePercent: 30,
      queryComplexity: 'medium',
      storageCostSensitivity: 'medium',
      dataConsistencyCriticality: 'medium',
    }
  }
];
