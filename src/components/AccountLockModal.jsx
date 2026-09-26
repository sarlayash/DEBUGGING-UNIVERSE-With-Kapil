import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Clock, 
  AlertTriangle, 
  Mail, 
  CheckCircle2, 
  XCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { getAccountLock, clearAccountLock } from '../utils/storage';
import { NOTIFIED_SECURITY_EMAILS } from '../utils/antiCheatService';

export default function AccountLockModal({ isOpen, onClose, userProfile, onForceRefresh }) {
  const [lockInfo, setLockInfo] = useState(getAccountLock());
  const [timeLeft, setTimeLeft] = useState({ hours: 24, minutes: 0, seconds: 0 });

  // Update countdown every second
  useEffect(() => {
    const updateCountdown = () => {
      const lock = getAccountLock();
      setLockInfo(lock);

      if (!lock.isLocked) {
        if (onForceRefresh) onForceRefresh();
        return;
      }

      const totalSec = Math.max(0, Math.floor(lock.remainingMs / 1000));
      const hours = Math.floor(totalSec / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;

      setTimeLeft({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen && !lockInfo.isLocked) return null;

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full border-4 border-red-600 shadow-2xl overflow-hidden flex flex-col text-slate-900 select-none">
        
        {/* Top Emergency Red Header */}
        <div className="bg-red-600 text-white p-6 text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-white/10 mx-auto flex items-center justify-center border-2 border-white/20 shadow-inner">
            <ShieldAlert size={36} className="text-white animate-pulse" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-white text-[11px] font-extrabold uppercase tracking-widest">
            <Lock size={12} />
            <span>Anti-Cheat Security Lockdown</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
            Account Access Locked (24 Hours)
          </h2>
          <p className="text-xs text-red-100 max-w-md mx-auto leading-relaxed">
            The Proctoring Engine detected a severe examination integrity violation during assessment.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* 24-Hour Live Countdown Clock */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Clock size={14} className="text-red-600" />
              <span>Lockout Time Remaining</span>
            </div>
            <div className="font-mono text-3xl sm:text-4xl font-black text-slate-900 tracking-wider">
              {pad(timeLeft.hours)} : {pad(timeLeft.minutes)} : {pad(timeLeft.seconds)}
            </div>
            <div className="text-[11px] text-slate-500">
              Access restored on: <strong>{lockInfo.expiresDateStr || 'After 24 Hours'}</strong>
            </div>
          </div>

          {/* Infraction Details */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Violation Details
            </div>
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-start gap-2 text-red-900">
                <AlertTriangle size={16} className="text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Detected Infraction: </span>
                  <span>{lockInfo.reason || 'Proctoring protocol breach'}</span>
                </div>
              </div>
              <div className="text-[11px] text-red-700 pl-6">
                Candidate: <strong>{userProfile?.name || 'Candidate'}</strong> ({userProfile?.email || 'learner@google.com'})
              </div>
            </div>
          </div>

          {/* Official Email Notification Dispatched Banner */}
          <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <CheckCircle2 size={16} />
              <span>Incident Dispatched to Authorized Signatories</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              In accordance with SarlaYash Mission compliance, a forensic audit record and disqualification alert have been transmitted to:
            </p>
            <div className="space-y-1 font-mono text-[11px] text-slate-200 pl-2 border-l-2 border-slate-700">
              {NOTIFIED_SECURITY_EMAILS.map((email) => (
                <div key={email} className="flex items-center gap-1.5">
                  <Mail size={12} className="text-slate-400" />
                  <span>{email}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Policy Note */}
          <div className="text-center text-[11px] text-slate-500 leading-relaxed">
            Zero retries are permitted during the active 24-hour quarantine window. All evaluations and certifications remain blocked until expiration.
          </div>

          {/* Close/Acknowledge Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                if (onClose) onClose();
              }}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs"
            >
              Acknowledge 24-Hour Penalty & Close Notice
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
