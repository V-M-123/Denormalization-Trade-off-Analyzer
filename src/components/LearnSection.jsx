import React from 'react';
import { 
  BookOpen, 
  Video, 
  BookMarked, 
  ExternalLink, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Database,
  ArrowRight
} from 'lucide-react';

export default function LearnSection() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-600 to-indigo-700 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mastering Database Architecture</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">
            Database Denormalization & Trade-off Analysis
          </h1>
          <p className="text-sm text-sky-100 leading-relaxed">
            A comprehensive conceptual guide exploring relational normalization (1NF through BCNF), intentional redundancy, read optimization, write amplification penalties, and data consistency models.
          </p>
        </div>
      </div>

      {/* 1. CONCEPT EXPLANATION */}
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              1. Concept Explanation: Normalization vs. Denormalization
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Understanding the theoretical principles and engineering compromises
            </p>
          </div>
        </div>

        {/* Concept Content */}
        <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 space-y-4 leading-relaxed">
          
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              What is Database Normalization?
            </h3>
            <p>
              Database normalization is a systematic design technique pioneered by E.F. Codd to organize relational schemas into normal forms (1NF, 2NF, 3NF, BCNF). Its primary objective is to <strong>eliminate data redundancy</strong> and prevent data anomalies (Update, Insertion, and Deletion anomalies) by ensuring every non-key attribute depends strictly on the primary key, the whole key, and nothing but the key.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-sky-600 dark:text-sky-400 text-sm mb-2 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Strengths of Normalization (3NF / BCNF)</span>
              </h4>
              <ul className="text-xs space-y-1.5 list-disc pl-4 text-slate-600 dark:text-slate-300">
                <li><strong>Single Source of Truth:</strong> Zero data duplication across tables.</li>
                <li><strong>Ultra-Fast Single-Row Writes:</strong> Modifying an entity touches only one physical page and one row lock.</li>
                <li><strong>Strict Data Integrity:</strong> Foreign key constraints guarantee ACID consistency.</li>
                <li><strong>Minimal Storage Footprint:</strong> Eliminates duplicate column storage and wide index leaf splits.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-rose-600 dark:text-rose-400 text-sm mb-2 flex items-center space-x-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>The Normalization Bottleneck (The JOIN Tax)</span>
              </h4>
              <ul className="text-xs space-y-1.5 list-disc pl-4 text-slate-600 dark:text-slate-300">
                <li><strong>Multi-Table JOIN Overhead:</strong> Reconstructing entities requires expensive Hash, Merge, or Nested-Loop joins.</li>
                <li><strong>Buffer Cache Fragmentation:</strong> Querying 4 normalized tables forces the engine to touch multiple disparate memory pages.</li>
                <li><strong>CPU & Temporary Worktable Spills:</strong> Sorting and joining large datasets exhausts RAM and spills to disk tempdb.</li>
                <li><strong>Read Latency Scaling:</strong> High QPS read workloads become bound by join computation times.</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              What is Denormalization?
            </h3>
            <p>
              Denormalization is the deliberate, strategic introduction of controlled data redundancy or pre-computed structures into a relational schema after normalization has already been performed. It is <strong>not</strong> a failure to normalize; it is an architectural performance optimization technique applied specifically to eliminate costly `JOIN` operations and accelerate read queries.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Common Denormalization Strategies:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900">
                <strong className="text-sky-700 dark:text-sky-300">1. Redundant Column Duplication:</strong> Storing frequently queried parent columns (e.g. <code>customer_name</code>) directly in the child table (<code>orders</code>) to bypass the parent join.
              </div>
              <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900">
                <strong className="text-sky-700 dark:text-sky-300">2. Pre-computed Aggregate Fields:</strong> Maintaining cached counters or summaries (e.g. <code>total_order_amount</code>, <code>like_count</code>) updated via triggers or application code.
              </div>
              <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900">
                <strong className="text-sky-700 dark:text-sky-300">3. Materialized Views:</strong> Database-managed physical caches that store the result of an expensive join query, refreshed periodically or incrementally.
              </div>
              <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900">
                <strong className="text-sky-700 dark:text-sky-300">4. Embedded Document / JSON Attributes:</strong> Storing dynamic child entities directly as nested JSON/BSON columns inside the parent table row.
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. ANIMATED EDUCATIONAL VIDEO */}
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              2. Animated Educational Video: Normalization vs. Denormalization
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Visual walkthrough explaining relational normal forms, anomalies, and why systems denormalize
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-300">
          Watch this animated tutorial to understand how tables are decomposed into 3NF and the exact moment engineers choose to denormalize for scale:
        </div>

        {/* Responsive Video Embed Container */}
        <div className="relative w-full rounded-xl overflow-hidden bg-slate-950 shadow-md border border-slate-200 dark:border-slate-800 aspect-video">
          <iframe 
            className="w-full h-full"
            src="https://www.youtube-nocookie.com/embed/GFQaEYEc8_8?rel=0" 
            title="Database Normalization vs Denormalization Animated Guide"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowFullScreen
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
          <strong className="text-slate-900 dark:text-white block mb-1">Key Video Takeaways:</strong>
          <ul className="list-disc pl-4 space-y-1">
            <li>Normalization decomposes tables to isolate dependencies; denormalization recombines them to avoid join penalties.</li>
            <li>In write-heavy systems, denormalization causes severe write amplification and lock contention.</li>
            <li>In read-heavy OLAP and analytics systems, denormalization is often the default choice (e.g. Star and Snowflake schemas).</li>
          </ul>
        </div>
      </section>

      {/* 3. REFERENCES & ACADEMIC BIBLIOGRAPHY */}
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <BookMarked className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              3. Academic & Technical References
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Formal textbooks, research papers, and educational resources consulted in developing this analyzer
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          {/* Books */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <h3 className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-[11px]">
              📚 Authoritative Textbooks
            </h3>
            <div className="space-y-2.5 text-slate-700 dark:text-slate-300">
              <div>
                <strong className="text-slate-900 dark:text-white">Database System Concepts (7th Edition)</strong>
                <p className="text-[11px] text-slate-500">Abraham Silberschatz, Henry F. Korth, S. Sudarshan — McGraw-Hill Education (Chapters on Relational Design & Query Optimization).</p>
              </div>
              <div>
                <strong className="text-slate-900 dark:text-white">Designing Data-Intensive Applications</strong>
                <p className="text-[11px] text-slate-500">Martin Kleppmann — O'Reilly Media (Part 1: Data Models, Query Languages, and Normalization vs. Denormalization).</p>
              </div>
              <div>
                <strong className="text-slate-900 dark:text-white">Database Systems: The Complete Book (2nd Edition)</strong>
                <p className="text-[11px] text-slate-500">Hector Garcia-Molina, Jeffrey D. Ullman, Jennifer Widom — Pearson Prentice Hall.</p>
              </div>
            </div>
          </div>

          {/* Research Papers & Academic Resources */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <h3 className="font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider text-[11px]">
              🔬 Research Papers & Lecture Series
            </h3>
            <div className="space-y-2.5 text-slate-700 dark:text-slate-300">
              <div>
                <strong className="text-slate-900 dark:text-white">Data Cube: A Relational Aggregation Operator</strong>
                <p className="text-[11px] text-slate-500">Jim Gray, Surajit Chaudhuri, Adam Bosworth et al. — Data Mining and Knowledge Discovery, 1997.</p>
              </div>
              <div>
                <strong className="text-slate-900 dark:text-white">CMU 15-445/645: Database Systems (Prof. Andy Pavlo)</strong>
                <p className="text-[11px] text-slate-500">Carnegie Mellon University Database Group — Relational Storage Architecture & Buffer Pool Management.</p>
              </div>
              <div>
                <strong className="text-slate-900 dark:text-white">MIT 6.830 / 6.814: Database Systems</strong>
                <p className="text-[11px] text-slate-500">MIT OpenCourseWare — Query Planning and Storage Engine Internals.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
