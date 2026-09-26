import React, { useRef, useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  ShieldCheck, 
  Lock, 
  Eye, 
  Award, 
  Building2, 
  QrCode,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import { getFinalAssessmentStatus } from '../utils/storage';
import { exportElementAsPDF, exportElementAsPNG } from '../utils/exportUtils';

export default function LorView({ userProfile, onOpenAuth, onSelectTab }) {
  const lorExportRef = useRef(null);
  const [activeMode, setActiveMode] = useState('demo'); // 'demo' | 'live'
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingPNG, setIsExportingPNG] = useState(false);

  const assessmentStatus = getFinalAssessmentStatus();
  const isLiveUnlocked = assessmentStatus?.passed;

  const getRecipientName = () => {
    if (activeMode === 'demo') return 'DEMO LEARNER';
    return userProfile?.name || 'Verified Google Candidate';
  };

  const getRecipientEmail = () => {
    if (activeMode === 'demo') return 'demo.learner@sarlayash.mission';
    return userProfile?.email || 'authenticated.learner@gmail.com';
  };

  const getLorRefId = () => {
    if (activeMode === 'demo') return 'SY-LOR-2026-DEMO-9941';
    return `SY-LOR-2026-REAL-${(userProfile?.uid || 'KAPIL').slice(0, 5).toUpperCase()}`;
  };

  const issueDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleDownloadPDF = async () => {
    if (!lorExportRef.current) return;
    setIsExportingPDF(true);
    try {
      const recipient = getRecipientName().replace(/\s+/g, '_');
      await exportElementAsPDF(
        lorExportRef.current,
        `Kapil-SarlaYash-LOR-${getLorRefId()}-${recipient}.pdf`,
        'portrait',
        {
          scale: 2.5,
          windowWidth: 794,
          windowHeight: 1123
        }
      );
    } catch (e) {
      console.error('LOR PDF export failed', e);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleDownloadPNG = async () => {
    if (!lorExportRef.current) return;
    setIsExportingPNG(true);
    try {
      const recipient = getRecipientName().replace(/\s+/g, '_');
      await exportElementAsPNG(
        lorExportRef.current,
        `Kapil-SarlaYash-LOR-${getLorRefId()}-${recipient}.png`,
        {
          scale: 2.5,
          windowWidth: 794,
          windowHeight: 1123
        }
      );
    } catch (e) {
      console.error('LOR PNG export failed', e);
    } finally {
      setIsExportingPNG(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const showLockedScreen = activeMode === 'live' && !isLiveUnlocked;

  return (
    <div className="space-y-6">
      {/* Header & Mode Switcher */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6 no-print">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-xs font-semibold mb-2 border border-slate-200">
            <FileText size={13} className="text-slate-900" />
            <span>Executive Endorsement Document</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Official Letter of Recommendation (LOR)
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Written and signed personally by <strong>Kapil</strong>, Founder & Chief Architect. Formatted in Fortune 500 executive white-and-gray letterhead. Bordered, sealed, and downloadable individually as an official <strong>PDF</strong> with zero formatting or overlapping issues.
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
            <span>My Live LOR</span>
          </button>
        </div>
      </div>

      {/* Locked Screen for Live Mode */}
      {showLockedScreen ? (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto border border-slate-200">
              <Lock size={28} />
            </div>

            <div>
              <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                Real LOR Locked
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-2">
                Executive Recommendation Requires Verified Clearance
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto leading-relaxed">
                Letters of Recommendation are issued exclusively by Kapil upon verified completion of the learning journey and successful graduation from the <strong>3-Hour Strict Proctored Final Assessment</strong>.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs max-w-lg mx-auto text-left space-y-2">
              <span className="font-bold text-slate-900 block">Eligibility Requirements:</span>
              <ul className="space-y-1.5 text-slate-600 text-[11px]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Demonstrate zero-defect diagnostic execution across multi-language tracks</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Pass the 3-Hour Proctored Final Assessment</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Zero anti-cheat disqualifications</span>
                </li>
              </ul>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => onSelectTab('assessment')}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
              >
                Go to 3-Hour Final Assessment &rarr;
              </button>
              <button
                onClick={() => setActiveMode('demo')}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200"
              >
                Inspect Sample Preview (DEMO LEARNER)
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Action Toolbar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 no-print">
            <div className="flex items-center gap-3">
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded border ${
                activeMode === 'demo'
                  ? 'bg-slate-100 text-slate-800 border-slate-300'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
                {activeMode === 'demo' ? 'DEMO SAMPLE PREVIEW' : 'OFFICIAL REAL LOR'}
              </span>
              <div>
                <div className="text-xs font-extrabold text-slate-900">
                  Document Reference: {getLorRefId()}
                </div>
                <div className="text-[10px] text-slate-500">
                  Candidate: <strong>{getRecipientName()}</strong> &bull; {getRecipientEmail()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-2xs"
              >
                <Printer size={14} />
                <span>Print</span>
              </button>

              <button
                onClick={handleDownloadPNG}
                disabled={isExportingPNG}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200 disabled:opacity-50"
              >
                <ImageIcon size={14} />
                <span>{isExportingPNG ? 'Exporting PNG...' : 'Download PNG'}</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={isExportingPDF}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
              >
                <Download size={14} />
                <span>{isExportingPDF ? 'Exporting PDF...' : 'Download LOR in PDF'}</span>
              </button>
            </div>
          </div>

          {/* LOR Printable & Export Canvas (Strict Fortune 500 White & Gray Theme) */}
          <div className="flex justify-center overflow-x-auto py-2">
            <div 
              ref={lorExportRef}
              className="lor-print-area bg-white text-slate-900 relative select-none"
              style={{
                width: '794px',
                height: '1123px',
                minWidth: '794px',
                minHeight: '1123px',
                boxSizing: 'border-box',
                padding: '48px 52px',
                border: '10px solid #0f172a',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#ffffff'
              }}
            >
              {/* Inner Ornamental Double Borders */}
              <div 
                style={{
                  position: 'absolute',
                  top: '14px',
                  left: '14px',
                  right: '14px',
                  bottom: '14px',
                  border: '2px solid #cbd5e1',
                  pointerEvents: 'none'
                }} 
              />
              <div 
                style={{
                  position: 'absolute',
                  top: '18px',
                  left: '18px',
                  right: '18px',
                  bottom: '18px',
                  border: '1px dashed #94a3b8',
                  pointerEvents: 'none'
                }} 
              />

              {/* Watermark for demo sample */}
              {activeMode === 'demo' && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) rotate(-35deg)',
                    fontSize: '52px',
                    fontWeight: '900',
                    color: 'rgba(15, 23, 42, 0.035)',
                    textTransform: 'uppercase',
                    letterSpacing: '8px',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    zIndex: 1
                  }}
                >
                  DEMO LEARNER SAMPLE
                </div>
              )}

              {/* LOR Document Content */}
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
                
                {/* Header Letterhead */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '3px double #0f172a', paddingBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '44px', height: '44px', backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '18px' }}>
                        SY
                      </div>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: '900', letterSpacing: '-0.3px', color: '#0f172a', lineHeight: '1.2' }}>
                          SARLAYASH GLOBAL TECH MISSION
                        </div>
                        <div style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b' }}>
                          Office of the Chief Architect &bull; Executive Engineering Council
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.8px' }}>
                        Confidential Reference
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: '800', fontFamily: 'monospace', color: '#0f172a' }}>
                        {getLorRefId()}
                      </div>
                      <div style={{ fontSize: '10px', color: '#475569' }}>
                        Date: {issueDate}
                      </div>
                    </div>
                  </div>

                  {/* Addressee & Subject */}
                  <div style={{ marginTop: '20px', marginBottom: '14px' }}>
                    <div style={{ fontSize: '11px', color: '#475569', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      To: Global Engineering Recruitment Committees, Enterprise Hiring Partners & Chief Technology Officers
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                      From: <strong>Kapil</strong>, Founder & Chief Architect, SarlaYash Mission
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '900', color: '#0f172a', marginTop: '12px', paddingBottom: '6px', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Subject: Official Letter of Recommendation for {getRecipientName()}
                    </div>
                  </div>

                  {/* Letter Body Text */}
                  <div style={{ fontSize: '12px', lineHeight: '1.65', color: '#334155', textAlign: 'justify', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <p>
                      It is my distinct privilege as the Founder and Chief Architect of <strong>SarlaYash Mission</strong> to provide this formal recommendation for <strong>{getRecipientName()}</strong> ({getRecipientEmail()}). Having closely evaluated their diagnostic progression and code triage capabilities within the <strong>Debugging Universe with Kapil</strong> curriculum, I can state with full confidence that this candidate represents the top tier of analytical engineering talent.
                    </p>

                    <p>
                      In modern enterprise software development, the true cost of failure stems not from feature velocity, but from production regressions, concurrency deadlocks, and unhandled memory allocations. Within our rigorous curriculum, <strong>{getRecipientName()}</strong> demonstrated exceptional diagnostic problem-solving across 14+ technical domains—ranging from low-level memory inspection (C/C++), distributed thread safety (Java, Python Asyncio, Go), and database locking hierarchies (SQL), to modern agentic AI development portals (Claude Code, Cursor, Antigravity, and Copilot).
                    </p>

                    <p>
                      Most critically, the candidate cleared our proctored <strong>3-Hour Strict Non-Repeated Final Assessment</strong>. This evaluation enforces strict negative-marking penalties for speculative attempts and operates under active anti-cheat integrity monitoring (zero tolerance for tab-switching or unauthorized tooling). <strong>{getRecipientName()}</strong> maintained an exemplary record of 100% integrity and demonstrated a systematic, hypothesis-driven methodology for uncovering root causes.
                    </p>

                    <p>
                      Engineers of this caliber do not merely write code; they defend production reliability, slash Mean-Time-To-Resolution (MTTR), and establish defensible architecture. I extend my highest, unreserved recommendation for <strong>{getRecipientName()}</strong> for Senior Software Engineer, Software Reliability Engineer (SRE), or Core Infrastructure positions at any Fortune 500 enterprise.
                    </p>
                  </div>
                </div>

                {/* Footer Section with Seal and Signature */}
                <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '16px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  
                  {/* Left: Contact & Verification */}
                  <div style={{ width: '220px' }}>
                    <div style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#64748b' }}>
                      Verification Portal
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#0f172a', marginTop: '2px' }}>
                      SarlaYash Accreditation Registry
                    </div>
                    <div style={{ fontSize: '10px', color: '#475569', marginTop: '2px', fontFamily: 'monospace' }}>
                      Ref: {getLorRefId()}
                    </div>
                    <div style={{ fontSize: '9px', color: '#64748b', marginTop: '4px' }}>
                      Sole Signatory Verification Active
                    </div>
                  </div>

                  {/* Center: Official Seal */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '74px', height: '74px', borderRadius: '50%', border: '3px double #0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', margin: '0 auto' }}>
                      <ShieldCheck size={30} color="#0f172a" />
                      <span style={{ fontSize: '6px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.6px', color: '#0f172a', marginTop: '2px' }}>
                        SARLAYASH
                      </span>
                    </div>
                    <div style={{ fontSize: '8px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#475569', marginTop: '4px' }}>
                      Official LOR Seal
                    </div>
                  </div>

                  {/* Right: Signature Kapil */}
                  <div style={{ width: '220px', textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 'bold', fontSize: '26px', color: '#0f172a', letterSpacing: '0.5px' }}>
                      Kapil
                    </div>
                    <div style={{ borderTop: '1px solid #94a3b8', width: '160px', marginLeft: 'auto', marginTop: '4px', paddingTop: '4px' }}>
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
          </div>
        </>
      )}
    </div>
  );
}
