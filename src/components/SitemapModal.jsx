import React from 'react';
import { 
  X, 
  Map, 
  Layers, 
  Code2, 
  Terminal, 
  BookOpen, 
  Keyboard, 
  Briefcase, 
  Disc3, 
  Award, 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export default function SitemapModal({ isOpen, onClose, onSelectTab }) {
  if (!isOpen) return null;

  const sitemapSections = [
    {
      title: 'Portal Overview & Mission',
      icon: CheckCircle2,
      items: [
        { label: 'Portal Introduction & Welcome by Kapil', tab: 'intro', desc: 'SarlaYash Mission, official portrait poster, core pillars & founder manifesto' },
        { label: 'WIIFM Stakeholder Value Matrix', tab: 'wiifm', desc: 'Benefits tailored for Learners, Working Professionals, TPOs, HRs & CXOs' }
      ]
    },
    {
      title: '3-Level Core Progression Roadmap',
      icon: Layers,
      items: [
        { label: 'Level 1: Foundation & Diagnostic Mindset', tab: 'levels', desc: 'Syntax invariants, code reading, foundational MCQs' },
        { label: 'Level 2: Systems, Concurrency & AI Engineering', tab: 'levels', desc: 'Race conditions, memory leaks, Claude Code & Cursor tool deadlocks' },
        { label: 'Level 3: Executive Mastery & Placement Defense', tab: 'assessment', desc: '3-Hour strict proctored assessment & Kapil signed certification' }
      ]
    },
    {
      title: 'Diagnostic MCQ Arenas (14+ Domains)',
      icon: Code2,
      items: [
        { label: 'HTML & Web Standards (Easy, Med, Hard)', tab: 'mcq', desc: 'Void tags, DOM injection, async/defer races, Shadow DOM' },
        { label: 'C Programming & Pointers', tab: 'mcq', desc: 'Dangling stack pointers, format string CVEs, malloc/free leaks' },
        { label: 'C++ Systems & RAII', tab: 'mcq', desc: 'Iterator invalidation, shared_ptr cycles, use-after-move' },
        { label: 'Java Enterprise & Spring', tab: 'mcq', desc: 'ConcurrentModification, ThreadLocal leaks, autoboxing NPE' },
        { label: 'Python 3 Runtimes', tab: 'mcq', desc: 'Mutable defaults, late-binding lambdas, async GeneratorExit' },
        { label: 'JavaScript & TypeScript', tab: 'mcq', desc: 'Array sort lexicographical trap, lost this, microtask starvation' },
        { label: 'SQL & Relational DBs', tab: 'mcq', desc: 'Three-valued logic NULLs, unindexed B-Trees, phantom reads' },
        { label: 'Microsoft Excel & Formulas', tab: 'mcq', desc: 'VLOOKUP range lookup, circular references, #SPILL! errors' },
        { label: 'Power BI & DAX Models', tab: 'mcq', desc: 'Row vs filter context, CALCULATE context transition, circular filters' },
        { label: 'GitHub Copilot & AI Code', tab: 'mcq', desc: 'Hallucinated APIs, insecure cryptographic defaults, context drift' },
        { label: 'Prompt Engineering for Code', tab: 'mcq', desc: 'Non-deterministic JSON, indirect prompt injection, tool schema types' },
        { label: 'Test Commands & QA Automation', tab: 'mcq', desc: 'Unawaited Jest promises, mock pollution, Playwright flaky locators' },
        { label: 'Shell & Bash Automation', tab: 'mcq', desc: 'Word splitting without quotes, subshell variable loss, pipefail' },
        { label: 'PowerShell Automation', tab: 'mcq', desc: 'Native executable exit codes, pipeline unwrapping, $using: thread safety' }
      ]
    },
    {
      title: 'Hands-On Practice & Tools',
      icon: Terminal,
      items: [
        { label: 'Practice Arena (25+ Code Defect Scenarios)', tab: 'practice', desc: 'Non-repeated bugs with 60%+ Hard complexity' },
        { label: 'Interactive IDE Workspace', tab: 'ide', desc: 'Line numbers, code editor, hidden test runner, negative marking' },
        { label: 'Architectural Patterns Library', tab: 'patterns', desc: '10 systematic defect archetypes with production outage post-mortems' },
        { label: 'IDE & Low-Level Shortcuts', tab: 'shortcuts', desc: 'Cursor, VS Code, Chrome DevTools, JetBrains, GDB, Git' }
      ]
    },
    {
      title: 'Career Placement & Credentials',
      icon: Award,
      items: [
        { label: 'Fortune 500 Placement Arena', tab: 'interviews', desc: 'Staff SWE debugging rounds: Google, Meta, Stripe, Amazon' },
        { label: 'Fortune 500 Bonus Wheel', tab: 'wheel', desc: 'Daily spins for bonus IQ points, streak shields, free hint tokens' },
        { label: 'Learner Verified Badges', tab: 'badges', desc: 'Authentic badges signed by Kapil (No fake personas)' },
        { label: '3-Hour Proctored Final Assessment', tab: 'assessment', desc: '180:00 timer, per-question clock, anti-screenshot & Alt+Tab auto-close' },
        { label: 'Executive Certificate Generator', tab: 'certificate', desc: 'Printable & PDF export, exclusive Kapil signature, verification hash' },
        { label: 'WIIFM Stakeholder Value Hub', tab: 'wiifm', desc: 'Tailored ROI for learners, professionals, TPOs, recruiters & CXOs' }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[88vh] border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Map size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Enterprise Platform Sitemap
              </h3>
              <p className="text-[11px] text-slate-500">
                DEBUGGING UNIVERSE With Kapil &bull; Powered By SarlaYash Mission
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sitemap Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {sitemapSections.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <div key={idx} className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-1.5">
                  <Icon size={14} className="text-slate-900" />
                  <span>{sec.title}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sec.items.map((item, itemIdx) => (
                    <button
                      key={itemIdx}
                      onClick={() => {
                        onClose();
                        onSelectTab(item.tab);
                      }}
                      className="p-3 rounded-xl border border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition-all text-left flex items-start justify-between group"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-slate-950 flex items-center gap-1.5">
                          <span>{item.label}</span>
                          <ExternalLink size={11} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500">
          All architectural routes are verified and protected under SarlaYash Mission Standards &bull; Sole Signatory: Kapil
        </div>
      </div>
    </div>
  );
}
