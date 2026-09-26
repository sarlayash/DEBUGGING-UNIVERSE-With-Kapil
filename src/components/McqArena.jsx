import React, { useState } from 'react';
import { 
  Code2, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  AlertCircle, 
  Sparkles, 
  ChevronRight, 
  RotateCcw,
  Layers,
  ArrowRight,
  Filter
} from 'lucide-react';
import { MCQ_DOMAINS, MCQ_DEBUGGING_DATA } from '../data/mcqDebuggingData';
import { updateScore } from '../utils/storage';
import confetti from 'canvas-confetti';

export default function McqArena() {
  const [selectedDomainKey, setSelectedDomainKey] = useState('python');
  const [selectedTier, setSelectedTier] = useState('easy'); // 'easy' | 'medium' | 'hard'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [scoreTracker, setScoreTracker] = useState({ correct: 0, wrong: 0 });

  const activeDomain = MCQ_DEBUGGING_DATA[selectedDomainKey] || MCQ_DEBUGGING_DATA.python;
  const questionsList = activeDomain[selectedTier] || [];
  const currentQ = questionsList[currentQuestionIndex] || questionsList[0];

  const handleSelectOption = (index) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
    setIsAnswerSubmitted(true);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      updateScore(20);
      setScoreTracker(prev => ({ ...prev, correct: prev.correct + 1 }));
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
    } else {
      // Negative marking on diagnostic quiz
      updateScore(5, true);
      setScoreTracker(prev => ({ ...prev, wrong: prev.wrong + 1 }));
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    if (currentQuestionIndex < questionsList.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setCurrentQuestionIndex(0);
    }
  };

  const handleResetQuiz = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setCurrentQuestionIndex(0);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-xs font-semibold mb-2">
            <Code2 size={13} className="text-slate-900" />
            <span>Multi-Language Diagnostic MCQ Engine</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Code-Snippet MCQ Debugging Arena
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Test and sharpen your defect-spotting intuition across 14 enterprise domains. Every question features real code snippets, bug diagnoses, negative marking, and architectural tips.
          </p>
        </div>

        {/* Live Score Pill */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs shrink-0">
          <div className="text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle2 size={14} />
            <span>{scoreTracker.correct} Correct (+20 XP)</span>
          </div>
          <div className="w-px h-3 bg-slate-200" />
          <div className="text-red-700 font-bold flex items-center gap-1">
            <XCircle size={14} />
            <span>{scoreTracker.wrong} Wrong (-5 XP)</span>
          </div>
        </div>
      </div>

      {/* Domain Selection Tabs (14 Domains) */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
          <Filter size={12} />
          <span>Select Diagnostic Domain ({MCQ_DOMAINS.length} Available):</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {MCQ_DOMAINS.map((domain) => {
            const isSelected = selectedDomainKey === domain.id;
            return (
              <button
                key={domain.id}
                onClick={() => {
                  setSelectedDomainKey(domain.id);
                  handleResetQuiz();
                }}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {domain.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tier Selector (Easy, Medium, Hard) */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-700">Difficulty Tier:</span>
          {['easy', 'medium', 'hard'].map((tier) => (
            <button
              key={tier}
              onClick={() => {
                setSelectedTier(tier);
                handleResetQuiz();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                selectedTier === tier
                  ? (tier === 'hard' ? 'bg-red-600 text-white' : (tier === 'medium' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-white'))
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tier} ({activeDomain[tier]?.length || 0})
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Question {currentQuestionIndex + 1} of {questionsList.length}
        </div>
      </div>

      {/* Main MCQ Card */}
      {currentQ ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* Question Title & Prompt */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {activeDomain.name} &bull; {selectedTier.toUpperCase()}
              </span>

              <span className="text-xs text-slate-400 font-medium">
                Negative Marking: -5 XP on incorrect choice
              </span>
            </div>

            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              {currentQ.title}
            </h3>

            <p className="text-xs text-slate-600 mt-2 font-medium leading-relaxed">
              {currentQ.question}
            </p>
          </div>

          {/* Code Snippet Box with Syntax Look */}
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
            <div className="px-4 py-1.5 bg-black/40 border-b border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>code_snippet.{selectedDomainKey}</span>
              <span>DEFECT ACTIVE</span>
            </div>
            <pre className="p-4 font-mono text-xs text-slate-100 leading-relaxed overflow-x-auto whitespace-pre">
              {currentQ.snippet}
            </pre>
          </div>

          {/* Options Grid */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Diagnostic Options
            </div>

            {currentQ.options.map((opt, idx) => {
              const isChosen = selectedOption === idx;
              const isCorrectAnswer = idx === currentQ.correctIndex;

              let btnStyle = 'bg-white border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-slate-800';
              if (isAnswerSubmitted) {
                if (isCorrectAnswer) {
                  btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-1 ring-emerald-400 font-medium';
                } else if (isChosen && !isCorrectAnswer) {
                  btnStyle = 'bg-red-50 border-red-400 text-red-950 ring-1 ring-red-400';
                } else {
                  btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-start gap-3 ${btnStyle}`}
                >
                  <span className="w-5 h-5 rounded-full border border-slate-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5 bg-slate-100 text-slate-700">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-relaxed flex-1">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Answer Explanation & Tip Box */}
          {isAnswerSubmitted && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                {selectedOption === currentQ.correctIndex ? (
                  <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 size={16} />
                    <span>Correct Diagnosis! (+20 XP Earned)</span>
                  </div>
                ) : (
                  <div className="text-xs font-bold text-red-700 flex items-center gap-1.5">
                    <XCircle size={16} />
                    <span>Incorrect Diagnosis (-5 XP Penalty Applied)</span>
                  </div>
                )}
              </div>

              <div className="text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-900">Architectural Explanation:</strong> {currentQ.explanation}
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 leading-relaxed">
                <strong>Kapil's Diagnostic Tip:</strong> {currentQ.tip}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <span>Next Challenge</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl">
          <p className="text-xs text-slate-500">No questions available in this tier.</p>
        </div>
      )}
    </div>
  );
}
