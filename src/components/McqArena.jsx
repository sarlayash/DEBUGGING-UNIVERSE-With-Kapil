import React, { useState, useEffect } from 'react';
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
  Filter,
  Shuffle,
  ShieldCheck,
  Trophy,
  Award
} from 'lucide-react';
import { 
  MCQ_DOMAINS, 
  MCQ_DEBUGGING_DATA, 
  prepareShuffledQuiz 
} from '../data/mcqDebuggingData';
import { updateScore } from '../utils/storage';
import confetti from 'canvas-confetti';

export default function McqArena() {
  const [selectedDomainKey, setSelectedDomainKey] = useState('python');
  const [selectedTier, setSelectedTier] = useState('easy'); // 'easy' | 'medium' | 'hard'
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [scoreTracker, setScoreTracker] = useState({ correct: 0, wrong: 0 });
  const [shuffleNonce, setShuffleNonce] = useState(0);
  const [isTierCompleted, setIsTierCompleted] = useState(false);

  const activeDomain = MCQ_DEBUGGING_DATA[selectedDomainKey] || MCQ_DEBUGGING_DATA.python;

  // Initialize and freshly shuffle questions & answer options per session/domain/tier/retake
  useEffect(() => {
    const rawList = activeDomain[selectedTier] || [];
    const freshlyPrepared = prepareShuffledQuiz(rawList);
    setQuizQuestions(freshlyPrepared);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setIsTierCompleted(false);
  }, [selectedDomainKey, selectedTier, shuffleNonce]);

  const currentQ = quizQuestions[currentQuestionIndex] || null;

  const handleSelectOption = (index) => {
    if (isAnswerSubmitted || !currentQ) return;
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
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsTierCompleted(true);
    }
  };

  const handleReshuffleCurrentTier = () => {
    setShuffleNonce(n => n + 1);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setIsTierCompleted(false);
  };

  const handleAdvanceTier = (nextTier) => {
    setSelectedTier(nextTier);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setIsTierCompleted(false);
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
            Sharpen your defect-spotting intuition across 14 enterprise domains. Every question features real code snippets, dynamic answer shuffling (options A, B, C, D randomized for every learner), negative marking, and architectural tips.
          </p>
        </div>

        {/* Live Score & Anti-Cheat Pill */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
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

          <button
            onClick={handleReshuffleCurrentTier}
            title="Randomize questions sequence and option positions"
            className="flex items-center gap-1.5 px-3 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 shrink-0"
          >
            <Shuffle size={13} className="text-slate-600" />
            <span>Reshuffle Quiz</span>
          </button>
        </div>
      </div>

      {/* Domain Selection Tabs (14 Domains) */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
          <div className="flex items-center gap-2">
            <Filter size={12} />
            <span>Select Diagnostic Domain ({MCQ_DOMAINS.length} Available):</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 lowercase">
            <ShieldCheck size={12} />
            anti-cheat option shuffling active
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {MCQ_DOMAINS.map((domain) => {
            const isSelected = selectedDomainKey === domain.id;
            return (
              <button
                key={domain.id}
                onClick={() => {
                  setSelectedDomainKey(domain.id);
                  handleReshuffleCurrentTier();
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
                handleReshuffleCurrentTier();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                selectedTier === tier
                  ? (tier === 'hard' ? 'bg-red-600 text-white' : (tier === 'medium' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-white'))
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tier} ({activeDomain[tier]?.length || 10})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="text-slate-500 font-medium">
            Question {Math.min(currentQuestionIndex + 1, quizQuestions.length)} of {quizQuestions.length}
          </div>
          <button
            onClick={handleReshuffleCurrentTier}
            className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1 text-[11px]"
          >
            <RotateCcw size={11} />
            <span>Reshuffle Deck</span>
          </button>
        </div>
      </div>

      {/* Main MCQ Card or Tier Completion Card */}
      {isTierCompleted ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Trophy size={32} />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-100 text-slate-800">
              Tier Completed
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-2">
              {activeDomain.name} &bull; {selectedTier.toUpperCase()} Finalized
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
              You reviewed all {quizQuestions.length} code debugging challenges in this tier under randomized conditions.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-center gap-6 py-4 border-y border-slate-100 max-w-md mx-auto text-xs">
            <div>
              <div className="text-lg font-black text-emerald-600">{scoreTracker.correct}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Correct</div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div>
              <div className="text-lg font-black text-red-600">{scoreTracker.wrong}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Wrong</div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div>
              <div className="text-lg font-black text-slate-900">
                {scoreTracker.correct + scoreTracker.wrong > 0 
                  ? Math.round((scoreTracker.correct / (scoreTracker.correct + scoreTracker.wrong)) * 100) 
                  : 0}%
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Accuracy</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleReshuffleCurrentTier}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-2 border border-slate-200"
            >
              <Shuffle size={14} />
              <span>Reshuffle & Re-attempt Tier</span>
            </button>

            {selectedTier === 'easy' && (
              <button
                onClick={() => handleAdvanceTier('medium')}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
              >
                <span>Advance to Medium Tier</span>
                <ChevronRight size={14} />
              </button>
            )}

            {selectedTier === 'medium' && (
              <button
                onClick={() => handleAdvanceTier('hard')}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
              >
                <span>Advance to Hard Tier</span>
                <ChevronRight size={14} />
              </button>
            )}

            {selectedTier === 'hard' && (
              <button
                onClick={() => {
                  const currentIndex = MCQ_DOMAINS.findIndex(d => d.id === selectedDomainKey);
                  const nextDomain = MCQ_DOMAINS[(currentIndex + 1) % MCQ_DOMAINS.length];
                  setSelectedDomainKey(nextDomain.id);
                  handleAdvanceTier('easy');
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
              >
                <span>Explore Next Domain</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      ) : currentQ ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* Question Title & Prompt */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {activeDomain.name} &bull; {selectedTier.toUpperCase()}
                </span>
                <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck size={11} />
                  <span>Randomized Option Layout</span>
                </span>
              </div>

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
              <span className="text-amber-400 font-bold">DEFECT ACTIVE</span>
            </div>
            <pre className="p-4 font-mono text-xs text-slate-100 leading-relaxed overflow-x-auto whitespace-pre">
              {currentQ.snippet}
            </pre>
          </div>

          {/* Options Grid (Fool-Proof Shuffled Layout) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
              <span>Diagnostic Options (A / B / C / D):</span>
              <span className="text-[10px] text-slate-400 font-normal normal-case">
                Select the correct diagnosis or code remediation
              </span>
            </div>

            {currentQ.options.map((opt, idx) => {
              const isChosen = selectedOption === idx;
              const isCorrectAnswer = idx === currentQ.correctIndex;

              let btnStyle = 'bg-white border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-slate-800';
              if (isAnswerSubmitted) {
                if (isCorrectAnswer) {
                  btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-1 ring-emerald-400 font-semibold';
                } else if (isChosen && !isCorrectAnswer) {
                  btnStyle = 'bg-red-50 border-red-400 text-red-950 ring-1 ring-red-400';
                } else {
                  btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={`${currentQ.id}_opt_${idx}`}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-start gap-3 ${btnStyle}`}
                >
                  <span className={`w-5 h-5 rounded-full border font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${
                    isAnswerSubmitted && isCorrectAnswer
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : isAnswerSubmitted && isChosen && !isCorrectAnswer
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-slate-100 border-slate-300 text-slate-700'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-relaxed flex-1">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Answer Explanation & Tip Box */}
          {isAnswerSubmitted && (
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
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

                <div className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                  Correct Answer: Option {String.fromCharCode(65 + currentQ.correctIndex)}
                </div>
              </div>

              <div className="text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-900">Architectural Explanation:</strong> {currentQ.explanation}
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 leading-relaxed">
                <strong>Kapil's Diagnostic Tip:</strong> {currentQ.tip}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={handleReshuffleCurrentTier}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1"
                >
                  <Shuffle size={12} />
                  <span>Reshuffle & Retry Tier</span>
                </button>

                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <span>
                    {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Challenge' : 'Complete Tier & View Summary'}
                  </span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl">
          <p className="text-xs text-slate-500">Loading diagnostic challenge pool...</p>
        </div>
      )}
    </div>
  );
}
