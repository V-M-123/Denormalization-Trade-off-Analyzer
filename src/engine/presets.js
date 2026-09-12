/**
 * Workload Presets and Schema Templates for Denormalization Trade-off Analysis
 */

export const WORKLOAD_PRESETS = [
  {
    id: 'ecommerce',
    title: 'E-Commerce Orders & Catalog',
    category: 'Read-Heavy Marketplace',
    icon: 'ShoppingCart',
    description: 'High read volume from customer order histories and product browsing, with moderate order checkout write transactions.',
    params: {
      readQps: 6500,
      writeQps: 500,
      table1Rows: 2500000, // Orders
      table2Rows: 300000,  // Customers
      table3Rows: 7500000, // Order Items
      joinDepth: 3,
      normRowSizeBytes: 160,
      denormRowSizeBytes: 490,
      hardwareTier: 'ssd',
      bufferCacheHitRatio: 0.85,
      indexOverheadPercent: 28,
      concurrency: 64,
      syncLockLevel: 'optimistic',
    },
    schema: {
      normalized: {
        tables: [
          { name: 'customers', cols: ['customer_id (PK)', 'name', 'email', 'tier', 'address'] },
          { name: 'orders', cols: ['order_id (PK)', 'customer_id (FK)', 'order_date', 'total_amount', 'status'] },
          { name: 'order_items', cols: ['item_id (PK)', 'order_id (FK)', 'product_id (FK)', 'quantity', 'unit_price'] },
          { name: 'products', cols: ['product_id (PK)', 'sku', 'title', 'category_id', 'stock_qty'] }
        ],
        query: `SELECT o.order_id, o.order_date, c.name, c.email, 
       oi.quantity, p.title, oi.unit_price
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
WHERE o.customer_id = ?
ORDER BY o.order_date DESC LIMIT 20;`,
        plan: [
          { step: '1. Clustered Index Scan', detail: 'orders WHERE customer_id = ? (Cost: 12.4ms)' },
          { step: '2. Hash Join', detail: 'Build hash table on customers via PK index (Cost: 4.8ms)' },
          { step: '3. Nested Loop Join', detail: 'Lookup order_items using order_id index (Cost: 11.2ms)' },
          { step: '4. B-Tree Index Seek', detail: 'Fetch product descriptions from products PK (Cost: 5.6ms)' },
          { step: 'Total Est. Execution Time', detail: '~34.0 ms | Memory buffer: 14.8 MB' }
        ]
      },
      denormalized: {
        tables: [
          { name: 'order_reporting_flattened', cols: [
            'order_id (PK)', 'order_date', 'customer_id', 'customer_name (RED)', 'customer_email (RED)',
            'item_id', 'product_sku (RED)', 'product_title (RED)', 'quantity', 'unit_price', 'order_status'
          ]}
        ],
        query: `SELECT order_id, order_date, customer_name, customer_email,
       quantity, product_title, unit_price
FROM order_reporting_flattened
WHERE customer_id = ?
ORDER BY order_date DESC LIMIT 20;`,
        plan: [
          { step: '1. Covering Index Seek', detail: 'idx_cust_date on order_reporting_flattened (Cost: 3.2ms)' },
          { step: '2. Single Table Row Fetch', detail: 'Direct attribute extraction without joins (Cost: 1.1ms)' },
          { step: 'Total Est. Execution Time', detail: '~4.3 ms | Memory buffer: 1.2 MB (7.9x faster read)' }
        ]
      }
    }
  },
  {
    id: 'social',
    title: 'Social Media Activity Feed',
    category: 'Extreme Read-Dominant',
    icon: 'MessageSquare',
    description: 'Extreme read-to-write ratio (98%+ reads) with millions of timeline queries and follower engagement metrics.',
    params: {
      readQps: 18000,
      writeQps: 350,
      table1Rows: 10000000, // Posts
      table2Rows: 800000,   // Users
      table3Rows: 25000000, // Likes / Comments
      joinDepth: 4,
      normRowSizeBytes: 200,
      denormRowSizeBytes: 620,
      hardwareTier: 'nvme',
      bufferCacheHitRatio: 0.92,
      indexOverheadPercent: 30,
      concurrency: 128,
      syncLockLevel: 'none',
    },
    schema: {
      normalized: {
        tables: [
          { name: 'users', cols: ['user_id (PK)', 'username', 'avatar_url', 'bio', 'verified'] },
          { name: 'posts', cols: ['post_id (PK)', 'author_id (FK)', 'content', 'created_at'] },
          { name: 'likes', cols: ['like_id (PK)', 'post_id (FK)', 'user_id (FK)', 'created_at'] },
          { name: 'comments', cols: ['comment_id (PK)', 'post_id (FK)', 'author_id (FK)', 'body'] }
        ],
        query: `SELECT p.post_id, p.content, u.username, u.avatar_url,
       COUNT(DISTINCT l.like_id) AS like_count,
       COUNT(DISTINCT c.comment_id) AS comment_count
FROM posts p
JOIN users u ON p.author_id = u.user_id
LEFT JOIN likes l ON p.post_id = l.post_id
LEFT JOIN comments c ON p.post_id = c.post_id
WHERE p.author_id IN (?)
GROUP BY p.post_id, u.username, u.avatar_url
ORDER BY p.created_at DESC LIMIT 15;`,
        plan: [
          { step: '1. Index Range Scan', detail: 'posts WHERE author_id IN (...) (Cost: 18.2ms)' },
          { step: '2. Hash Aggregate Join', detail: 'Aggregate join over 25M likes table (Cost: 45.0ms)' },
          { step: '3. Hash Aggregate Join', detail: 'Aggregate join over comments table (Cost: 32.1ms)' },
          { step: '4. Tempdb Spill Sort', detail: 'Sort & Group By in memory/tempdb (Cost: 19.5ms)' },
          { step: 'Total Est. Execution Time', detail: '~114.8 ms | Heavy CPU & lock pressure' }
        ]
      },
      denormalized: {
        tables: [
          { name: 'feed_posts_materialized', cols: [
            'post_id (PK)', 'author_id', 'author_username (RED)', 'author_avatar (RED)',
            'content', 'created_at', 'cached_like_count (PRECOMP)', 'cached_comment_count (PRECOMP)'
          ]}
        ],
        query: `SELECT post_id, author_username, author_avatar, content,
       cached_like_count, cached_comment_count
FROM feed_posts_materialized
WHERE author_id IN (?)
ORDER BY created_at DESC LIMIT 15;`,
        plan: [
          { step: '1. Multi-key B-Tree Seek', detail: 'posts index on author_id + created_at (Cost: 3.8ms)' },
          { step: '2. Clustered Fetch', detail: '0 JOINs, 0 dynamic COUNT(*) aggregations (Cost: 1.4ms)' },
          { step: 'Total Est. Execution Time', detail: '~5.2 ms (22x faster read throughput)' }
        ]
      }
    }
  },
  {
    id: 'financial',
    title: 'Financial Ledger & Banking',
    category: 'Write-Heavy & Strict Consistency',
    icon: 'Landmark',
    description: 'Strict transactional integrity (ACID 3NF/BCNF). High write frequency with zero tolerance for update anomalies or data drift.',
    params: {
      readQps: 1200,
      writeQps: 2400,
      table1Rows: 8000000, // Ledger entries
      table2Rows: 400000,  // Accounts
      table3Rows: 12000000,// Audit transactions
      joinDepth: 2,
      normRowSizeBytes: 140,
      denormRowSizeBytes: 420,
      hardwareTier: 'nvme',
      bufferCacheHitRatio: 0.90,
      indexOverheadPercent: 35,
      concurrency: 48,
      syncLockLevel: 'strict',
    },
    schema: {
      normalized: {
        tables: [
          { name: 'accounts', cols: ['account_id (PK)', 'account_no', 'balance', 'status', 'routing_no'] },
          { name: 'journal_entries', cols: ['entry_id (PK)', 'account_id (FK)', 'amount', 'type', 'created_at'] },
          { name: 'audit_log', cols: ['audit_id (PK)', 'entry_id (FK)', 'user_id', 'ip_address', 'checksum'] }
        ],
        query: `BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 250.00 WHERE account_id = 1004;
INSERT INTO journal_entries (account_id, amount, type) VALUES (1004, -250.00, 'DEBIT');
INSERT INTO audit_log (entry_id, user_id, checksum) VALUES (LAST_INSERT_ID(), 42, 'SHA256');
COMMIT;`,
        plan: [
          { step: '1. Row-level X-Lock', detail: 'Single row lock on accounts (Duration: 0.4ms)' },
          { step: '2. WAL Append', detail: 'Write-Ahead Log sequential flush (Duration: 0.6ms)' },
          { step: '3. Atomic Commit', detail: 'Guaranteed 0 data drift, 100% audit compliant' },
          { step: 'Total Est. Write Time', detail: '~2.8 ms | Write Amplification: 1.0x' }
        ]
      },
      denormalized: {
        tables: [
          { name: 'denormalized_account_statement', cols: [
            'entry_id (PK)', 'account_id', 'account_no (RED)', 'current_balance (RED)',
            'amount', 'type', 'routing_no (RED)', 'audit_checksum'
          ]}
        ],
        query: `-- Updating an account status or balance requires cascaded updates!
UPDATE denormalized_account_statement 
SET current_balance = current_balance - 250.00
WHERE account_id = 1004;`,
        plan: [
          { step: '1. Table Table-Scan/Range Lock', detail: 'Locks ALL historical rows for account 1004 (Cost: 28.4ms)' },
          { step: '2. Multi-row Index Update', detail: 'Rewrite 4,200 past transaction lines (Cost: 64.0ms)' },
          { step: '3. Risk of Race Condition', detail: 'Concurrent transfer creates divergent balances! Anomaly!' },
          { step: 'Total Est. Write Time', detail: '~92.4 ms | Severe write lock contention' }
        ]
      }
    }
  },
  {
    id: 'iot',
    title: 'IoT Telemetry & Sensor Stream',
    category: 'High-Throughput Ingestion',
    icon: 'Cpu',
    description: 'Massive continuous write stream from industrial devices. Queries inspect recent time windows or aggregated hourly metrics.',
    params: {
      readQps: 450,
      writeQps: 7200,
      table1Rows: 15000000, // Telemetry records
      table2Rows: 50000,    // Sensors / Devices
      table3Rows: 10000,    // Plant locations
      joinDepth: 3,
      normRowSizeBytes: 90,
      denormRowSizeBytes: 310,
      hardwareTier: 'ssd',
      bufferCacheHitRatio: 0.70,
      indexOverheadPercent: 15,
      concurrency: 96,
      syncLockLevel: 'none',
    },
    schema: {
      normalized: {
        tables: [
          { name: 'devices', cols: ['device_id (PK)', 'mac_addr', 'model', 'plant_id (FK)'] },
          { name: 'plants', cols: ['plant_id (PK)', 'location', 'region', 'manager_id'] },
          { name: 'telemetry_log', cols: ['event_id (PK)', 'device_id (FK)', 'timestamp', 'temperature', 'pressure'] }
        ],
        query: `INSERT INTO telemetry_log (device_id, timestamp, temperature, pressure) 
VALUES (9402, NOW(), 74.2, 101.3);`,
        plan: [
          { step: '1. Append-Only B-Tree Insert', detail: 'telemetry_log partitioned by date (Cost: 1.1ms)' },
          { step: '2. Minimal Lock Footprint', detail: '0 foreign table touches on write path' },
          { step: 'Total Est. Ingestion Time', detail: '~1.8 ms | Sustained 8,000+ writes/sec' }
        ]
      },
      denormalized: {
        tables: [
          { name: 'telemetry_wide_stream', cols: [
            'event_id (PK)', 'device_id', 'device_model (RED)', 'plant_location (RED)',
            'plant_region (RED)', 'timestamp', 'temperature', 'pressure'
          ]}
        ],
        query: `INSERT INTO telemetry_wide_stream 
VALUES (NEWID(), 9402, 'Siemens-X40', 'Sector 7, Munich', 'EU-Central', NOW(), 74.2, 101.3);`,
        plan: [
          { step: '1. Wide Row Ingestion', detail: 'Stores redundant plant & device strings every record' },
          { step: '2. Storage Expansion', detail: 'Storage expands from 1.8 GB/day to 6.2 GB/day (3.4x)' },
          { step: '3. Buffer Thrashing', detail: 'Page cache evicted rapidly by oversized rows' },
          { step: 'Total Est. Ingestion Time', detail: '~3.9 ms | Heavy I/O bus saturation' }
        ]
      }
    }
  },
  {
    id: 'healthcare',
    title: 'Healthcare EHR & Clinical Records',
    category: 'Balanced / High Compliance',
    icon: 'Activity',
    description: 'Patient medical records balancing quick doctor chart retrieval with continuous vital sign and nurse note entries.',
    params: {
      readQps: 2200,
      writeQps: 1800,
      table1Rows: 3000000, // Patient Visits
      table2Rows: 500000,  // Patients
      table3Rows: 9000000, // Prescriptions / Lab results
      joinDepth: 3,
      normRowSizeBytes: 190,
      denormRowSizeBytes: 520,
      hardwareTier: 'ssd',
      bufferCacheHitRatio: 0.88,
      indexOverheadPercent: 26,
      concurrency: 48,
      syncLockLevel: 'optimistic',
    },
    schema: {
      normalized: {
        tables: [
          { name: 'patients', cols: ['patient_id (PK)', 'mrn_no', 'full_name', 'dob', 'blood_group'] },
          { name: 'visits', cols: ['visit_id (PK)', 'patient_id (FK)', 'doctor_id', 'admission_date'] },
          { name: 'clinical_notes', cols: ['note_id (PK)', 'visit_id (FK)', 'diagnosis_code', 'notes'] }
        ],
        query: `SELECT p.full_name, p.dob, v.admission_date, n.diagnosis_code, n.notes
FROM patients p
JOIN visits v ON p.patient_id = v.patient_id
JOIN clinical_notes n ON v.visit_id = n.visit_id
WHERE p.patient_id = ?
ORDER BY v.admission_date DESC;`,
        plan: [
          { step: '1. PK Clustered Seek', detail: 'patients on patient_id (Cost: 0.4ms)' },
          { step: '2. Index Scan', detail: 'visits on patient_id (Cost: 6.2ms)' },
          { step: '3. Nested Loop Join', detail: 'clinical_notes on visit_id (Cost: 8.8ms)' },
          { step: 'Total Est. Execution Time', detail: '~15.4 ms | Safe data governance' }
        ]
      },
      denormalized: {
        tables: [
          { name: 'patient_chart_summary', cols: [
            'visit_id (PK)', 'patient_id', 'patient_name (RED)', 'patient_dob (RED)',
            'admission_date', 'diagnosis_code', 'notes'
          ]}
        ],
        query: `SELECT patient_name, patient_dob, admission_date, diagnosis_code, notes
FROM patient_chart_summary
WHERE patient_id = ?
ORDER BY admission_date DESC;`,
        plan: [
          { step: '1. Clustered Index Seek', detail: 'patient_chart_summary on patient_id (Cost: 3.4ms)' },
          { step: 'Total Est. Execution Time', detail: '~3.4 ms | Warning: Name change requires multi-row sync' }
        ]
      }
    }
  }
];
