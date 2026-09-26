import React, { useState } from 'react';
import { Briefcase, Building2, Clock, CheckCircle, ChevronRight, Award, ShieldAlert, Sparkles, Terminal } from 'lucide-react';
import { INTERVIEWS_DATA } from '../data/interviewsData';
import { getInterviewsCompleted, markInterviewCompleted } from '../utils/storage';

export default function InterviewsHub({ onOpenIdeWithSnippet }) {
  const [selectedInterview, setSelectedInterview] = useState(INTERVIEWS_DATA[0]);
  const [completedList, setCompletedList] = useState(getInterviewsCompleted());

  const handleToggleComplete = (id) => {
    markInterviewCompleted(id);
    setCompletedList(getInterviewsCompleted());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
          <Briefcase size={13} className="text-slate-800" />
          <span>Staff & Senior Level Placement Preparation</span>
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Fortune 500 Placement & Interview Debugging Arena
        </h2>
        <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Real live debugging rounds from Google, Meta, Stripe, and Amazon. Learn how senior engineering interviewers evaluate diagnosis speed, distributed telemetry tracing, and root cause mitigation.
        </p>
      </div>

      {/* Grid: Companies on Left, Scenario on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Company List (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-3 shadow-xs space-y-1">
          <div className="p-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Enterprise Interview Tracks
          </div>
          {INTERVIEWS_DATA.map((item) => {
            const isSelected = selectedInterview.id === item.id;
            const isDone = completedList.includes(item.id);

            return (
              <button
                key={item.id}
                onClick={() => setSelectedInterview(item)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'bg-slate-900 text-white font-medium shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-extrabold text-xs">{item.company}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {item.level}
                    </span>
                  </div>
                  <div className="text-xs font-semibold leading-tight line-clamp-1">
                    {item.title}
                  </div>
                  <div className={`text-[10px] mt-1 flex items-center gap-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    <Clock size={11} />
                    <span>{item.timeLimit}</span>
                  </div>
                </div>

                {isDone && (
                  <CheckCircle size={15} className={isSelected ? 'text-emerald-300' : 'text-emerald-600'} />
                )}
              </button>
            );
          })}
        </div>

        {/* Detailed Scenario (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {selectedInterview.company} &bull; {selectedInterview.role}
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                {selectedInterview.title}
              </h3>
            </div>

            <button
              onClick={() => handleToggleComplete(selectedInterview.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                completedList.includes(selectedInterview.id)
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              <CheckCircle size={13} />
              <span>{completedList.includes(selectedInterview.id) ? 'Round Passed' : 'Mark Round Cleared'}</span>
            </button>
          </div>

          {/* Scenario Overview */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-slate-900">Incident Scenario Briefing</span>
            <p className="text-slate-700 text-xs leading-relaxed">
              {selectedInterview.scenario}
            </p>
          </div>

          {/* Two-column layout for steps and rubrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Investigation Checklist */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <span className="font-bold text-slate-900 block">Expected Investigation Steps</span>
              <ul className="space-y-1.5 text-[11px] text-slate-600">
                {selectedInterview.investigationSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[9px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Rubrics */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <span className="font-bold text-slate-900 block">Staff Interviewer Evaluation Rubric</span>
              <ul className="space-y-1.5 text-[11px] text-slate-600">
                {selectedInterview.interviewerCriteria.map((crit, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <Sparkles size={12} className="text-amber-500 shrink-0 mt-0.5" />
                    <span>{crit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sample Defective Snippet */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-900 block">Root-Cause Bug Snippet</span>
            <pre className="p-3 bg-slate-900 text-red-200 font-mono text-[11px] leading-relaxed rounded-xl overflow-x-auto border border-slate-800">
              {selectedInterview.sampleBugSnippet}
            </pre>
          </div>

          {/* Architectural Fix Recommendation */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1">
            <div className="font-bold text-emerald-950 flex items-center gap-1.5">
              <Award size={14} className="text-emerald-700" />
              <span>Kapil's Architectural Remediation Advice</span>
            </div>
            <p className="text-emerald-900 text-[11px] leading-relaxed">
              {selectedInterview.solutionRecommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
