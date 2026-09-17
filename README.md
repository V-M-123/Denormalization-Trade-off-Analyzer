# Denormalization Trade-off Analyzer

> **A zero-build client-side educational web application demonstrating and analyzing relational database normalization (1NF–3NF) vs. denormalization trade-offs.**
> 
> *Course Project for Database Management Systems*  
> **Guided By:** **Dr. Swaminathan A**, Assistant Professor, School of Computer Science and Engineering (SCOPE)  
> **Design Theme:** **Modal — Style Reference** (*Phosphor terminal in a darkened server room — the vivid green is the only light source*)

---

## 1. Project Overview

The **Denormalization Trade-off Analyzer** is an interactive, responsive web application designed for students, database administrators, and software architects. It evaluates workload parameters (table row counts, read/write ratios, query complexity, storage cost sensitivity, and data consistency criticality) to determine whether a relational database should remain in **Strict Normalization (3NF)** or transition to **Denormalization** for query performance.

### Key Capabilities
- **Exact 5 Workload Inputs:** Supports row counts with K/M/B shorthand (e.g., `10k`, `2M`, `50M`), interactive Read/Write ratio slider (auto-summing to 100%), and selectable enums for complexity, storage sensitivity, and consistency.
- **Rule-Based 0–10 Scoring Engine:** Independently scores Normalized (3NF) and Denormalized across 5 dimensions: Read Performance, Write Performance, Storage Efficiency, Data Integrity, and Query Complexity.
- **5-Axis Radar & Grouped Bar Visualization:** Powered by Chart.js, rendering in phosphor terminal green with day/night adaptability.
- **Three Preset Scenarios:** *Small OLTP app*, *Analytics dashboard*, and *Mixed workload*.
- **Client-Side Report Exporter:** Downloadable executive PDF reports (with embedded radar chart), Microsoft Word (.doc) documents, and plain text (.txt) audits.
- **Mandatory Academic Sections:** Top-level navigation featuring **Analyzer (Home)**, **Learn** (1NF-3NF breakdown, embedded YouTube video, references), **Developed By** (student profiles and supervisor citation), **Help** (user manual, button descriptions, FAQ), and an automated **Dev/Test Panel**.

---

## 2. How to Run Locally (Zero Build Step)

Per PRD Section 6, the entire application runs directly in any modern web browser with **no build step, no package installation, and no server configuration required**:

### Option A: Open Directly (Recommended)
Simply double-click or open `index.html` in your favorite web browser:
```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### Option B: Local Static Server (Optional)
If using an HTTP server or Vite:
```bash
# Using Python
python -m http.server 8000

# Using Node / Vite
npm run dev
```
Visit `http://localhost:5173` or `http://localhost:8000`.

---

## 3. File & Module Responsibilities

Mirroring PRD Section 7:

| File | Purpose / Responsibility |
|---|---|
| `index.html` | Semantic HTML5 single-page application structure with all 5 mandatory sections and modal dialogs. |
| `css/theme.css` | Modal phosphor terminal tokens (Void Black `#000000`, Ground Iron `#181818`, Lime Pulse `#7fee64`, Phosphor White `#ddffdc`) and Day mode variables. |
| `css/base.css` | Typography scale, CSS resets, responsive grid utilities (mobile-first down to 360px). |
| `css/components.css` | Navigation bar, accent pill buttons, ghost outline buttons, code windows with traffic-light dots, range slider, and modals. |
| `js/main.js` | Application orchestrator: tab switching, form handling, live what-if slider updates, test suite runner. |
| `js/validation.js` | K/M/B shorthand parser (`10k`, `2.5M`, `50M`) and field-level validation rules. |
| `js/scoring.js` | Core rule-based 0–10 scoring engine, 1-line justifications, recommendation verdict, and key takeaways. |
| `js/scenarios.js` | Pre-configured preset workloads: Small OLTP, Analytics Dashboard, Mixed Workload. |
| `js/chart.js` | Chart.js 5-axis Radar and Grouped Bar chart visualizer with dynamic theme color switching. |
| `js/pdfExport.js` | Client-side report generation (vector PDF via jsPDF with embedded chart, plus Word and text fallbacks). |
| `js/theme.js` | Day/Night mode toggling, `aria-pressed` synchronization, and `localStorage` persistence. |

---

## 4. Scoring Logic Assumptions & Rules

All 0–10 dimension scores are derived from standard relational database design principles (PRD Section 4.2):

### 1. Read Performance (0–10)
- **Normalized (3NF):** Starts at 8.0/10, penalized by join complexity (Simple: 8.5, Medium: 6.5, Complex: 4.5). Relational multi-table joins require CPU nested loops and hash join memory.
- **Denormalized:** Starts at 9.5/10 by pre-joining tables.
- **RAM Cache Pressure Threshold:** If row count exceeds 10,000,000 records, the denormalized read score is reduced by $-1.8$ points. Wider rows mean fewer rows fit in the database page buffer pool, triggering random disk I/O and counteracting join savings.

### 2. Write Performance (0–10)
- **Normalized (3NF):** High score (9.2/10 to 9.8/10). Modifying an entity touches only one physical row and one row-level lock.
- **Denormalized:** Heavily penalized by write percentage: $\text{Score} = 7.5 - (\text{Write\%} \times 5.0)$. Updating an entity requires updating redundant copies across thousands of records (write amplification and lock contention).

### 3. Storage Efficiency (0–10)
- **Normalized (3NF):** Scores 9.5/10 with zero duplicated columns.
- **Denormalized:** Penalized by storage cost sensitivity (Low: 7.5, Medium: 6.0, High: 4.0) due to redundant column bloat and wider secondary index trees.

### 4. Data Integrity (0–10)
- **Normalized (3NF):** 10.0/10 guaranteed by foreign key constraints and single-source-of-truth ACID semantics.
- **Denormalized:** Penalized by write frequency and consistency criticality (High criticality drops denorm score to 4–5/10) due to update, deletion, and insertion anomalies.

### 5. Query Complexity Handling (0–10)
- **Normalized (3NF):** 4.0 to 8.0/10 depending on join depth.
- **Denormalized:** 8.5 to 9.5/10 for simple flat `SELECT * FROM table WHERE id = ?` access paths.

### 6. Recommendation Decision Thresholds
- **Prefer Denormalization:** When the weighted score delta $> 0.45$, read traffic $\ge 75\%$, and consistency criticality is low/medium.
- **Prefer Normalization:** When the weighted score delta $< -0.45$, write volume $\ge 40\%$, or consistency criticality is high.
- **Hybrid:** When the score gap is within $\pm 0.45$ (balanced workloads).

---

## 5. Verified Test Scenarios

The application includes an automated test harness in the **Dev/Test Panel** verifying PRD Section 10 test cases:

| Test ID | Test Scenario | Inputs | Expected Output | Actual Output | Status |
|---|---|---|---|---|---|
| **T1** | Small OLTP app | 10K rows, 95% reads, low consistency | Prefer Denormalization | Prefer Denormalization | **PASSED ✓** |
| **T2** | Large dataset, write-heavy | 15M rows, 80% writes, high consistency | Prefer Normalization | Prefer Normalization | **PASSED ✓** |
| **T3** | Mixed workload | 2M rows, 70% reads / 30% writes | Hybrid | Hybrid | **PASSED ✓** |
| **T4** | Validation: Read + Write $\neq$ 100% | Read 60% / Write 50% (sum 110%) | Rejection & inline error | Inline error displayed | **PASSED ✓** |
| **T5** | Validation: Non-numeric / negative rows | `-500` or `abc` | Rejection & inline error | Inline error displayed | **PASSED ✓** |

---

## 6. Known Limitations & Future Work

1. **Empirical Calibration:** Scoring weights (e.g., RAM threshold at 10M rows) are derived from general relational database engineering rules (PostgreSQL / MySQL InnoDB buffer pool behavior) rather than machine-specific hardware benchmarks.
2. **Workload Storage:** Current version is client-side only (PRD Section 2); saving custom scenarios across devices could be added in future versions using an optional cloud API or WebAssembly SQLite engine.

---

## 7. Custom Schema Upload & Backend Analysis Engine

The application includes an automated **Schema AST Parser & Graph Analysis Backend** that allows users to upload their own physical DDL schemas (`.sql`, `.ddl`, or raw SQL text) and analyze them against their custom workload characteristics.

### Running the Backend Engine
```bash
# Start the backend server on http://localhost:4000
npm run server

# Or run in watch mode for development
npm run server:dev

# Run automated backend unit tests
npx tsx server/test/testEngine.ts
```

### Backend Capabilities & Endpoints
- **AST Parsing (`node-sql-parser` with regex fallback):** Extracts tables, columns, primary keys, and foreign keys across PostgreSQL, MySQL, SQLite, and Generic SQL.
- **Topological Analysis:** Calculates maximum join depth across foreign key paths, detects redundant/duplicated attributes across tables, and estimates the current Normal Form (1NF, 2NF, 3NF, or Denormalized).
- **Endpoint `POST /api/v1/schema/analyze`:**
  - Accepts `multipart/form-data` (file upload) or `application/json` (raw SQL text + workload parameters).
  - Returns AST summary (table count, foreign keys, max join depth), redundancy diagnostics, candidate denormalization proposals, and custom 5-dimension trade-off scores.

---

## 8. Security & Standards Compliance
- **Content Security Policy (CSP):** Scoped `<meta>` tag restricting script and style sources to trusted origins.
- **XSS Prevention:** All user-entered text is sanitized through text nodes (`textContent`), never interpolated via raw `innerHTML`.
- **Safe DDL Evaluation:** Pure AST parsing and static topological analysis; no SQL query is ever executed against a database engine.
- **Privacy-Enhanced Video:** YouTube tutorial embedded via `youtube-nocookie.com`.
