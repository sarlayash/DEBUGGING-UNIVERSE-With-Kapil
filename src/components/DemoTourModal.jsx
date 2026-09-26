import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Terminal, 
  ShieldAlert, 
  Award, 
  Disc3, 
  CheckCircle2,
  Compass,
  Layers,
  Code2
} from 'lucide-react';

const TOUR_STEPS = [
  {
    step: 1,
    title: 'Welcome to DEBUGGING UNIVERSE With Kapil',
    subtitle: 'Powered By SarlaYash Mission',
    icon: Compass,
    content: `Welcome to the definitive Fortune 500 platform for software diagnostic excellence, distributed systems reliability, and agentic AI debugging. Founded and curated exclusively by Kapil. This tour will guide you through the key modules, 3-level progression, and proctored examination protocols.`,
    highlight: 'Executive Fortune 500 White & Grey Theme & Bullseye Standards'
  },
  {
    step: 2,
    title: '3-Level Gated Diagnostic Progression',
    subtitle: 'Sequential Mastery Before High-Stakes Assessments',
    icon: Layers,
    content: `Every learner advances through three structured tiers:
• Level 1: Language Syntax Invariants, Code Reading & Diagnostic MCQs.
• Level 2: Advanced Systems (Rust, Go, C++), Concurrency & AI Tooling (Claude Code, Cursor, Antigravity).
• Level 3: Fortune 500 Executive Mastery, Placement Rounds & the 3-Hour Final Assessment.`,
    highlight: 'Content is structured to guarantee solid foundations before touching live production bugs.'
  },
  {
    step: 3,
    title: 'Interactive IDE with Hidden Test Cases',
    subtitle: 'Integrated Code Editor, Negative Marking & Dynamic Tips',
    icon: Terminal,
    content: `Our integrated IDE features real-time syntax editing, line numbering, breakpoints, and live console outputs. Every challenge tests your solution against both public and hidden edge-case suites. Note: Incorrect runs trigger Negative Marking (-10 XP) to discourage random guessing!`,
    highlight: 'Tips for Wrong Answers and Progressive Hints provide architectural coaching.'
  },
  {
    step: 4,
    title: '14+ Domain MCQ Diagnostic Arena',
    subtitle: '10 Easy, 10 Medium, 10 Hard MCQs on Debugging Codes',
    icon: Code2,
    content: `Test your code comprehension across 14 enterprise domains:
HTML, C, C++, Java, Python, JavaScript/TS, SQL, Microsoft Excel, Power BI & DAX, GitHub Copilot, Prompt Engineering, Test Commands, Shell Scripts, and PowerShell. Each question features real code snippets, bug diagnoses, and instant explanations.`,
    highlight: 'Graded by difficulty tiers to pinpoint weak spots in seconds.'
  },
  {
    step: 5,
    title: 'Fortune 500 Bonus Spinning Wheel',
    subtitle: 'Daily Perks, Streak Shields & Anti-Penalty Tokens',
    icon: Disc3,
    content: `Earn daily rewards by spinning the physics-based bonus wheel! Rewards include +100 Bonus IQ, Streak Freeze Shields, Free Hint Passes that absorb negative marking penalties, and Kapil\'s Secret Bug Bounty challenge unlocks.`,
    highlight: 'Keeps learners motivated with authentic gamification credited to your profile.'
  },
  {
    step: 6,
    title: 'Strict 3-Hour Proctored Final Assessment',
    subtitle: 'Anti-Screenshot & Alt-Tab Lockdown with Zero-Tolerance Disqualification',
    icon: ShieldAlert,
    content: `The ultimate examination features a non-repeating pool with 60%+ Hard questions.
• Strict 3-Hour Timer: Candidate CANNOT submit or finish before 3 hours have fully elapsed.
• Zero-Tolerance Proctor: Any screenshot attempt (PrintScreen, Ctrl+Shift+S), Alt+Tab, tab switch, or app switch immediately auto-terminates the assessment with NO RETRY PERMITTED.`,
    highlight: 'Integrity benchmark trusted by Fortune 500 engineering recruiters.'
  },
  {
    step: 7,
    title: 'Executive Certificate Signed Exclusively by Kapil',
    subtitle: 'High-Resolution PDF & Cryptographic Verification',
    icon: Award,
    content: `Upon successfully completing the learning journey and passing the proctored 3-hour assessment, an official Certificate of Executive Excellence is generated. Features dynamic Google-verified candidate identity, unique verification hash ID, and the personal digital signature seal of Kapil. No fake signatories or unverified credentials.`,
    highlight: '100% Verifiable on the SarlaYash Mission public verification registry.'
  }
];

export default function DemoTourModal({ isOpen, onClose, onSelectTab }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const current = TOUR_STEPS[currentStepIndex];
  const Icon = current.icon;
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
              {current.step}
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Guided Navigation Tour &bull; Step {current.step} of {TOUR_STEPS.length}
              </span>
              <h3 className="font-extrabold text-slate-900 text-sm">
                {current.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tour Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 shrink-0">
              <Icon size={24} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                {current.subtitle}
              </div>
              <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                {current.highlight}
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed whitespace-pre-line">
            {current.content}
          </div>

          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {TOUR_STEPS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStepIndex ? 'w-6 bg-slate-900' : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Tour Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-2 py-1"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1"
              >
                <ChevronLeft size={14} />
                <span>Previous</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>{isLast ? 'Complete Tour & Start' : 'Next Step'}</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
