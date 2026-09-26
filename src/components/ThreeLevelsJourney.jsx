import React from 'react';
import { 
  Layers, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  Award,
  Terminal,
  Cpu,
  BrainCircuit
} from 'lucide-react';
import { getSolvedChallenges, getPatternsStudied, getInterviewsCompleted, getFinalAssessmentStatus } from '../utils/storage';

export default function ThreeLevelsJourney({ onSelectLevel, activeLevel = 1, onNavigateTab }) {
  const solved = getSolvedChallenges();
  const patterns = getPatternsStudied();
  const interviews = getInterviewsCompleted();
  const assessment = getFinalAssessmentStatus();

  // Level completion criteria
  const isLevel1Complete = solved.length >= 2 && patterns.length >= 1;
  const isLevel2Complete = isLevel1Complete && solved.length >= 4 && interviews.length >= 1;
  const isLevel3Complete = isLevel2Complete && assessment.status === 'COMPLETED' && assessment.passed;

  const currentLevel = isLevel2Complete ? 3 : (isLevel1Complete ? 2 : 1);

  const levels = [
    {
      level: 1,
      title: 'Foundation & Diagnostic Mindset',
      tagline: 'Syntax Invariants, Code Reading & Defect Elimination',
      icon: Terminal,
      color: 'from-blue-600 to-indigo-700',
      badge: 'Core Foundation',
      status: isLevel1Complete ? 'COMPLETED' : 'IN_PROGRESS',
      requirements: [
        { label: 'Solve at least 2 practice challenges', current: solved.length, target: 2, met: solved.length >= 2 },
        { label: 'Master 1 software debugging pattern', current: patterns.length, target: 1, met: patterns.length >= 1 },
        { label: 'Complete Diagnostic MCQs (HTML, C, Python, JS)', current: solved.length > 0 ? 1 : 0, target: 1, met: solved.length > 0 }
      ],
      topics: ['Off-by-One Bounds', 'Null Unboxing', 'Default Mutables', 'Lexicographical Sorting'],
      actionLabel: 'Enter Level 1 Arena',
      actionTab: 'practice'
    },
    {
      level: 2,
      title: 'Systems, Concurrency & AI Engineering',
      tagline: 'Multi-threading, Memory Boundaries & Agentic AI Tools',
      icon: BrainCircuit,
      color: 'from-purple-600 to-slate-900',
      badge: 'Advanced Systems',
      status: isLevel2Complete ? 'COMPLETED' : (isLevel1Complete ? 'IN_PROGRESS' : 'LOCKED'),
      requirements: [
        { label: 'Solve 4+ challenges (including Hard concurrency & AI tools)', current: solved.length, target: 4, met: solved.length >= 4 },
        { label: 'Complete 1 Fortune 500 placement interview round', current: interviews.length, target: 1, met: interviews.length >= 1 },
        { label: 'Audit Claude Code / Cursor agentic hallucination bugs', current: solved.some(id => id.includes('ai_')) ? 1 : 0, target: 1, met: solved.some(id => id.includes('ai_')) }
      ],
      topics: ['Asyncio Race Conditions', 'Go Channel Leaks', 'Rust Borrow Aliasing', 'Cursor / Claude Tooling Deadlocks'],
      actionLabel: isLevel1Complete ? 'Enter Level 2 Arena' : 'Locked (Complete Level 1)',
      actionTab: 'practice'
    },
    {
      level: 3,
      title: 'Fortune 500 Executive Mastery & Defense',
      tagline: '3-Hour Proctored Assessment & Exclusive Kapil Certification',
      icon: Award,
      color: 'from-amber-600 to-slate-950',
      badge: 'Pinnacle Certification',
      status: isLevel3Complete ? 'COMPLETED' : (isLevel2Complete ? 'IN_PROGRESS' : 'LOCKED'),
      requirements: [
        { label: 'Unlock 3-Hour Strict Proctored Assessment', current: isLevel2Complete ? 1 : 0, target: 1, met: isLevel2Complete },
        { label: 'Pass with 60%+ Hard questions with zero anti-cheat violations', current: assessment.passed ? 1 : 0, target: 1, met: assessment.passed },
        { label: 'Receive verified credential signed by Kapil', current: assessment.certificateId ? 1 : 0, target: 1, met: !!assessment.certificateId }
      ],
      topics: ['3-Hour Proctored Lockdown', 'Anti-Screenshot & Alt-Tab Defense', 'Negative Marking Strict Evaluation', 'Kapil Official Seal'],
      actionLabel: isLevel2Complete ? 'Launch 3-Hour Final Assessment' : 'Locked (Complete Level 2)',
      actionTab: 'assessment'
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-xs font-semibold mb-1.5">
            <Layers size={13} className="text-slate-800" />
            <span>Strict Gated Learning Progression</span>
          </div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            The 3-Level Diagnostic Journey
          </h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Learners must fulfill the required criteria of each tier before advancing to high-stakes executive evaluations.
          </p>
        </div>

        {/* Current Active Level Indicator */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-slate-900 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
            L{currentLevel}
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Candidate Progression
            </div>
            <div className="text-xs font-bold text-slate-900">
              Level {currentLevel}: {levels[currentLevel - 1].badge}
            </div>
          </div>
        </div>
      </div>

      {/* 3 Level Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {levels.map((lvl) => {
          const Icon = lvl.icon;
          const isCurrent = currentLevel === lvl.level;
          const isDone = lvl.status === 'COMPLETED';
          const isLocked = lvl.status === 'LOCKED';

          return (
            <div
              key={lvl.level}
              className={`rounded-xl border p-5 flex flex-col justify-between transition-all relative ${
                isCurrent 
                  ? 'border-slate-900 ring-2 ring-slate-900/10 bg-white shadow-md' 
                  : (isDone 
                      ? 'border-emerald-200 bg-emerald-50/20' 
                      : 'border-slate-200 bg-slate-50/70 opacity-70')
              }`}
            >
              <div>
                {/* Level Tag & Status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-extrabold tracking-wider uppercase text-slate-500">
                    LEVEL 0{lvl.level}
                  </span>

                  {isDone ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                      <CheckCircle2 size={12} />
                      Completed
                    </span>
                  ) : isLocked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-200/80 px-2 py-0.5 rounded-full">
                      <Lock size={11} />
                      Locked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      <Sparkles size={11} />
                      Active Tier
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 mb-1">
                  {lvl.title}
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                  {lvl.tagline}
                </p>

                {/* Requirements Checklist */}
                <div className="space-y-2 mb-4 pt-3 border-t border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Milestone Criteria
                  </div>
                  {lvl.requirements.map((req, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px]">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        req.met ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {req.met ? '✓' : '•'}
                      </span>
                      <span className={req.met ? 'text-slate-800 font-medium' : 'text-slate-500'}>
                        {req.label} ({req.current}/{req.target})
                      </span>
                    </div>
                  ))}
                </div>

                {/* Topics Pills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {lvl.topics.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => !isLocked && onNavigateTab(lvl.actionTab)}
                disabled={isLocked}
                className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isCurrent
                    ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                    : isDone
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>{lvl.actionLabel}</span>
                {!isLocked && <ArrowRight size={13} />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
