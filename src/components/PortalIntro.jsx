import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Terminal, 
  Code2, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  Play, 
  Flame, 
  BookOpen, 
  Users, 
  Lock, 
  Compass, 
  Layers, 
  Cpu,
  Zap,
  Globe,
  Bot,
  Database,
  Briefcase
} from 'lucide-react';
import kapilPortrait from '../assets/kapil-portrait.jpg';

export default function PortalIntro({ onNavigateTab, onOpenAuth, onOpenTour }) {
  const portalFeatures = [
    {
      icon: Code2,
      title: '14+ Enterprise Language Domains',
      description: 'HTML5, C, C++, Java, Python 3, JavaScript/TypeScript, SQL, Excel, Power BI, GitHub Copilot, Prompt Engineering, Test Suites, Shell & PowerShell.',
      badge: 'Comprehensive'
    },
    {
      icon: Terminal,
      title: 'Interactive Embedded IDE Engine',
      description: 'Hands-on live syntax editor with production-grade buggy snippets, hidden automated test suites, negative marking, and architectural remediation tips.',
      badge: 'Real-Time'
    },
    {
      icon: Layers,
      title: '3-Level Progression Journey',
      description: 'Gated structured progression: Level 1 (Logic & Syntax), Level 2 (Concurrency & Distributed Systems), Level 3 (AI Hallucinations & Defensive Hardening).',
      badge: 'Gated Path'
    },
    {
      icon: ShieldCheck,
      title: 'Fool-Proof Shuffled Diagnostic MCQs',
      description: '420+ authentic code-debugging challenges with dynamic Fisher-Yates answer option shuffling (A/B/C/D randomized) and randomized question sequences.',
      badge: 'Anti-Cheat'
    },
    {
      icon: Lock,
      title: '3-Hour Proctored Final Assessment',
      description: 'Rigorous exam with 15-min per-question timer, 180-min continuous clock, fullscreen lock, alt-tab/screenshot disqualification, and non-repeating questions.',
      badge: 'Fortune 500'
    },
    {
      icon: Award,
      title: 'Official Executive Certification',
      description: 'Verifiable PDF credentials signed exclusively by Kapil with Google-authenticated identity. No fake numbers, no fake people, zero shortcuts.',
      badge: 'Sole Signatory'
    }
  ];

  const stakeholderPersonas = [
    {
      role: 'Learners & Students',
      benefit: 'Bridge the college-to-industry divide. Develop intuitive defect-spotting reflexes demanded by top engineering firms.'
    },
    {
      role: 'Working Professionals',
      benefit: 'Master concurrency race conditions, memory leaks, and generative AI code hallucination auditing (Cursor, Copilot, Claude Code).'
    },
    {
      role: 'TPOs & Placement Cells',
      benefit: 'Benchmark candidate pools with 100% cheat-proof, proctored diagnostics and objective quantitative scoring.'
    },
    {
      role: 'HR & Tech Recruiters',
      benefit: 'Filter out tutorial-memorizers. Recruit engineers who can solve production outages under strict negative marking.'
    },
    {
      role: 'CTOs & Engineering Leaders',
      benefit: 'Radically reduce Mean Time to Resolution (MTTR) across your engineering org with systematic debugging patterns.'
    }
  ];

  return (
    <div className="space-y-10 pb-12 animate-in fade-in duration-300">
      {/* Hero Section: Official Portrait & Executive Intro */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-slate-100 to-transparent rounded-full -mr-32 -mt-32 pointer-events-none opacity-60" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          {/* Left Column: Official Poster Portrait of Kapil */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative group max-w-xs sm:max-w-sm w-full">
              {/* Subtle ambient border */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200 blur-xs opacity-75 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative rounded-2xl overflow-hidden border border-slate-300 bg-white shadow-xl">
                <img 
                  src={kapilPortrait} 
                  alt="Kapil - Founder & Chief Architect, SarlaYash Mission (Debugging Universe With Kapil)" 
                  className="w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-500"
                />
              </div>

              {/* Authoritative Badge below portrait */}
              <div className="mt-3.5 flex items-center justify-between px-3 py-2 bg-slate-900 text-white rounded-xl shadow-xs text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-[11px] tracking-wide">Kapil</span>
                </div>
                <span className="text-[10px] text-slate-300 font-medium">
                  Founder & Chief Architect &bull; SarlaYash Mission
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Portal Mission & Welcome */}
          <div className="lg:col-span-7 space-y-5">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold tracking-wide">
                <Sparkles size={12} className="text-amber-400" />
                <span>OFFICIAL PORTAL</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                <ShieldCheck size={12} className="text-emerald-600" />
                <span>Powered By SarlaYash Mission</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-medium">
                <span>&copy; 2026 All Rights Reserved</span>
              </span>
            </div>

            {/* Portal Headline */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                DEBUGGING UNIVERSE <br />
                <span className="text-slate-800 font-extrabold text-xl sm:text-2xl lg:text-3xl">
                  With Kapil
                </span>
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-widest mt-1">
                The Definitive Enterprise Diagnostic & Code Repair Ecosystem
              </p>
            </div>

            {/* Founder's Manifesto Quote */}
            <div className="p-4 rounded-2xl bg-slate-50 border-l-4 border-slate-900 border-y border-r border-slate-200 text-slate-700 text-xs sm:text-[13px] leading-relaxed italic">
              &ldquo;Writing fresh code is barely 20% of an engineer's lifetime career. Diagnosing production deadlocks, distributed tail latency, memory leaks, security vulnerabilities, and generative AI hallucinations in high-stakes environments is the true hallmark of an elite software craftsman. Debugging Universe was created under the <strong>SarlaYash Mission</strong> to eradicate superficial memorization and forge genuine, uncheatable debugging intuition across all languages and all modern AI portals.&rdquo;
              <div className="mt-2 text-right not-italic font-bold text-slate-900 text-xs">
                &mdash; Kapil, <span className="font-normal text-slate-500">Chief Architect & Sole Signatory</span>
              </div>
            </div>

            {/* Highlights Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
              <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-center">
                <div className="text-lg font-black text-slate-900">14+</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase">Languages & Tools</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-center">
                <div className="text-lg font-black text-emerald-600">420+</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase">Shuffled MCQs</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-center">
                <div className="text-lg font-black text-slate-900">180m</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase">Proctored Clock</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-center">
                <div className="text-lg font-black text-amber-600">100%</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase">Genuine Credentials</div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigateTab('levels')}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-md flex items-center gap-2 group"
              >
                <span>Start 3-Level Journey</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigateTab('mcq')}
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-2"
              >
                <Code2 size={14} />
                <span>MCQ Diagnostic Arena (14 Domains)</span>
              </button>

              <button
                onClick={onOpenTour}
                className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors flex items-center gap-1.5 border border-slate-200"
              >
                <Compass size={14} className="text-blue-600" />
                <span>Take Demo Tour</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Six Pillars of the Debugging Universe */}
      <div className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
            System Architecture
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Six Pillars of Engineering Excellence
          </h2>
          <p className="text-xs text-slate-500">
            Engineered from ground up with zero tolerance for fake metrics, memorized answers, or unverified claims.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portalFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx} 
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all space-y-2.5 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-slate-900 group-hover:text-white text-slate-800 flex items-center justify-center transition-colors">
                    <Icon size={18} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* WIIFM Section: Value Proposition Across All Roles */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-xs font-semibold mb-1">
              <Users size={13} className="text-slate-900" />
              <span>WIIFM &bull; What's In It For You</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Value Proposition for Every Stakeholder
            </h2>
          </div>

          <button
            onClick={() => onNavigateTab('wiifm')}
            className="text-xs font-bold text-slate-900 hover:text-slate-700 flex items-center gap-1 self-start md:self-auto"
          >
            <span>Explore Full Stakeholder Matrix</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stakeholderPersonas.map((st, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                {st.role}
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {st.benefit}
              </p>
            </div>
          ))}
          <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                Verified Placement Standard
              </span>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Certificates and badges are earned strictly through unassisted proctored performance.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('certificate')}
              className="mt-3 text-xs text-amber-300 font-bold hover:underline flex items-center gap-1"
            >
              <span>View Certificate Spec</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* SarlaYash Mission & Kapil's Sole Signatory Commitment */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-black text-sm">
              SY
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">
                SarlaYash Mission Engineering Standard
              </h3>
              <p className="text-xs text-slate-400">
                Founded & Guided by Kapil &bull; Authentic Software Craftsmanship
              </p>
            </div>
          </div>
          <div className="text-xs text-amber-400 font-bold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 self-start sm:self-auto">
            100% Zero-Plagiarism Guarantee
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
          At <strong>DEBUGGING UNIVERSE With Kapil</strong>, every diagnostic challenge, question shuffle, proctored timer, negative penalty, and hidden test case is calibrated to mirror Fortune 500 engineering standards. No candidate receives a certificate without demonstrating verifiable code remediation. All credentials carry a permanent cryptographic verification ID and are signed personally and exclusively by <strong>Kapil</strong> under the <strong>SarlaYash Mission</strong>.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
          <button
            onClick={() => onNavigateTab('practice')}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold transition-all"
          >
            Launch Practice Arena
          </button>
          <button
            onClick={() => onNavigateTab('interviews')}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all border border-slate-700"
          >
            Fortune 500 Interview Rounds
          </button>
        </div>
      </div>
    </div>
  );
}
