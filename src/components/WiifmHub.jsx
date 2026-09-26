import React, { useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  Eye, 
  Briefcase, 
  Building2, 
  UserCheck, 
  Crown, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';

const STAKEHOLDERS = [
  {
    id: 'learners',
    title: 'Learners & Engineering Students',
    shortLabel: 'Learners',
    icon: GraduationCap,
    tagline: 'From Syntax Confusion to Production-Grade Debugging Mastery',
    color: 'from-blue-600 to-indigo-700',
    summary: 'Traditional universities teach syntax; companies hire developers who can fix mysterious bugs under pressure.',
    benefits: [
      'Master Edge-Case Intuition: Learn how off-by-one errors, null unboxing, and async locks behave in real production environments.',
      'Crack Tough Placement Interviews: Prepare for Staff & Senior SWE debugging rounds (Google, Meta, Stripe) with real scenarios and rubrics.',
      'Authentic Verifiable Credential: Earn an executive certificate signed exclusively by Kapil with a cryptographic verification hash—no fake personas.',
      'Practice Without Fear of Failure: Progressive hints, "Tip for Wrong Answers", and solution reveal aids guide you step-by-step in Practice Mode.'
    ],
    metrics: ['+85% Faster Bug Resolution', 'Top 1% Interview Edge', '100% Plagiarism-Free Credential']
  },
  {
    id: 'viewers',
    title: 'Viewers & Open-Source Observers',
    shortLabel: 'Viewers',
    icon: Eye,
    tagline: 'Zero-Setup Interactive Exploration of Complex System Bugs',
    color: 'from-emerald-600 to-teal-700',
    summary: 'Experience production-level code architectures and agentic AI tooling directly in your browser without installing compilers or docker containers.',
    benefits: [
      'Instant In-Browser Code Execution: Inspect and run Go, Rust, C++, Python, and SQL snippets with zero local configuration.',
      'Engaging Interactive Visualizations: Experience the Fortune 500 Bonus Wheel, confetti celebrations, and live compiler terminal outputs.',
      'Transparent Open Knowledge: Read deep architectural breakdowns of famous outages (Heartbleed, Northeast blackout race condition, Cloud Spanner tail latencies).'
    ],
    metrics: ['0 Install Friction', '14+ Supported Languages', 'Real Outage Case Studies']
  },
  {
    id: 'professionals',
    title: 'Working Professionals (SWE, SRE, Tech Leads)',
    shortLabel: 'Working Professionals',
    icon: Briefcase,
    tagline: 'Kill On-Call Nightmares, Goroutine Leaks & AI Code Hallucinations',
    color: 'from-purple-600 to-slate-900',
    summary: 'Mid-level and Senior Engineers spend up to 50% of their engineering week debugging distributed concurrency, memory leaks, and sloppy AI-generated PRs.',
    benefits: [
      'Audit AI Code Generation: Detect hallucinated imports, ghost dependencies, and ReDoS regexes introduced by Cursor, Copilot, and Claude Code.',
      'Solve Distributed Concurrency Puzzles: Diagnose Java Memory Model cache coherence, Go unbuffered channel leaks, and Postgres row lock deadlocks.',
      'Accelerate MTTR (Mean Time to Resolution): Develop systematic binary-search debugging habits rather than guessing with print statements.',
      'Benchmark Against Staff Criteria: Measure your diagnostic speed against Staff SRE standards from Stripe, Amazon, and Google.'
    ],
    metrics: ['-60% Production Bug Escapes', 'Master Agentic Tool Auditing', 'Zero Heisenbug Panic']
  },
  {
    id: 'tpos',
    title: 'Training & Placement Officers (TPOs)',
    shortLabel: 'TPOs & Academies',
    icon: Building2,
    tagline: 'Industry-Ready Talent Benchmarking with Zero Proctoring Fraud',
    color: 'from-amber-600 to-orange-700',
    summary: 'Transform campus hiring by providing candidates who write clean code and can debug broken systems from Day 1.',
    benefits: [
      'Anti-Cheat Proctored Testing: 3-hour strict evaluation with screenshot detection, Alt+Tab lockdown, and non-repeated questions eliminates exam fraud.',
      'Pre-Vetted Industry Alignment: Curriculum strictly tracks Fortune 500 entry-level to SDE-II expectations.',
      'Transparent Competency Telemetry: Measure actual candidate coding and bug-finding speed instead of memorized algorithmic solutions.',
      'Elevated Placement Packages: Students with proven debugging resilience stand out immediately during technical rounds.'
    ],
    metrics: ['100% Cheat-Proof Testing', '3-Level Structured Progression', 'Higher Tier-1 Placement Rates']
  },
  {
    id: 'recruiters',
    title: 'HR & Technical Recruiters',
    shortLabel: 'HR & Recruiters',
    icon: UserCheck,
    tagline: 'Hire True Builders, Not Chatbot Prompt Copiers',
    color: 'from-rose-600 to-pink-800',
    summary: 'In an era where every resume looks identical due to AI-generated resumes and boilerplate GitHub repos, true debugging skill is the ultimate signal.',
    benefits: [
      'Zero-Plagiarism Verification: Candidates must solve 60%+ Hard bugs live under browser lockdown with no copy-paste or tab-switching permitted.',
      'Verified Single Signatory: Every certificate is signed exclusively by Kapil with a public verification registry—no fake names or unverified institutions.',
      'Cut Interview Screening Cycles: Candidates holding the Executive Debugging Credential have already cleared rigorous multi-language systems evaluations.',
      'Direct Fit for High-Pressure Teams: Candidates proven to remain calm when code breaks and systems fail.'
    ],
    metrics: ['70% Faster Screen-to-Offer', 'Zero Resume Fraud', 'Verified Problem Solvers']
  },
  {
    id: 'cxos',
    title: 'CXO Levels (CTOs, VPs of Eng, Directors)',
    shortLabel: 'CXO Levels',
    icon: Crown,
    tagline: 'Institutional Code Reliability, Slashing MTTR & Safe AI Scaling',
    color: 'from-slate-900 to-black',
    summary: 'Executive leadership cares about two engineering metrics: shipping velocity and system uptime. Sloppy code and unverified AI agents threaten both.',
    benefits: [
      'Institutional Software Reliability Culture: Elevate your entire organization from "feature writers" to "reliability architects".',
      'Safe AI Agent Adoption: Train teams to detect context drift, tool calling parameter mismatches, and schema deadlocks when deploying Cursor / Claude Code.',
      'Protecting SLA & Brand Reputation: Prevent costly financial outages (like SQL inventory deadlocks or IEEE 754 float precision ledger corruption).',
      'Consistent Engineering Standards: Standardized diagnostic methodology across backend, frontend, systems, and QA pipelines.'
    ],
    metrics: ['Sub-15m P99 Incident MTTR', 'Safe Enterprise AI Adoption', 'High Enterprise SLA Uptime']
  }
];

export default function WiifmHub({ onSelectTab }) {
  const [activeStakeholder, setActiveStakeholder] = useState(STAKEHOLDERS[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-xs font-semibold mb-2">
          <Sparkles size={13} className="text-amber-500" />
          <span>WIIFM Matrix: What's In It For Me?</span>
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Value Proposition Across All Enterprise Stakeholders
        </h2>
        <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
          DEBUGGING UNIVERSE With Kapil (Powered By SarlaYash Mission) solves distinct, high-impact challenges for every role in the software engineering ecosystem—from university students to Chief Technology Officers.
        </p>
      </div>

      {/* Stakeholder Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {STAKEHOLDERS.map((s) => {
          const Icon = s.icon;
          const isSelected = activeStakeholder.id === s.id;

          return (
            <button
              key={s.id}
              onClick={() => setActiveStakeholder(s)}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md font-bold'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
              }`}
            >
              <Icon size={18} className={isSelected ? 'text-amber-400' : 'text-slate-600'} />
              <span className="text-[11px] leading-tight">{s.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Active Stakeholder Deep Dive */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Title & Tagline */}
        <div className="border-b border-slate-100 pb-5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Stakeholder Value Profile
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {activeStakeholder.title}
          </h3>
          <div className="text-xs font-semibold text-slate-700 mt-0.5">
            {activeStakeholder.tagline}
          </div>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-3xl">
            {activeStakeholder.summary}
          </p>
        </div>

        {/* Core Benefits Grid */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Key Strategic Benefits & ROI
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeStakeholder.benefits.map((benefit, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5 shadow-2xs">
                  {idx + 1}
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quantified Impact Metrics */}
        <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-wrap items-center justify-around gap-4 text-center">
          {activeStakeholder.metrics.map((m, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-400" />
              <span className="text-xs font-bold tracking-wide">{m}</span>
            </div>
          ))}
        </div>

        {/* Quick Call to Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            Backed by SarlaYash Mission Quality Standards &bull; Sole Signatory: <strong>Kapil</strong>
          </div>

          <button
            onClick={() => onSelectTab('practice')}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>Explore Practice Arena</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
