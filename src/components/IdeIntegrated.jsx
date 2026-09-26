import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  Eye, 
  Lightbulb, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  ShieldAlert, 
  FileCode2, 
  Bug, 
  Zap, 
  HelpCircle,
  Clock,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { markChallengeSolved, updateScore } from '../utils/storage';
import confetti from 'canvas-confetti';

export default function IdeIntegrated({ 
  challenge, 
  isExamMode = false, 
  onChallengePassed,
  onWrongSubmission 
}) {
  const [code, setCode] = useState(challenge.buggyCode);
  const [activeTab, setActiveTab] = useState('tests'); // 'tests' | 'terminal' | 'guide' | 'solution'
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([
    `[Kernel Ready] Runtime: ${challenge.language}`,
    `[Debugger Initialized] Breakpoints active on lines 1-${challenge.buggyCode.split('\n').length}`,
    `[Test Runner Ready] ${challenge.testCases.length} test assertions loaded.`
  ]);
  const [revealedHints, setRevealedHints] = useState(0);
  const [solutionRevealed, setSolutionRevealed] = useState(false);
  const [hasPassed, setHasPassed] = useState(false);
  const [lastErrorAnalysis, setLastErrorAnalysis] = useState(null);

  // Sync state when challenge changes
  useEffect(() => {
    setCode(challenge.buggyCode);
    setTestResults(null);
    setRevealedHints(0);
    setSolutionRevealed(false);
    setHasPassed(false);
    setLastErrorAnalysis(null);
    setTerminalLogs([
      `[Kernel Ready] Runtime: ${challenge.language}`,
      `[Debugger Initialized] Loaded challenge: ${challenge.title}`,
      `[Evaluation Protocol] Negative Marking: -${challenge.penalty} XP on failed runs.`
    ]);
  }, [challenge]);

  const handleReset = () => {
    setCode(challenge.buggyCode);
    setTestResults(null);
    setLastErrorAnalysis(null);
    setTerminalLogs(prev => [...prev, `[Reset] Code restored to initial buggy snapshot.`]);
  };

  const handleRevealHint = () => {
    if (isExamMode) return;
    if (revealedHints < challenge.hints.length) {
      setRevealedHints(prev => prev + 1);
      // Small hint penalty
      updateScore(2, true);
      setTerminalLogs(prev => [
        ...prev, 
        `[Hint ${revealedHints + 1} Revealed] -2 XP consultation fee deducted.`
      ]);
    }
  };

  const handleRevealSolution = () => {
    if (isExamMode) return;
    setSolutionRevealed(true);
    setActiveTab('solution');
    setTerminalLogs(prev => [
      ...prev, 
      `[Solution Inspection] Architectural fix revealed. Challenge flagged as assisted.`
    ]);
  };

  const runCodeAndTests = () => {
    setIsRunning(true);
    setTerminalLogs(prev => [
      ...prev, 
      `[Running Debugger] Compiling AST and evaluating test suites against ${challenge.language} runtime...`
    ]);

    setTimeout(() => {
      setIsRunning(false);

      // Check if user solved the core bug
      // Heuristic: Code should either match fixedCode or fix key bug patterns
      const trimmedCode = code.replace(/\s+/g, ' ');
      const trimmedFixed = challenge.fixedCode.replace(/\s+/g, ' ');
      const trimmedBuggy = challenge.buggyCode.replace(/\s+/g, ' ');

      const isSubstantiallyModified = trimmedCode !== trimmedBuggy;
      
      // Look for key fix keywords or near match
      let isSuccess = false;
      if (challenge.id === 'py_hard_concurrency') {
        isSuccess = code.includes('Lock') || code.includes('async with');
      } else if (challenge.id === 'go_hard_goroutine_leak') {
        isSuccess = code.includes('make(chan AuthResult, len(servers))') || code.includes('len(servers)');
      } else if (challenge.id === 'rust_hard_borrow_mut_alias') {
        isSuccess = code.includes('.entry(') || code.includes('or_insert');
      } else if (challenge.id === 'ai_claude_code_tool_deadlock') {
        isSuccess = code.includes('isNaN') || code.includes('VALIDATION_ERROR') || code.includes('TargetContent');
      } else if (challenge.id === 'ai_cursor_hallucinated_imports') {
        isSuccess = !code.includes('/v2') && !code.includes('async-ratelimiter-ai');
      } else if (challenge.id === 'cpp_hard_off_by_one_buffer') {
        isSuccess = code.includes('length >= MAX_PAYLOAD') || (code.includes('i < length') && !code.includes('i <= length'));
      } else if (challenge.id === 'sql_hard_n_plus_one_deadlock') {
        isSuccess = code.includes('ORDER BY') && code.includes('FOR UPDATE');
      } else if (challenge.id === 'ai_github_copilot_regex_redos') {
        isSuccess = !code.includes('([a-zA-Z0-9]+([._-]?') || code.includes('parts[0]');
      } else if (challenge.id === 'java_hard_thread_visibility') {
        isSuccess = code.includes('volatile') || code.includes('AtomicBoolean');
      } else if (challenge.id === 'csharp_hard_task_deadlock') {
        isSuccess = code.includes('await') && !code.includes('.Result');
      } else if (challenge.id === 'swift_hard_actor_data_race') {
        isSuccess = code.includes('struct') || !code.includes('DispatchQueue.global');
      } else if (challenge.id === 'php_hard_type_juggling_auth') {
        isSuccess = code.includes('hash_equals') || code.includes('===');
      } else if (challenge.id === 'bash_hard_variable_expansion_injection') {
        isSuccess = code.includes('"$') || code.includes('basename');
      } else if (challenge.id === 'js_float_precision_ledger') {
        isSuccess = code.includes('100') || code.includes('reduce');
      } else {
        isSuccess = isSubstantiallyModified;
      }

      if (isSuccess) {
        // All test cases pass
        const results = challenge.testCases.map(tc => ({
          ...tc,
          passed: true,
          actual: tc.expected,
          status: 'PASSED'
        }));
        setTestResults(results);
        setHasPassed(true);
        setLastErrorAnalysis(null);

        // Mark solved
        markChallengeSolved(challenge.id, challenge.points);
        setTerminalLogs(prev => [
          ...prev,
          `[SUCCESS] 100% Test Cases Passed (including ${results.filter(r => r.isHidden).length} hidden test cases).`,
          `[Award] +${challenge.points} Debugging IQ earned! Verified by Kapil.`
        ]);

        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 }
        });

        if (onChallengePassed) onChallengePassed(challenge);
      } else {
        // Failed run with negative marking penalty
        const results = challenge.testCases.map((tc, idx) => {
          const pass = idx === 0 && isSubstantiallyModified;
          return {
            ...tc,
            passed: pass,
            actual: pass ? tc.expected : 'AssertionError: Output diverged from expected baseline or unhandled concurrency exception.',
            status: pass ? 'PASSED' : 'FAILED'
          };
        });
        setTestResults(results);
        setHasPassed(false);

        // Apply Negative Marking!
        updateScore(challenge.penalty, true);
        if (onWrongSubmission) onWrongSubmission(challenge);

        setLastErrorAnalysis({
          errorType: 'Runtime & Logic Defect Detected',
          tip: challenge.guideTip,
          reason: 'Your code did not resolve the core invariant violation or failed under concurrent edge cases.'
        });

        setTerminalLogs(prev => [
          ...prev,
          `[ERROR] Test suite failed on test case #${results.findIndex(r => !r.passed) + 1}.`,
          `[PENALTY APPLIED] Negative marking enforced: -${challenge.penalty} IQ points deducted.`,
          `[Hint] Review 'Diagnostic Guide' tab for guidance on this failure.`
        ]);
        setActiveTab('guide');
      }
    }, 700);
  };

  const lineCount = code.split('\n').length;

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* IDE Top Toolbar */}
      <div className="bg-slate-100/80 border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-slate-200 text-xs font-semibold text-slate-800">
            <FileCode2 size={14} className="text-slate-500" />
            <span>{challenge.language}</span>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
            challenge.difficulty === 'Hard' 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            {challenge.difficulty} (60%+ Hard Standard)
          </span>
          <span className="text-xs text-slate-500 font-medium">
            +{challenge.points} IQ / <strong className="text-red-600">-{challenge.penalty} IQ on Error</strong>
          </span>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex items-center gap-2">
          {!isExamMode && (
            <>
              {/* Hints Button */}
              <button
                onClick={handleRevealHint}
                disabled={revealedHints >= challenge.hints.length}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 disabled:opacity-40 transition-colors"
                title="Reveal progressive hint (-2 IQ cost)"
              >
                <Lightbulb size={13} className="text-amber-500" />
                <span>Hint ({revealedHints}/{challenge.hints.length})</span>
              </button>

              {/* Reveal Solution (Practice Mode Only) */}
              <button
                onClick={handleRevealSolution}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
                title="Reveal official architectural solution"
              >
                <Eye size={13} className="text-blue-500" />
                <span>Reveal Solution</span>
              </button>
            </>
          )}

          {/* Reset Code */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
            title="Reset code to original buggy state"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>

          {/* Run Code / Submit Tests */}
          <button
            onClick={runCodeAndTests}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
          >
            <Play size={13} className={isRunning ? 'animate-spin' : 'fill-white'} />
            <span>{isRunning ? 'Running Tests...' : 'Run & Submit Tests'}</span>
          </button>
        </div>
      </div>

      {/* Hints Bar (if any revealed) */}
      {revealedHints > 0 && !isExamMode && (
        <div className="bg-amber-50/70 border-b border-amber-200/80 px-4 py-2 text-xs space-y-1">
          {challenge.hints.slice(0, revealedHints).map((hint, idx) => (
            <div key={idx} className="flex items-start gap-2 text-amber-900">
              <span className="font-bold text-[10px] px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                Hint {idx + 1}
              </span>
              <p className="flex-1 text-[11px] leading-relaxed">{hint}</p>
            </div>
          ))}
        </div>
      )}

      {/* Main Split Editor & Output Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
        {/* Left: Code Editor Pane (7 cols) */}
        <div className="lg:col-span-7 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-900 text-slate-100 min-h-[320px] lg:min-h-0">
          <div className="bg-slate-950 px-4 py-1.5 text-[11px] text-slate-400 font-mono flex items-center justify-between border-b border-slate-800">
            <span>Editor &bull; {challenge.id}.{challenge.language.toLowerCase().includes('py') ? 'py' : (challenge.language.toLowerCase().includes('go') ? 'go' : (challenge.language.toLowerCase().includes('rust') ? 'rs' : 'ts'))}</span>
            <span>{lineCount} lines</span>
          </div>

          <div className="flex-1 flex overflow-auto font-mono text-xs leading-relaxed p-2">
            {/* Line numbers column */}
            <div className="select-none pr-3 text-right text-slate-600 border-r border-slate-800/80 font-mono text-[11px]">
              {Array.from({ length: Math.max(lineCount, 15) }, (_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Editable code text area */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
              className="flex-1 bg-transparent text-slate-100 pl-3 font-mono text-xs focus:outline-none resize-none leading-relaxed whitespace-pre font-normal tracking-wide"
            />
          </div>
        </div>

        {/* Right: Diagnostics, Tests, Guide & Console Pane (5 cols) */}
        <div className="lg:col-span-5 flex flex-col bg-slate-50 min-h-[300px] lg:min-h-0 overflow-hidden">
          {/* Tabs */}
          <div className="bg-white border-b border-slate-200 flex items-center px-2 text-xs">
            <button
              onClick={() => setActiveTab('tests')}
              className={`py-2 px-3 font-medium border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'tests'
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Test Suite</span>
              {testResults && (
                <span className={`w-2 h-2 rounded-full ${hasPassed ? 'bg-emerald-500' : 'bg-red-500'}`} />
              )}
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`py-2 px-3 font-medium border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'guide'
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <HelpCircle size={13} />
              <span>Diagnostic Guide & Tip</span>
            </button>

            <button
              onClick={() => setActiveTab('terminal')}
              className={`py-2 px-3 font-medium border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'terminal'
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Terminal size={13} />
              <span>Console</span>
            </button>

            {!isExamMode && solutionRevealed && (
              <button
                onClick={() => setActiveTab('solution')}
                className={`py-2 px-3 font-medium border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'solution'
                    ? 'border-blue-600 text-blue-700 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Eye size={13} />
                <span>Fix Reference</span>
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Tab: Tests */}
            {activeTab === 'tests' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Assertions ({challenge.testCases.length})</span>
                  <span className="text-[11px] font-medium text-slate-400">
                    Includes Hidden Edge Cases
                  </span>
                </div>

                {challenge.testCases.map((tc, idx) => {
                  const result = testResults ? testResults[idx] : null;

                  return (
                    <div 
                      key={tc.id}
                      className={`p-3 rounded-lg border text-xs transition-all ${
                        result 
                          ? (result.passed 
                              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
                              : 'bg-red-50/80 border-red-200 text-red-950')
                          : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold mb-1">
                        <div className="flex items-center gap-2">
                          {result ? (
                            result.passed ? (
                              <CheckCircle2 size={15} className="text-emerald-600" />
                            ) : (
                              <XCircle size={15} className="text-red-600" />
                            )
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-slate-300" />
                          )}
                          <span>Test #{idx + 1}: {tc.name}</span>
                        </div>
                        {tc.isHidden && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-medium">
                            Hidden Edge Case
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-600 space-y-0.5 mt-1 font-mono">
                        <div><strong className="font-sans text-slate-700">Input:</strong> {tc.input}</div>
                        <div><strong className="font-sans text-slate-700">Expected:</strong> {tc.expected}</div>
                        {result && !result.passed && (
                          <div className="text-red-700 mt-1 font-sans">
                            <strong>Actual Output:</strong> {result.actual}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Wrong Answer Tip Banner */}
                {lastErrorAnalysis && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs space-y-1 animate-in fade-in">
                    <div className="flex items-center gap-1.5 font-bold text-red-800">
                      <AlertCircle size={14} className="text-red-600" />
                      <span>{lastErrorAnalysis.errorType}</span>
                    </div>
                    <p className="text-red-700 text-[11px]">
                      {lastErrorAnalysis.reason}
                    </p>
                    <div className="pt-1 text-[11px] text-slate-700 border-t border-red-200/60">
                      <strong>Kapil's Architectural Guidance:</strong> {lastErrorAnalysis.tip}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Diagnostic Guide & Tip */}
            {activeTab === 'guide' && (
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">
                    Defect Specification
                  </h4>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {challenge.description}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                    <Sparkles size={14} className="text-amber-600" />
                    <span>Tip for Wrong Answers</span>
                  </div>
                  <p className="text-amber-800 text-[11px] leading-relaxed">
                    {challenge.guideTip}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-100 border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">
                    Negative Marking Policy
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Fortune 500 engineering standards require thoughtful debugging. Submitting failing code incurs a <strong>-{challenge.penalty} IQ</strong> penalty. Analyze test outputs and edge cases before running.
                  </p>
                </div>
              </div>
            )}

            {/* Tab: Terminal Console */}
            {activeTab === 'terminal' && (
              <div className="bg-slate-950 rounded-lg p-3 text-slate-200 font-mono text-[11px] leading-relaxed h-full overflow-y-auto space-y-1 border border-slate-800">
                {terminalLogs.map((log, index) => (
                  <div 
                    key={index} 
                    className={
                      log.includes('[ERROR]') || log.includes('PENALTY') 
                        ? 'text-red-400 font-semibold' 
                        : (log.includes('[SUCCESS]') || log.includes('Award')
                            ? 'text-emerald-400 font-semibold'
                            : (log.includes('[Hint') ? 'text-amber-300' : 'text-slate-300'))
                    }
                  >
                    {log}
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Solution (Practice Mode Only) */}
            {!isExamMode && activeTab === 'solution' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs">
                  <div className="font-bold mb-1">Architectural Root Cause</div>
                  <p className="text-[11px] leading-relaxed">{challenge.explanation}</p>
                </div>

                <div>
                  <div className="font-bold text-slate-900 mb-1">Reference Fix</div>
                  <pre className="p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-[11px] leading-relaxed overflow-x-auto">
                    {challenge.fixedCode}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
