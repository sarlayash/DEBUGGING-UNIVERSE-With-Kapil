import React, { useState } from 'react';
import { 
  Code2, 
  Terminal, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Zap, 
  AlertTriangle, 
  Search, 
  Layers, 
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Bot
} from 'lucide-react';
import { CHALLENGES_DATA, CATEGORIES, LANGUAGES } from '../data/challengesData';
import { getSolvedChallenges } from '../utils/storage';

export default function PracticeHub({ onSelectChallenge, solvedIds }) {
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [hideSolved, setHideSolved] = useState(false);
  const [search, setSearch] = useState('');

  // Filter challenges
  const filtered = CHALLENGES_DATA.filter((ch) => {
    const matchesLang = selectedLanguage === 'All' || ch.language === selectedLanguage;
    const matchesDiff = selectedDifficulty === 'All' || ch.difficulty === selectedDifficulty;
    const isSolved = solvedIds.includes(ch.id);
    const matchesSolved = hideSolved ? !isSolved : true;
    const matchesSearch = search === '' || 
      ch.title.toLowerCase().includes(search.toLowerCase()) ||
      ch.language.toLowerCase().includes(search.toLowerCase()) ||
      ch.description.toLowerCase().includes(search.toLowerCase());

    return matchesLang && matchesDiff && matchesSolved && matchesSearch;
  });

  const totalChallenges = CHALLENGES_DATA.length;
  const hardCount = CHALLENGES_DATA.filter(c => c.difficulty === 'Hard').length;
  const hardPercentage = Math.round((hardCount / totalChallenges) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
            <Sparkles size={13} className="text-amber-500" />
            <span>Multi-Language & All AI Portals Catalog</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Practice Arena: Non-Repeated Engineering Bugs
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Hands-on code repair across systems programming (Rust, Go, C++, Java), database queries, and cutting-edge agentic AI tools (Cursor, Claude Code, Antigravity). Hidden test cases, negative marking, and architectural guides included.
          </p>
        </div>

        {/* Quality Metrics Pill */}
        <div className="flex md:flex-col gap-2 shrink-0 text-right">
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-left md:text-right">
            <div className="text-[10px] uppercase font-bold text-red-700 tracking-wider">
              Curriculum Difficulty
            </div>
            <div className="text-lg font-black text-red-900">
              {hardPercentage}% Hard / Expert
            </div>
            <div className="text-[10px] text-red-600 font-medium">
              Surpasses 60% requirement
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Languages Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full text-xs">
            <span className="font-semibold text-slate-700 text-xs flex items-center gap-1">
              <Filter size={13} />
              Runtime:
            </span>
            {LANGUAGES.slice(0, 8).map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedLanguage === lang
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Toggle Fresh / Non-Repeated Questions */}
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hideSolved}
              onChange={(e) => setHideSolved(e.target.checked)}
              className="rounded border-slate-300 text-slate-900 focus:ring-0"
            />
            <span>Fresh Questions Only (Hide Solved)</span>
          </label>
        </div>

        {/* Secondary Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">Difficulty:</span>
            {['All', 'Hard', 'Medium'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedDifficulty === diff
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {diff === 'Hard' ? 'Hard (60%+)' : diff}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500">
            Showing <strong>{filtered.length}</strong> of <strong>{totalChallenges}</strong> active challenges
          </div>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const isSolved = solvedIds.includes(item.id);
          const isAI = item.language.includes('AI Portal');

          return (
            <div
              key={item.id}
              onClick={() => onSelectChallenge(item)}
              className={`group bg-white rounded-xl border p-5 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                isSolved 
                  ? 'border-emerald-200 bg-emerald-50/20' 
                  : 'border-slate-200 hover:border-slate-400'
              }`}
            >
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                    isAI ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {isAI ? <Bot size={12} /> : <Terminal size={12} />}
                    {item.language}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      item.difficulty === 'Hard'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {item.difficulty}
                    </span>

                    {isSolved && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 size={12} />
                        Solved
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-sm text-slate-900 group-hover:text-slate-950 transition-colors line-clamp-1 mb-1.5">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
                  {item.description}
                </p>
              </div>

              {/* Bottom details */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                  <span>+{item.points} IQ</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-red-600 font-medium">-{item.penalty} on Error</span>
                </div>

                <div className="flex items-center gap-1 text-slate-700 font-semibold text-xs group-hover:translate-x-0.5 transition-transform">
                  <span>Enter IDE</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
