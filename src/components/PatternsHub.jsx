import React, { useState } from 'react';
import { BookOpen, CheckCircle, AlertTriangle, ShieldCheck, FileCode, Sparkles } from 'lucide-react';
import { PATTERNS_DATA } from '../data/patternsData';
import { getPatternsStudied, markPatternStudied } from '../utils/storage';

export default function PatternsHub() {
  const [activePattern, setActivePattern] = useState(PATTERNS_DATA[0]);
  const [studiedPatterns, setStudiedPatterns] = useState(getPatternsStudied());

  const handleMarkStudied = (id) => {
    markPatternStudied(id);
    setStudiedPatterns(getPatternsStudied());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
          <BookOpen size={13} className="text-blue-600" />
          <span>Architectural Diagnostic Theory</span>
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Software Debugging Patterns Library
        </h2>
        <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Master the systematic diagnostic taxonomy used by Staff Engineers at Google, Meta, and Netflix. Recognizing the shape of a defect eliminates hours of random guessing.
        </p>
      </div>

      {/* Main Grid: Left Selector, Right Detailed Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Pattern List (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-3 shadow-xs space-y-1">
          <div className="p-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Pattern Index ({PATTERNS_DATA.length})
          </div>
          {PATTERNS_DATA.map((pattern) => {
            const isSelected = activePattern.id === pattern.id;
            const isStudied = studiedPatterns.includes(pattern.id);

            return (
              <button
                key={pattern.id}
                onClick={() => setActivePattern(pattern)}
                className={`w-full text-left p-3 rounded-lg transition-all flex items-start justify-between gap-2 ${
                  isSelected
                    ? 'bg-slate-900 text-white font-medium shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div>
                  <div className="text-xs font-bold leading-snug">
                    {pattern.title}
                  </div>
                  <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {pattern.category}
                  </div>
                </div>

                {isStudied && (
                  <CheckCircle size={14} className={isSelected ? 'text-emerald-300' : 'text-emerald-600'} />
                )}
              </button>
            );
          })}
        </div>

        {/* Pattern Deep Dive (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {activePattern.category} &bull; Severity: {activePattern.severity}
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                {activePattern.title}
              </h3>
            </div>

            <button
              onClick={() => handleMarkStudied(activePattern.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                studiedPatterns.includes(activePattern.id)
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              <CheckCircle size={13} />
              <span>{studiedPatterns.includes(activePattern.id) ? 'Mastered' : 'Mark as Studied'}</span>
            </button>
          </div>

          {/* Core Diagnosis Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900">Root Cause Mechanism</span>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                {activePattern.rootCause}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900">Diagnostic Symptoms</span>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                {activePattern.symptoms}
              </p>
            </div>
          </div>

          {/* Outage Case Study */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <AlertTriangle size={14} className="text-amber-600" />
              <span>Real-World Production Outage Case</span>
            </div>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              {activePattern.productionCase}
            </p>
          </div>

          {/* Rule of Thumb */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Kapil's Rule of Thumb for Prevention</span>
            </div>
            <p className="text-emerald-800 text-[11px] leading-relaxed">
              {activePattern.ruleOfThumb}
            </p>
          </div>

          {/* Code Before & After */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <FileCode size={14} />
              <span>Comparative Archetype: Anti-Pattern vs Fix</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-t-lg">
                  Defective Anti-Pattern
                </div>
                <pre className="p-3 bg-slate-900 text-red-200 font-mono text-[11px] leading-relaxed rounded-b-lg overflow-x-auto border-x border-b border-slate-800">
                  {activePattern.badCode}
                </pre>
              </div>

              <div>
                <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-t-lg">
                  Remediated Architecture
                </div>
                <pre className="p-3 bg-slate-900 text-emerald-200 font-mono text-[11px] leading-relaxed rounded-b-lg overflow-x-auto border-x border-b border-slate-800">
                  {activePattern.goodCode}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
