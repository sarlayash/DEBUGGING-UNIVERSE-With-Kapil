import React from 'react';
import { Award, ShieldCheck, CheckCircle2, Lock, Sparkles, User, Bot, Zap, Activity, Briefcase, CodeXml } from 'lucide-react';
import { BADGES_DATA } from '../data/badgesData';
import { getEarnedBadges } from '../utils/storage';

export default function BadgesHub({ userProfile, assessmentStatus, onOpenAuth }) {
  const earnedBadges = getEarnedBadges();

  const getIcon = (iconName) => {
    switch(iconName) {
      case 'code-xml': return <CodeXml size={24} />;
      case 'zap': return <Zap size={24} />;
      case 'bot': return <Bot size={24} />;
      case 'activity': return <Activity size={24} />;
      case 'briefcase': return <Briefcase size={24} />;
      case 'award': return <Award size={24} />;
      default: return <Award size={24} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
            <Award size={13} className="text-amber-500" />
            <span>Cryptographically Verified Credentials</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Learner Badges & Official Accreditations
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            All badges are earned strictly through real verified code execution and diagnostic problem solving. Issued exclusively by <strong>Kapil</strong>, Founder & Chief Architect of SarlaYash Mission. No fake people, no inflated numbers.
          </p>
        </div>

        {/* Verification Pill */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Sole Authorized Signatory:</span>
          </div>
          <div className="font-extrabold text-sm text-slate-900">
            Kapil
          </div>
          <div className="text-[10px] text-slate-500">
            SarlaYash Mission Executive Seal
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BADGES_DATA.map((badge) => {
          // Check if earned: executive_debugger requires passing final assessment
          const isEarned = badge.id === 'executive_debugger' 
            ? assessmentStatus?.passed 
            : earnedBadges.includes(badge.id);

          return (
            <div 
              key={badge.id}
              className={`relative bg-white rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 shadow-xs ${
                isEarned 
                  ? 'border-slate-300 ring-1 ring-slate-200 hover:shadow-md' 
                  : 'border-dashed border-slate-200 opacity-60 bg-slate-50/50'
              }`}
            >
              <div>
                {/* Top Badge Icon & Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xs ${
                    isEarned 
                      ? 'bg-slate-900 text-white' 
                      : 'bg-slate-200 text-slate-400'
                  }`}>
                    {getIcon(badge.icon)}
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {badge.tier} Tier
                    </span>
                    {isEarned ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1">
                        <CheckCircle2 size={12} />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded mt-1">
                        <Lock size={11} />
                        Locked
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-sm text-slate-900 mb-1">
                  {badge.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {badge.description}
                </p>

                {/* Criteria */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 mb-4">
                  <strong className="text-slate-800">Criteria:</strong> {badge.criteria}
                </div>
              </div>

              {/* Verified Signatory Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Signatory
                  </div>
                  <div className="font-bold text-slate-900">
                    {badge.signatory}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Authority
                  </div>
                  <div className="font-medium text-slate-600">
                    SarlaYash Mission
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
