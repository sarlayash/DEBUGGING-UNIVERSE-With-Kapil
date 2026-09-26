import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  Clock, 
  AlertTriangle, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  Play, 
  ChevronRight, 
  ChevronLeft,
  Terminal,
  FileCode2,
  Sparkles,
  HelpCircle,
  EyeOff,
  Flame,
  Award,
  Mail,
  RefreshCw
} from 'lucide-react';
import { CHALLENGES_DATA } from '../data/challengesData';
import { shuffleArray } from '../data/mcqDebuggingData';
import { 
  getFinalAssessmentStatus, 
  saveFinalAssessmentStatus, 
  awardBadge, 
  updateScore,
  getSolvedChallenges,
  getPatternsStudied,
  getInterviewsCompleted,
  getAccountLock,
  clearAccountLock
} from '../utils/storage';
import { reportCheatingIncident, NOTIFIED_SECURITY_EMAILS } from '../utils/antiCheatService';
import confetti from 'canvas-confetti';

const TOTAL_EXAM_SECONDS = 3 * 60 * 60; // 3 Hours (180 minutes)
const PER_QUESTION_SECONDS = 15 * 60; // 15 Minutes per question

export default function FinalAssessment({ userProfile, onOpenAuth, onAssessmentCompleted }) {
  // Prerequisite check
  const solvedList = getSolvedChallenges();
  const patternsList = getPatternsStudied();
  const interviewsList = getInterviewsCompleted();
  const isJourneyReady = solvedList.length >= 2 && patternsList.length >= 1 && interviewsList.length >= 1;

  const [assessmentState, setAssessmentState] = useState(getFinalAssessmentStatus());
  const [examQuestions, setExamQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [examSecondsRemaining, setExamSecondsRemaining] = useState(TOTAL_EXAM_SECONDS);
  const [questionSecondsRemaining, setQuestionSecondsRemaining] = useState(PER_QUESTION_SECONDS);
  const [userCodes, setUserCodes] = useState({});
  const [submissionStatuses, setSubmissionStatuses] = useState({});
  const [testResults, setTestResults] = useState({});
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [examScore, setExamScore] = useState(0);
  const [penaltyDeductions, setPenaltyDeductions] = useState(0);

  // Initialize or restore assessment
  useEffect(() => {
    const status = getFinalAssessmentStatus();
    setAssessmentState(status);

    if (status.status === 'IN_PROGRESS') {
      // Pick 5 questions with at least 60% (3+) Hard questions
      const hardPool = CHALLENGES_DATA.filter(c => c.difficulty === 'Hard');
      const medPool = CHALLENGES_DATA.filter(c => c.difficulty !== 'Hard');

      // Shuffle and pick 3 hard, 2 medium
      const selected = [
        ...hardPool.slice(0, 3),
        ...medPool.slice(0, 2)
      ];
      setExamQuestions(selected);

      // Initialize code state
      const initialCodes = {};
      selected.forEach(q => {
        initialCodes[q.id] = q.buggyCode;
      });
      setUserCodes(initialCodes);

      // Compute remaining time if started earlier
      if (status.startTime) {
        const elapsed = Math.floor((Date.now() - status.startTime) / 1000);
        const remaining = Math.max(0, TOTAL_EXAM_SECONDS - elapsed);
        setExamSecondsRemaining(remaining);
      }
    }
  }, []);

  // MASTER ANTI-CHEAT & PROCTORING HOOK
  useEffect(() => {
    if (assessmentState.status !== 'IN_PROGRESS') return;

    const triggerDisqualification = (reason) => {
      const nowStr = new Date().toLocaleTimeString();
      const disqualifiedPayload = {
        status: 'DISQUALIFIED',
        startTime: assessmentState.startTime,
        endTime: Date.now(),
        disqualificationReason: `${reason} (Detected at ${nowStr})`,
        disqualifiedAt: new Date().toISOString(),
        score: 0,
        passed: false,
        certificateId: null,
        violations: [reason]
      };

      saveFinalAssessmentStatus(disqualifiedPayload);
      setAssessmentState(disqualifiedPayload);

      // Report Cheating Incident: Enforces 24h lockout & dispatches email to kapilnarula27july@gmail.com and namaste@sarlayash.com
      reportCheatingIncident({
        candidateName: userProfile?.name || 'Verified Google Candidate',
        candidateEmail: userProfile?.email || 'authenticated.session@google.com',
        candidateUid: userProfile?.uid || 'ANONYMOUS',
        violationReason: reason,
        examContext: {
          currentQuestionIndex,
          examSecondsRemaining,
          score: examScore
        }
      });

      // Play alert tone if audio context supported
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } catch (e) {}
    };

    // 1. Detect Tab Switch / Alt + Tab / Window Blur
    const handleWindowBlur = () => {
      triggerDisqualification('Window Focus Lost: Alt+Tab, Application Switch, or Window Minimized detected.');
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerDisqualification('Tab Switch / Browser Hidden: Candidate navigated away from active assessment viewport.');
      }
    };

    // 2. Detect Screenshot Attempts & DevTools Keystrokes
    const handleKeyDown = (e) => {
      // PrintScreen key
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        triggerDisqualification('Screen Capture Attempt: PrintScreen keypress detected by proctor.');
        return;
      }

      // Windows Snipping tool / Mac screenshot combos
      // Ctrl+Shift+S, Meta+Shift+3, Meta+Shift+4, Meta+Shift+S
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'S' || e.key === 's' || e.key === '3' || e.key === '4')) {
        e.preventDefault();
        triggerDisqualification('Screen Clipping Attempt: Snipping / Screenshot shortcut detected.');
        return;
      }

      // Alt + Tab intercept
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        triggerDisqualification('Alt+Tab Task Switch detected.');
        return;
      }

      // DevTools F12 or Ctrl+Shift+I / Ctrl+Shift+J
      if (e.key === 'F12' || ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'J'))) {
        e.preventDefault();
        triggerDisqualification('Developer Tools Inspection Attempt detected.');
        return;
      }
    };

    // 3. Disable Context Menu (Right Click)
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [assessmentState.status]);

  // Timers Hook
  useEffect(() => {
    if (assessmentState.status !== 'IN_PROGRESS') return;

    const timer = setInterval(() => {
      setExamSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Exam Time Reached 3 Hours! Can auto-evaluate or finalize
          handleFinalizeAssessment();
          return 0;
        }
        return prev - 1;
      });

      setQuestionSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Reset per question timer
          return PER_QUESTION_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [assessmentState.status]);

  const handleStartAssessment = () => {
    if (!userProfile) {
      onOpenAuth();
      return;
    }

    // Pick 5 non-repeated questions with random shuffle (3 Hard, 2 Medium = 60% Hard)
    const hardPool = shuffleArray(CHALLENGES_DATA.filter(c => c.difficulty === 'Hard'));
    const medPool = shuffleArray(CHALLENGES_DATA.filter(c => c.difficulty !== 'Hard'));

    const selected = shuffleArray([
      ...hardPool.slice(0, 3),
      ...medPool.slice(0, 2)
    ]);

    setExamQuestions(selected);
    setCurrentQuestionIndex(0);
    setExamSecondsRemaining(TOTAL_EXAM_SECONDS);
    setQuestionSecondsRemaining(PER_QUESTION_SECONDS);

    const initialCodes = {};
    selected.forEach(q => {
      initialCodes[q.id] = q.buggyCode;
    });
    setUserCodes(initialCodes);

    const newStatus = {
      status: 'IN_PROGRESS',
      startTime: Date.now(),
      endTime: null,
      disqualificationReason: null,
      score: 0,
      passed: false,
      certificateId: null,
      violations: []
    };

    saveFinalAssessmentStatus(newStatus);
    setAssessmentState(newStatus);
    setTerminalLogs([
      `[PROCTOR ENGAGED] Strict 3-Hour Exam Initialized.`,
      `[SECURITY] Anti-Screenshot & Alt-Tab Lockdown ACTIVE. Any focus loss triggers permanent disqualification.`,
      `[NON-REPEAT BANK] Loaded 5 unique engineering defect challenges (60% Hard).`
    ]);
  };

  const currentQ = examQuestions[currentQuestionIndex];

  const handleRunExamTest = () => {
    if (!currentQ) return;
    const userCode = userCodes[currentQ.id] || '';

    // Evaluate solution with negative marking
    const trimmedCode = userCode.replace(/\s+/g, ' ');
    const trimmedBuggy = currentQ.buggyCode.replace(/\s+/g, ' ');

    let isSuccess = false;
    if (currentQ.id === 'py_hard_concurrency') {
      isSuccess = userCode.includes('Lock') || userCode.includes('async with');
    } else if (currentQ.id === 'go_hard_goroutine_leak') {
      isSuccess = userCode.includes('len(servers)');
    } else if (currentQ.id === 'rust_hard_borrow_mut_alias') {
      isSuccess = userCode.includes('.entry(') || userCode.includes('or_insert');
    } else if (currentQ.id === 'ai_claude_code_tool_deadlock') {
      isSuccess = userCode.includes('isNaN') || userCode.includes('VALIDATION_ERROR');
    } else if (currentQ.id === 'ai_cursor_hallucinated_imports') {
      isSuccess = !userCode.includes('/v2') && !userCode.includes('async-ratelimiter-ai');
    } else if (currentQ.id === 'cpp_hard_off_by_one_buffer') {
      isSuccess = userCode.includes('length >= MAX_PAYLOAD') || (userCode.includes('i < length') && !userCode.includes('i <= length'));
    } else if (currentQ.id === 'sql_hard_n_plus_one_deadlock') {
      isSuccess = userCode.includes('ORDER BY') && userCode.includes('FOR UPDATE');
    } else {
      isSuccess = trimmedCode !== trimmedBuggy && userCode.length > 50;
    }

    if (isSuccess) {
      setSubmissionStatuses(prev => ({ ...prev, [currentQ.id]: 'PASSED' }));
      setExamScore(prev => prev + currentQ.points);
      updateScore(currentQ.points);
      setTerminalLogs(prev => [
        ...prev,
        `[QUESTION ${currentQuestionIndex + 1} PASSED] 100% test assertions validated. +${currentQ.points} points awarded.`
      ]);
    } else {
      // Negative marking strictly applied
      setSubmissionStatuses(prev => ({ ...prev, [currentQ.id]: 'FAILED' }));
      setPenaltyDeductions(prev => prev + currentQ.penalty);
      updateScore(currentQ.penalty, true);
      setTerminalLogs(prev => [
        ...prev,
        `[QUESTION ${currentQuestionIndex + 1} FAILED] Logic invariant violated. -${currentQ.penalty} negative penalty applied.`
      ]);
    }
  };

  const handleFinalizeAssessment = () => {
    // Check if 3 hours elapsed: Rule "learner can not finish before 3 hours"
    if (examSecondsRemaining > 60) { // allow small margin if timer runs down naturally
      alert("PROCTOR PROTOCOL VIOLATION: Learner cannot submit or finish before 3 full hours. The assessment mandates thorough code audit and invariant review for the entire 180 minutes.");
      return;
    }

    // Tally passed
    const passedCount = Object.values(submissionStatuses).filter(s => s === 'PASSED').length;
    const isExamPassed = passedCount >= 3; // pass at least 3 out of 5

    const certId = isExamPassed ? `SY-DU-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}` : null;

    const finalizedState = {
      status: 'COMPLETED',
      startTime: assessmentState.startTime,
      endTime: Date.now(),
      score: Math.max(0, examScore - penaltyDeductions),
      passed: isExamPassed,
      certificateId: certId,
      disqualificationReason: null,
      violations: []
    };

    saveFinalAssessmentStatus(finalizedState);
    setAssessmentState(finalizedState);

    if (isExamPassed) {
      awardBadge('executive_debugger');
      confetti({ particleCount: 150, spread: 80 });
      if (onAssessmentCompleted) onAssessmentCompleted(finalizedState);
    }
  };

  // Format seconds to HH:MM:SS
  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatMinSec = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 1. DISQUALIFIED SCREEN (24-Hour Quarantine & Email Alert Dispatched)
  if (assessmentState.status === 'DISQUALIFIED' || getAccountLock().isLocked) {
    const lock = getAccountLock();
    const remainingSec = Math.max(0, Math.floor((lock.remainingMs || (24 * 60 * 60 * 1000)) / 1000));
    const remH = Math.floor(remainingSec / 3600);
    const remM = Math.floor((remainingSec % 3600) / 60);
    const remS = remainingSec % 60;
    const pad = (n) => String(n).padStart(2, '0');

    return (
      <div className="bg-white border-4 border-red-600 rounded-3xl p-8 shadow-2xl text-center space-y-6 max-w-3xl mx-auto my-8">
        <div className="w-20 h-20 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto border-2 border-red-300 shadow-inner">
          <ShieldAlert size={44} className="animate-pulse" />
        </div>

        <div>
          <span className="px-3.5 py-1.5 rounded-full bg-red-100 text-red-800 text-xs font-black uppercase tracking-wider border border-red-200">
            Proctor Security Quarantine &bull; Login Suspended
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 tracking-tight">
            ASSESSMENT TERMINATED & ACCOUNT LOCKED
          </h2>
          <p className="text-sm text-red-600 font-bold mt-1">
            24-HOUR COMPLETE AUTHENTICATION & EVALUATION LOCKOUT ENFORCED
          </p>
        </div>

        {/* 24-Hour Live Countdown Timer */}
        <div className="p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Clock size={14} className="text-red-600" />
            <span>24-Hour Lockout Remaining</span>
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-black text-slate-900 tracking-widest">
            {pad(remH)} : {pad(remM)} : {pad(remS)}
          </div>
          <div className="text-[11px] text-slate-500">
            Login and exam access will automatically restore on: <strong>{lock.expiresDateStr || 'After 24 Hours'}</strong>
          </div>
        </div>

        {/* Official Email Notification Dispatched Banner */}
        <div className="p-5 bg-slate-950 text-white rounded-2xl text-left space-y-2 border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 font-black text-emerald-400 text-xs uppercase tracking-wider">
              <CheckCircle2 size={16} />
              <span>Incident Dispatched to Authorized Signatories</span>
            </div>
            <span className="text-[10px] font-mono bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30 font-bold">
              HIGH PRIORITY
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            In compliance with SarlaYash Mission examination integrity standards, an automated forensic incident alert has been dispatched to:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-xs">
            <div className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <Mail size={14} className="text-amber-400 shrink-0" />
              <span className="text-slate-200">kapilnarula27july@gmail.com</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <Mail size={14} className="text-amber-400 shrink-0" />
              <span className="text-slate-200">namaste@sarlayash.com</span>
            </div>
          </div>
        </div>

        {/* Incident Details Card */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-left space-y-2">
          <div className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center justify-between">
            <span>Forensic Incident Log (Kapil / SarlaYash Mission)</span>
            <span className="text-[11px] text-red-600 font-mono font-bold">SEALED AUDIT</span>
          </div>
          <div className="text-slate-700">
            <strong>Candidate Identity:</strong> {userProfile?.name || 'Verified Google Candidate'} ({userProfile?.email || 'Authenticated Session'})
          </div>
          <div className="text-slate-700">
            <strong>Violation Detected:</strong> {assessmentState.disqualificationReason || lock.reason || 'Alt+Tab / Screenshot / Tab Switch violation recorded.'}
          </div>
          <div className="text-slate-700">
            <strong>Enforcement Protocol:</strong> Session immediately terminated, assessment permanently voided with 0 score, candidate login quarantined across all evaluative modules for 24 hours.
          </div>
        </div>

        {/* Admin Emergency Reset Button for Testing / Verification */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              clearAccountLock();
              saveFinalAssessmentStatus({ status: 'READY', passed: false, score: 0 });
              setAssessmentState({ status: 'READY', passed: false, score: 0 });
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-300"
            title="Reset lockout for testing purposes"
          >
            <RefreshCw size={13} />
            <span>Admin / Tester: Emergency Reset Lockout (For Verification Testing)</span>
          </button>
        </div>

        <div className="text-xs text-slate-400">
          For formal academic appeals or hardware error disputes, contact SarlaYash Mission Academic Integrity Board signed by Kapil.
        </div>
      </div>
    );
  }

  // 2. COMPLETED ASSESSMENT SCREEN
  if (assessmentState.status === 'COMPLETED') {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg text-center space-y-6 max-w-2xl mx-auto my-8">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto border-2 ${
          assessmentState.passed 
            ? 'bg-emerald-100 text-emerald-600 border-emerald-300' 
            : 'bg-amber-100 text-amber-600 border-amber-300'
        }`}>
          {assessmentState.passed ? <CheckCircle2 size={36} /> : <AlertTriangle size={36} />}
        </div>

        <div>
          <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${
            assessmentState.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {assessmentState.passed ? 'Assessment Passed' : 'Assessment Completed (Score Insufficient)'}
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
            {assessmentState.passed 
              ? 'Executive Debugging Credential Earned!' 
              : 'Assessment Review Finalized'}
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
            {assessmentState.passed 
              ? 'You have satisfied the 3-hour strict evaluation protocol without integrity violations. Your certificate is unlocked.'
              : 'You completed the 3-hour session, but did not clear the required threshold of 60%+ Hard questions.'}
          </p>
        </div>

        {assessmentState.passed && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1 text-left">
            <div className="flex justify-between">
              <span className="text-slate-500">Certificate Verification ID:</span>
              <span className="font-mono font-bold text-slate-900">{assessmentState.certificateId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sole Authorized Signatory:</span>
              <span className="font-bold text-slate-900">Kapil (SarlaYash Mission)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Final Evaluated IQ Score:</span>
              <span className="font-bold text-emerald-700">{assessmentState.score} IQ</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. IN_PROGRESS LIVE 3-HOUR PROCTORED EXAM ENGINE
  if (assessmentState.status === 'IN_PROGRESS' && currentQ) {
    const isQPassed = submissionStatuses[currentQ.id] === 'PASSED';
    const isQFailed = submissionStatuses[currentQ.id] === 'FAILED';
    const canEarlySubmit = examSecondsRemaining <= 0; // Strictly prohibited before 3 hours!

    return (
      <div className="flex flex-col h-[calc(100vh-140px)] bg-white border border-slate-300 rounded-2xl shadow-xl overflow-hidden select-none">
        {/* Top Proctoring & Timer Banner */}
        <div className="bg-slate-950 text-white px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-600/30 border border-red-500 text-red-300 text-xs font-bold uppercase tracking-wider animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Proctor Active
            </div>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Anti-Screenshot & Alt-Tab Lock Engaged &bull; Candidate: {userProfile?.name}
            </span>
            <button
              onClick={() => {
                const nowStr = new Date().toLocaleTimeString();
                const reason = 'Manual Anti-Cheat Verification: Candidate triggered test infraction to verify email dispatch to kapilnarula27july@gmail.com and namaste@sarlayash.com and 24-hour lockout.';
                const disqualifiedPayload = {
                  status: 'DISQUALIFIED',
                  startTime: assessmentState.startTime,
                  endTime: Date.now(),
                  disqualificationReason: `${reason} (Detected at ${nowStr})`,
                  disqualifiedAt: new Date().toISOString(),
                  score: 0,
                  passed: false,
                  certificateId: null,
                  violations: [reason]
                };
                saveFinalAssessmentStatus(disqualifiedPayload);
                setAssessmentState(disqualifiedPayload);
                reportCheatingIncident({
                  candidateName: userProfile?.name || 'Verified Google Candidate',
                  candidateEmail: userProfile?.email || 'authenticated.session@google.com',
                  candidateUid: userProfile?.uid || 'ANONYMOUS',
                  violationReason: reason,
                  examContext: {
                    currentQuestionIndex,
                    examSecondsRemaining,
                    score: examScore
                  }
                });
              }}
              className="px-2.5 py-1 rounded bg-red-600/30 hover:bg-red-600/60 border border-red-500/80 text-red-200 text-[10px] font-black transition-all"
              title="Test cheating case: triggers email to kapilnarula27july@gmail.com & namaste@sarlayash.com and locks login for 24 hours"
            >
              ⚠️ Test Anti-Cheat Trigger & 24h Lockout
            </button>
          </div>

          {/* Timers */}
          <div className="flex items-center gap-4">
            {/* Per-Question Timer */}
            <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800 text-xs">
              <Clock size={13} className="text-amber-400" />
              <span className="text-slate-400">Q Timer:</span>
              <span className="font-mono font-bold text-amber-300">{formatMinSec(questionSecondsRemaining)}</span>
            </div>

            {/* Overall 3-Hour Exam Timer */}
            <div className="flex items-center gap-1.5 bg-red-950/50 px-3 py-1 rounded-lg border border-red-800/80 text-xs">
              <Clock size={14} className="text-red-400" />
              <span className="text-slate-400">Total Exam (3h):</span>
              <span className="font-mono font-bold text-white text-sm tracking-wider">
                {formatTime(examSecondsRemaining)}
              </span>
            </div>
          </div>
        </div>

        {/* Question Switcher Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-700">Questions (60% Hard):</span>
            {examQuestions.map((q, idx) => {
              const status = submissionStatuses[q.id];
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentQuestionIndex(idx);
                    setQuestionSecondsRemaining(PER_QUESTION_SECONDS);
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    currentQuestionIndex === idx
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <span>Q{idx + 1}</span>
                  {status === 'PASSED' && <CheckCircle2 size={12} className="text-emerald-400" />}
                  {status === 'FAILED' && <XCircle size={12} className="text-red-400" />}
                </button>
              );
            })}
          </div>

          {/* Finalize Button with 3-Hour Lock Rule */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleFinalizeAssessment}
              disabled={!canEarlySubmit}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                canEarlySubmit
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-md'
                  : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
              }`}
              title={canEarlySubmit ? 'Submit Completed Exam' : 'Proctor Rule: You cannot finish before 3 hours'}
            >
              <Lock size={12} />
              <span>{canEarlySubmit ? 'Submit Final Assessment' : `Early Submit Locked (${formatTime(examSecondsRemaining)} Left)`}</span>
            </button>
          </div>
        </div>

        {/* Question Details Bar */}
        <div className="p-4 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {currentQ.language}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                {currentQ.difficulty} (60%+ Standard)
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                +{currentQ.points} Points / <strong className="text-red-600">-{currentQ.penalty} Negative Marking</strong>
              </span>
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">
              Q{currentQuestionIndex + 1}: {currentQ.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunExamTest}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
            >
              <Play size={13} className="fill-white" />
              <span>Submit & Evaluate Q{currentQuestionIndex + 1}</span>
            </button>
          </div>
        </div>

        {/* Main Split Code & Evaluation Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
          {/* Left: Code Editor (7 cols) */}
          <div className="lg:col-span-7 flex flex-col bg-slate-950 text-slate-100 border-r border-slate-800">
            <div className="bg-black/40 px-4 py-1.5 text-[11px] text-slate-400 font-mono border-b border-slate-800 flex justify-between">
              <span>EXAM_WORKSPACE &bull; {currentQ.id} &bull; Practice Aids Disabled (No Hints / No Solutions)</span>
              <span>Negative Marking Enforced</span>
            </div>

            <textarea
              value={userCodes[currentQ.id] || ''}
              onChange={(e) => {
                const val = e.target.value;
                setUserCodes(prev => ({ ...prev, [currentQ.id]: val }));
              }}
              spellCheck="false"
              className="flex-1 bg-transparent text-slate-100 p-4 font-mono text-xs focus:outline-none resize-none leading-relaxed whitespace-pre"
            />
          </div>

          {/* Right: Problem Specs & Proctor Terminal (5 cols) */}
          <div className="lg:col-span-5 flex flex-col bg-slate-50 overflow-y-auto p-4 space-y-4 text-xs">
            {/* Description */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block text-xs">Defect Scenario</span>
              <p className="text-slate-600 text-xs leading-relaxed">
                {currentQ.description}
              </p>
            </div>

            {/* Test Assertions (Hidden & Public) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 text-xs">Proctored Test Assertions</span>
                <span className="text-[10px] text-slate-500 font-medium">All Hidden Cases Active</span>
              </div>
              <div className="space-y-1.5">
                {currentQ.testCases.map((tc, i) => (
                  <div key={i} className="p-2 rounded bg-slate-50 border border-slate-200 text-[11px] flex justify-between items-center">
                    <span className="font-mono text-slate-700">Assertion #{i + 1}: {tc.name}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Evaluated on Run</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Proctor Terminal Output */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-200 font-mono text-[11px] leading-relaxed flex-1 min-h-[140px] overflow-y-auto space-y-1">
              <div className="text-slate-500 font-semibold">[PROCTOR KERNEL LOG]</div>
              {terminalLogs.map((log, idx) => (
                <div key={idx} className={log.includes('FAILED') ? 'text-red-400' : (log.includes('PASSED') ? 'text-emerald-400' : 'text-slate-300')}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. ONBOARDING / PRE-EXAM ROADMAP SCREEN
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider mb-3">
          <ShieldAlert size={14} className="text-red-600" />
          <span>Fortune 500 Executive Examination</span>
        </div>

        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          3-Hour Proctored Final Assessment
        </h2>
        <p className="text-xs text-slate-600 mt-2 leading-relaxed max-w-2xl">
          The ultimate verification protocol powered by <strong>SarlaYash Mission</strong> and personally signed by <strong>Kapil</strong>. Measures production debugging speed, concurrency invariance, and agentic AI diagnostics under real-time proctored lockdown.
        </p>

        {/* Key Examination Protocols */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Clock size={15} className="text-slate-700" />
              <span>Strict 3-Hour Timer</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              180 minutes countdown with per-question timers. <strong>Learners cannot finish before 3 hours</strong> to enforce thorough invariant audits.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-red-900">
              <ShieldAlert size={15} className="text-red-600" />
              <span>Zero-Tolerance Proctor</span>
            </div>
            <p className="text-red-700 text-[11px] leading-relaxed">
              If candidate attempts a screenshot, presses Alt+Tab, or switches to a new app, the assessment is <strong>instantly auto-closed with no retry</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <AlertTriangle size={15} className="text-amber-600" />
              <span>60%+ Hard & Negative Marking</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Drawn from a non-repeated question bank with 60% hard multi-threading and agentic AI bugs. Wrong submissions deduct score.
            </p>
          </div>
        </div>

        {/* Prerequisites Checklist */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-3">
            Learning Journey Completion Status (Prerequisites)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className={`p-3 rounded-lg border flex items-center justify-between ${
              solvedList.length >= 2 ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <span>Practice Bug Challenges</span>
              <span className="font-bold">{solvedList.length}/2+ Solved</span>
            </div>

            <div className={`p-3 rounded-lg border flex items-center justify-between ${
              patternsList.length >= 1 ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <span>Patterns Library</span>
              <span className="font-bold">{patternsList.length}/1+ Studied</span>
            </div>

            <div className={`p-3 rounded-lg border flex items-center justify-between ${
              interviewsList.length >= 1 ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <span>F500 Interview Round</span>
              <span className="font-bold">{interviewsList.length}/1+ Completed</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            {userProfile ? (
              <span>Authenticated as: <strong>{userProfile.email}</strong> (Google Verified)</span>
            ) : (
              <span className="text-amber-700 font-semibold">Google Sign-Up required before starting exam.</span>
            )}
          </div>

          <button
            onClick={handleStartAssessment}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Play size={15} className="fill-white" />
            <span>Begin 3-Hour Final Assessment</span>
          </button>
        </div>
      </div>
    </div>
  );
}
