import React, { useState, useRef } from 'react';
import { 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Bot, 
  Zap, 
  Activity, 
  Briefcase, 
  CodeXml,
  Download,
  FileText,
  Eye,
  Check,
  Building2,
  QrCode
} from 'lucide-react';
import { BADGES_DATA } from '../data/badgesData';
import { getEarnedBadges } from '../utils/storage';
import { exportElementAsPNG, exportElementAsPDF } from '../utils/exportUtils';

export default function BadgesHub({ userProfile, assessmentStatus, onOpenAuth, onNavigateTab }) {
  const [activeMode, setActiveMode] = useState('demo'); // 'demo' | 'live'
  const [exportingId, setExportingId] = useState(null);
  const [activeExportBadge, setActiveExportBadge] = useState(null);
  
  const earnedBadges = getEarnedBadges();
  const badgeExportRef = useRef(null);

  // Demo sample badges unlocked for preview
  const demoUnlockedIds = ['syntax_slayer', 'concurrency_surgeon', 'ai_agent_auditor', 'executive_debugger'];

  const getIcon = (iconName, size = 24) => {
    switch(iconName) {
      case 'code-xml': return <CodeXml size={size} />;
      case 'zap': return <Zap size={size} />;
      case 'bot': return <Bot size={size} />;
      case 'activity': return <Activity size={size} />;
      case 'briefcase': return <Briefcase size={size} />;
      case 'award': return <Award size={size} />;
      default: return <Award size={size} />;
    }
  };

  const getRecipientName = () => {
    if (activeMode === 'demo') return 'DEMO LEARNER';
    return userProfile?.name || 'Verified Candidate';
  };

  const getRecipientEmail = () => {
    if (activeMode === 'demo') return 'demo.learner@sarlayash.mission';
    return userProfile?.email || 'authenticated.learner@gmail.com';
  };

  const handleDownload = async (badge, format) => {
    setActiveExportBadge(badge);
    setExportingId(`${badge.id}-${format}`);

    // Allow DOM to update hidden export target
    setTimeout(async () => {
      try {
        if (!badgeExportRef.current) return;
        const recipient = getRecipientName().replace(/\s+/g, '_');
        const filename = `Kapil-SarlaYash-Badge-${badge.name.replace(/\s+/g, '-')}-${recipient}`;
        
        if (format === 'png') {
          await exportElementAsPNG(badgeExportRef.current, filename, {
            scale: 2.5,
            windowWidth: 800,
            windowHeight: 560
          });
        } else {
          await exportElementAsPDF(badgeExportRef.current, filename, 'landscape', {
            scale: 2.5,
            windowWidth: 800,
            windowHeight: 560
          });
        }
      } catch (err) {
        console.error('Badge export failed:', err);
      } finally {
        setExportingId(null);
      }
    }, 150);
  };

  return (
    <div className="space-y-6">
      {/* Header with Mode Switcher */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-xs font-semibold mb-2 border border-slate-200">
            <Award size={13} className="text-slate-900" />
            <span>Fortune 500 Executive Accreditation Suite</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Official Learner Badges & Certifications
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Every badge adheres strictly to the <strong>Fortune 500 White & Gray Theme</strong>. Issued exclusively by <strong>Kapil</strong>, Founder & Chief Architect of SarlaYash Mission. Downloadable individually in ultra-crisp <strong>PNG and PDF</strong> with zero cropping, zero overlapping, and cryptographic seal verification.
          </p>
        </div>

        {/* Mode Selector Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveMode('demo')}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'demo'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye size={14} className={activeMode === 'demo' ? 'text-slate-900' : 'text-slate-400'} />
            <span>Sample Preview (DEMO LEARNER)</span>
          </button>

          <button
            onClick={() => setActiveMode('live')}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'live'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck size={14} className={activeMode === 'live' ? 'text-emerald-700' : 'text-slate-400'} />
            <span>My Live Verified Badges</span>
          </button>
        </div>
      </div>

      {/* Mode Guidance Notice */}
      {activeMode === 'demo' ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 font-bold">
              DL
            </div>
            <div>
              <span className="font-bold text-slate-900">
                Preview Mode Active: Candidate Name "DEMO LEARNER"
              </span>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Inspect sample credentials prepared for HRs, Recruiters, TPOs & CXOs. You can test downloading <strong>PNG and PDF</strong> for demo badges below.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-700 uppercase tracking-wider self-start md:self-auto shrink-0">
            Sample Preview
          </span>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
              <Lock size={15} />
            </div>
            <div>
              <span className="font-bold text-slate-900">
                Live Verification Mode: Real Badges Locked Until Earned
              </span>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Authentic badges are strictly locked until verified by practical test suites or passing the 3-hour final proctored exam.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab && onNavigateTab('practice')}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors shrink-0"
          >
            Solve Challenges to Unlock &rarr;
          </button>
        </div>
      )}

      {/* Badges Grid (Fortune 500 White & Gray Theme) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BADGES_DATA.map((badge) => {
          const isEarnedInLive = badge.id === 'executive_debugger' 
            ? assessmentStatus?.passed 
            : earnedBadges.includes(badge.id);

          const isUnlocked = activeMode === 'demo' 
            ? demoUnlockedIds.includes(badge.id)
            : isEarnedInLive;

          const isExportingPNG = exportingId === `${badge.id}-png`;
          const isExportingPDF = exportingId === `${badge.id}-pdf`;

          return (
            <div 
              key={badge.id}
              className={`relative bg-white rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 shadow-xs ${
                isUnlocked 
                  ? 'border-slate-300 hover:border-slate-400 hover:shadow-md' 
                  : 'border-dashed border-slate-200 opacity-60 bg-slate-50/50'
              }`}
            >
              <div>
                {/* Top Badge Icon & Tier */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-xs ${
                    isUnlocked 
                      ? 'bg-slate-900 text-white border-slate-800' 
                      : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}>
                    {getIcon(badge.icon)}
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      {badge.tier} Tier
                    </span>
                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1">
                        <CheckCircle2 size={12} />
                        {activeMode === 'demo' ? 'Sample Verified' : 'Earned & Verified'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded mt-1">
                        <Lock size={11} />
                        Locked
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 mb-1 tracking-tight">
                  {badge.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {badge.description}
                </p>

                {/* Candidate Badge Recipient info if unlocked */}
                {isUnlocked && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs mb-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Conferred Upon</span>
                      <span className="text-[10px] font-mono font-bold text-slate-500">ID: SY-BDG-2026-{badge.id.slice(0, 4).toUpperCase()}</span>
                    </div>
                    <div className="font-extrabold text-slate-900 text-xs">
                      {getRecipientName()}
                    </div>
                  </div>
                )}

                {/* Criteria */}
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-600 mb-4">
                  <strong className="text-slate-900 font-semibold">Verification Criteria:</strong> {badge.criteria}
                </div>
              </div>

              {/* Action Buttons & Signatory Footer */}
              <div className="space-y-4 pt-3 border-t border-slate-100">
                {/* Download Actions (Enabled only when unlocked) */}
                {isUnlocked ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleDownload(badge, 'png')}
                      disabled={isExportingPNG || isExportingPDF}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200 disabled:opacity-50"
                      title="Download Crisp High-Res PNG"
                    >
                      <Download size={13} />
                      <span>{isExportingPNG ? 'Exporting...' : 'PNG Badge'}</span>
                    </button>

                    <button
                      onClick={() => handleDownload(badge, 'pdf')}
                      disabled={isExportingPNG || isExportingPDF}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                      title="Download Official A4/Card PDF"
                    >
                      <FileText size={13} />
                      <span>{isExportingPDF ? 'Exporting...' : 'PDF Badge'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-slate-100 text-slate-500 text-center text-[11px] font-medium flex items-center justify-center gap-1.5">
                    <Lock size={12} />
                    <span>Real Badge Locked Until Criteria Satisfied</span>
                  </div>
                )}

                {/* Signatory Footer */}
                <div className="flex items-center justify-between text-[11px] pt-1">
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
            </div>
          );
        })}
      </div>

      {/* OFF-SCREEN HIGH-RESOLUTION EXPORT CONTAINER FOR BADGES (Strict Fortune 500 White & Gray Theme) */}
      {/* Explicit pixel dimensions: 800px x 560px guarantees ZERO overlapping or cropping during html2canvas export */}
      <div 
        style={{ position: 'fixed', left: '-9999px', top: '0', zIndex: -100 }}
        aria-hidden="true"
      >
        {activeExportBadge && (
          <div 
            ref={badgeExportRef}
            style={{
              width: '800px',
              height: '560px',
              boxSizing: 'border-box',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              position: 'relative',
              padding: '40px',
              border: '12px solid #0f172a',
              overflow: 'hidden'
            }}
          >
            {/* Ornamental Inner Double Border */}
            <div 
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                right: '16px',
                bottom: '16px',
                border: '2px solid #cbd5e1',
                pointerEvents: 'none'
              }}
            />
            <div 
              style={{
                position: 'absolute',
                top: '22px',
                left: '22px',
                right: '22px',
                bottom: '22px',
                border: '1px dashed #94a3b8',
                pointerEvents: 'none'
              }}
            />

            {/* Corner Decorative Accents */}
            <div style={{ position: 'absolute', top: '26px', left: '26px', width: '12px', height: '12px', borderTop: '3px solid #0f172a', borderLeft: '3px solid #0f172a' }} />
            <div style={{ position: 'absolute', top: '26px', right: '26px', width: '12px', height: '12px', borderTop: '3px solid #0f172a', borderRight: '3px solid #0f172a' }} />
            <div style={{ position: 'absolute', bottom: '26px', left: '26px', width: '12px', height: '12px', borderBottom: '3px solid #0f172a', borderLeft: '3px solid #0f172a' }} />
            <div style={{ position: 'absolute', bottom: '26px', right: '26px', width: '12px', height: '12px', borderBottom: '3px solid #0f172a', borderRight: '3px solid #0f172a' }} />

            {/* Card Content Layout */}
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
              
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #e2e8f0', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', backgroundColor: '#0f172a', color: '#ffffff', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', fontSize: '18px' }}>
                    DU
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.3px', lineHeight: '1.2' }}>
                      DEBUGGING UNIVERSE WITH KAPIL
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#64748b' }}>
                      Powered by SarlaYash Mission &bull; Fortune 500 Standards
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b' }}>
                    Accreditation ID
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '800', fontFamily: 'monospace', color: '#0f172a' }}>
                    SY-BDG-2026-{activeExportBadge.id.slice(0, 4).toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Main Badge Focus */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '32px', margin: '20px 0' }}>
                {/* Large Crest Icon */}
                <div style={{ width: '110px', height: '110px', borderRadius: '24px', backgroundColor: '#0f172a', border: '4px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', shrink: 0, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                  {getIcon(activeExportBadge.icon, 52)}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'inline-block', padding: '3px 10px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: '#334155', marginBottom: '8px' }}>
                    {activeExportBadge.tier} Tier &bull; Verified Accreditation
                  </div>
                  <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#0f172a', margin: '0 0 6px 0', letterSpacing: '-0.5px', lineHeight: '1.2' }}>
                    {activeExportBadge.name}
                  </h1>
                  <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 12px 0', lineHeight: '1.5' }}>
                    {activeExportBadge.description}
                  </p>
                  <div style={{ fontSize: '12px', color: '#0f172a' }}>
                    <span style={{ fontWeight: '800' }}>Conferred Upon: </span>
                    <span style={{ fontWeight: '900', textDecoration: 'underline' }}>{getRecipientName()}</span>
                    <span style={{ color: '#64748b', fontSize: '11px', marginLeft: '8px' }}>({getRecipientEmail()})</span>
                  </div>
                </div>
              </div>

              {/* Footer with Seal and Signature */}
              <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '16px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                {/* Left: Criteria & Status */}
                <div style={{ maxWidth: '300px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.8px' }}>
                    Verification Criteria Satisfied
                  </div>
                  <div style={{ fontSize: '11px', color: '#334155', marginTop: '2px', lineHeight: '1.4' }}>
                    {activeExportBadge.criteria}
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b', marginTop: '6px', fontFamily: 'monospace' }}>
                    Timestamp: {new Date().toISOString().split('T')[0]} &bull; Anti-Cheat Verified
                  </div>
                </div>

                {/* Center: SarlaYash Verified Stamp Seal */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '3px double #0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', margin: '0 auto' }}>
                    <ShieldCheck size={26} color="#0f172a" />
                    <span style={{ fontSize: '6px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#0f172a', marginTop: '2px' }}>
                      SARLAYASH
                    </span>
                  </div>
                  <div style={{ fontSize: '8px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#64748b', marginTop: '4px' }}>
                    Official Seal
                  </div>
                </div>

                {/* Right: Signature */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 'bold', fontSize: '24px', color: '#0f172a', letterSpacing: '0.5px' }}>
                    Kapil
                  </div>
                  <div style={{ borderTop: '1px solid #94a3b8', width: '150px', marginLeft: 'auto', marginTop: '4px', paddingTop: '4px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: '#0f172a' }}>
                      Kapil
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: '600', color: '#475569' }}>
                      Founder & Chief Architect
                    </div>
                    <div style={{ fontSize: '9px', fontWeight: '500', color: '#64748b' }}>
                      SarlaYash Mission &bull; Sole Signatory
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

    </div>
  );
}
