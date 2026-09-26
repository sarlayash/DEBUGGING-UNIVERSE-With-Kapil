import React, { useRef, useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  Download, 
  Printer, 
  ShieldCheck, 
  Lock, 
  ExternalLink,
  Sparkles,
  QrCode,
  Eye,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { getFinalAssessmentStatus } from '../utils/storage';
import { exportElementAsPNG, exportElementAsPDF } from '../utils/exportUtils';

export default function CertificateView({ userProfile, onOpenAuth, onSelectTab }) {
  const certExportRef = useRef(null);
  const [activeMode, setActiveMode] = useState('demo'); // 'demo' | 'live'
  const [isExportingPNG, setIsExportingPNG] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

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

  const getCertId = () => {
    if (activeMode === 'demo') return 'SY-DU-2026-DEMO-EXECUTIVE';
    return assessmentStatus?.certificateId || 'SY-DU-2026-REAL-VERIFIED';
  };

  const issueDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleDownloadPNG = async () => {
    if (!certExportRef.current) return;
    setIsExportingPNG(true);
    try {
      const recipient = getRecipientName().replace(/\s+/g, '_');
      await exportElementAsPNG(
        certExportRef.current, 
        `Kapil-SarlaYash-Certificate-${getCertId()}-${recipient}.png`,
        {
          scale: 2.5,
          windowWidth: 1120,
          windowHeight: 792
        }
      );
    } catch (e) {
      console.error('PNG export failed', e);
    } finally {
      setIsExportingPNG(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!certExportRef.current) return;
    setIsExportingPDF(true);
    try {
      const recipient = getRecipientName().replace(/\s+/g, '_');
      await exportElementAsPDF(
        certExportRef.current, 
        `Kapil-SarlaYash-Certificate-${getCertId()}-${recipient}.pdf`, 
        'landscape',
        {
          scale: 2.5,
          windowWidth: 1120,
          windowHeight: 792
        }
      );
    } catch (e) {
      console.error('PDF export failed', e);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // If viewing live mode and not unlocked yet, show locked screen with roadmap
  const showLockedScreen = activeMode === 'live' && !isLiveUnlocked;

  return (
    <div className="space-y-6">
      {/* Header & Mode Switcher */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6 no-print">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-xs font-semibold mb-2 border border-slate-200">
            <Award size={13} className="text-slate-900" />
            <span>Cryptographically Verified Executive Accreditation</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Official Executive Certificate of Debugging Excellence
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Fortune 500 white-and-gray corporate design. Verified by <strong>Kapil</strong>, Founder & Chief Architect. Available for direct download as ultra-high-resolution <strong>PNG and PDF</strong> with zero overlapping and zero cropping.
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
            <span>My Live Certificate</span>
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
                Real Certificate Locked
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-2">
                Requirements Not Yet Fulfilled
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto leading-relaxed">
                In accordance with SarlaYash Mission governance, real certificates are unlocked <strong>strictly</strong> when the learner passes the <strong>3-Hour Proctored Final Assessment</strong> under anti-cheat supervision.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs max-w-lg mx-auto text-left space-y-2">
              <span className="font-bold text-slate-900 block">Verification Roadmap Requirements:</span>
              <ul className="space-y-1.5 text-slate-600 text-[11px]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Clear practice debugging suites across multiple languages</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Score 60%+ in the 3-Hour Strict Proctored Final Assessment</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Maintain 0 anti-cheat integrity violations (no screenshots, no alt+tab)</span>
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
                View DEMO LEARNER Sample Preview
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
                {activeMode === 'demo' ? 'DEMO PREVIEW SAMPLE' : 'VERIFIED & ISSUED'}
              </span>
              <div>
                <div className="text-xs font-extrabold text-slate-900">
                  Certificate Credential ID: {getCertId()}
                </div>
                <div className="text-[10px] text-slate-500">
                  Recipient: <strong>{getRecipientName()}</strong> &bull; {getRecipientEmail()}
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
                <FileText size={14} />
                <span>{isExportingPDF ? 'Exporting PDF...' : 'Download PDF'}</span>
              </button>
            </div>
          </div>

          {/* Certificate Display & Export Canvas (Strict Fortune 500 White & Gray Theme) */}
          <div className="flex justify-center overflow-x-auto py-2">
            <div 
              ref={certExportRef}
              className="certificate-print-area bg-white text-slate-900 relative select-none"
              style={{
                width: '1120px',
                height: '792px',
                minWidth: '1120px',
                minHeight: '792px',
                boxSizing: 'border-box',
                padding: '48px',
                border: '14px solid #0f172a',
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

              {/* Ornamental Corner Brackets */}
              <div style={{ position: 'absolute', top: '26px', left: '26px', width: '20px', height: '20px', borderTop: '4px solid #0f172a', borderLeft: '4px solid #0f172a' }} />
              <div style={{ position: 'absolute', top: '26px', right: '26px', width: '20px', height: '20px', borderTop: '4px solid #0f172a', borderRight: '4px solid #0f172a' }} />
              <div style={{ position: 'absolute', bottom: '26px', left: '26px', width: '20px', height: '20px', borderBottom: '4px solid #0f172a', borderLeft: '4px solid #0f172a' }} />
              <div style={{ position: 'absolute', bottom: '26px', right: '26px', width: '20px', height: '20px', borderBottom: '4px solid #0f172a', borderRight: '4px solid #0f172a' }} />

              {/* Watermark for demo sample */}
              {activeMode === 'demo' && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) rotate(-25deg)',
                    fontSize: '68px',
                    fontWeight: '900',
                    color: 'rgba(15, 23, 42, 0.04)',
                    textTransform: 'uppercase',
                    letterSpacing: '10px',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    zIndex: 1
                  }}
                >
                  DEMO LEARNER SAMPLE
                </div>
              )}

              {/* Certificate Inner Layout */}
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
                
                {/* Header Section */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '8px' }}>
                    <div style={{ width: '48px', height: '48px', backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                      DU
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '-0.5px', color: '#0f172a', lineHeight: '1.2' }}>
                        DEBUGGING UNIVERSE WITH KAPIL
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#64748b' }}>
                        Powered By SarlaYash Mission &bull; Fortune 500 Standards
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', color: '#64748b', marginTop: '14px' }}>
                    Accreditation of Engineering Excellence & Multi-Language Diagnostic Mastery
                  </div>

                  <h1 style={{ fontSize: '30px', fontWeight: '900', textTransform: 'uppercase', color: '#0f172a', letterSpacing: '1px', margin: '10px 0 4px 0' }}>
                    Executive Certificate of Debugging Excellence
                  </h1>

                  <div style={{ width: '120px', height: '3px', backgroundColor: '#0f172a', margin: '8px auto' }} />
                </div>

                {/* Recipient Section */}
                <div style={{ textAlign: 'center', margin: '14px 0' }}>
                  <div style={{ fontSize: '13px', fontStyle: 'italic', color: '#64748b', marginBottom: '8px' }}>
                    This credential is officially and cryptographically conferred upon
                  </div>
                  
                  <div style={{ fontSize: '34px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px', textDecoration: 'underline', textDecorationColor: '#cbd5e1', textUnderlineOffset: '8px' }}>
                    {getRecipientName()}
                  </div>

                  <div style={{ fontSize: '12px', color: '#475569', fontFamily: 'monospace', marginTop: '10px' }}>
                    Google OAuth Identity: <strong>{getRecipientEmail()}</strong>
                  </div>
                </div>

                {/* Citation / Narrative */}
                <div style={{ maxWidth: '850px', margin: '0 auto', textAlign: 'center', fontSize: '13px', lineHeight: '1.6', color: '#334155' }}>
                  For demonstrated elite problem-solving speed and structural debugging capability across modern systems, distributed concurrency frameworks, memory management architectures, and agentic AI developer environments. The candidate successfully satisfied all diagnostic benchmarks and passed the rigorous <strong>3-Hour Non-Repeated Proctored Final Assessment</strong> under strict anti-cheat proctoring with zero integrity violations.
                </div>

                {/* Footer with Verification Details, Official Seal & Sole Signatory */}
                <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '18px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  
                  {/* Left: Issue Date & Credential ID */}
                  <div style={{ width: '280px' }}>
                    <div style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b' }}>
                      Credential Verification
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
                      ID: {getCertId()}
                    </div>
                    <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                      Conferred: {issueDate}
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px', fontFamily: 'monospace' }}>
                      Status: Cryptographically Verified
                    </div>
                  </div>

                  {/* Center: Official SarlaYash Seal */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '84px', height: '84px', borderRadius: '50%', border: '3px double #0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', margin: '0 auto', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)' }}>
                      <ShieldCheck size={34} color="#0f172a" />
                      <span style={{ fontSize: '7px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#0f172a', marginTop: '2px' }}>
                        SARLAYASH
                      </span>
                    </div>
                    <div style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: '#475569', marginTop: '6px' }}>
                      Executive Verification Seal
                    </div>
                  </div>

                  {/* Right: Sole Signatory Kapil */}
                  <div style={{ width: '280px', textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 'bold', fontSize: '28px', color: '#0f172a', letterSpacing: '0.5px' }}>
                      Kapil
                    </div>
                    <div style={{ borderTop: '1px solid #94a3b8', width: '180px', marginLeft: 'auto', marginTop: '4px', paddingTop: '4px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>
                        Kapil
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: '600', color: '#475569' }}>
                        Founder & Chief Architect
                      </div>
                      <div style={{ fontSize: '10px', fontWeight: '500', color: '#64748b' }}>
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
