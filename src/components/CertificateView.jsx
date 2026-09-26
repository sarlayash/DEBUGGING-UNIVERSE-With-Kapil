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
  QrCode
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { getFinalAssessmentStatus } from '../utils/storage';

export default function CertificateView({ userProfile, onOpenAuth, onSelectTab }) {
  const certRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const assessmentStatus = getFinalAssessmentStatus();

  const isUnlocked = assessmentStatus?.passed;
  const certId = assessmentStatus?.certificateId || 'SY-DU-2026-PENDING';
  const issueDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleDownloadPDF = async () => {
    if (!certRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, (210 - imgHeight) / 2, imgWidth, imgHeight);
      pdf.save(`Kapil-SarlaYash-Debugging-Certificate-${certId}.pdf`);
    } catch (e) {
      console.error('PDF export failed', e);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isUnlocked) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto border border-slate-200">
            <Lock size={28} />
          </div>

          <div>
            <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
              Credential Locked
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-2">
              Official Executive Certificate of Debugging Excellence
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto leading-relaxed">
              In accordance with SarlaYash Mission standards, certificates are awarded <strong>only</strong> when the complete learning journey is fulfilled and the candidate passes the <strong>3-Hour Proctored Final Assessment</strong>.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs max-w-lg mx-auto text-left space-y-2">
            <span className="font-bold text-slate-900 block">Verification Roadmap Requirements:</span>
            <ul className="space-y-1 text-slate-600 text-[11px]">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>Complete practice challenges with 0 unhandled defects</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>Pass the 3-Hour Strict Proctored Final Assessment</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>Maintain 0 anti-cheat integrity violations (no screenshots, no Alt+Tab)</span>
              </li>
            </ul>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onSelectTab('assessment')}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
            >
              Go to 3-Hour Final Assessment &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 no-print">
        <div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Verified & Issued
          </span>
          <h2 className="text-base font-bold text-slate-900 mt-1">
            Certificate ID: {certId}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
          >
            <Printer size={14} />
            <span>Print</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
          >
            <Download size={14} />
            <span>{isExporting ? 'Generating PDF...' : 'Download PDF Certificate'}</span>
          </button>
        </div>
      </div>

      {/* The Printable / PDF Certificate Canvas (Fortune 500 White & Grey Theme) */}
      <div className="flex justify-center">
        <div 
          ref={certRef}
          className="certificate-print-area w-full max-w-4xl bg-white border-8 border-slate-100 p-10 sm:p-14 shadow-2xl relative text-slate-900 select-none overflow-hidden"
          style={{ minHeight: '620px' }}
        >
          {/* Inner subtle ornamental border */}
          <div className="absolute inset-4 border border-slate-300 pointer-events-none" />
          <div className="absolute inset-5 border border-dashed border-slate-200 pointer-events-none" />

          {/* Certificate Header */}
          <div className="text-center relative z-10 space-y-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-black flex items-center justify-center text-sm shadow-md">
                DU
              </div>
              <div className="text-left leading-tight">
                <div className="font-extrabold text-sm tracking-tight text-slate-900">
                  DEBUGGING UNIVERSE
                </div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                  With Kapil
                </div>
              </div>
            </div>

            <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Powered By SarlaYash Mission &bull; Fortune 500 Software Reliability Accreditation
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-4 uppercase">
              Certificate of Executive Excellence
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              In Multi-Language Systems Debugging & Agentic AI Reliability
            </p>
          </div>

          {/* Recipient */}
          <div className="text-center my-8 relative z-10 space-y-2">
            <p className="text-xs text-slate-500 italic">
              This credential is officially conferred upon
            </p>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight underline decoration-slate-300 decoration-1 underline-offset-8">
              {userProfile?.name || 'Verified Google Candidate'}
            </div>
            <p className="text-xs text-slate-600 font-mono pt-1">
              Google Account: {userProfile?.email || 'Authenticated Learner'}
            </p>
          </div>

          {/* Accreditations Text */}
          <div className="text-center max-w-2xl mx-auto my-6 relative z-10 text-xs text-slate-600 leading-relaxed">
            Having successfully satisfied all curriculum milestones across distributed systems (Go, Rust, C++, Java), database locking hierarchies, and modern agentic AI developer tooling (Cursor, Claude Code, Antigravity). The candidate cleared the proctored <strong>3-Hour Strict Non-Repeated Final Assessment</strong> with 60%+ Hard question complexity under verified anti-cheat integrity monitoring.
          </div>

          {/* Certificate Signatures & Security Footer */}
          <div className="mt-12 pt-6 border-t border-slate-200 grid grid-cols-3 items-end relative z-10 text-xs">
            {/* Left: Verification & Date */}
            <div className="space-y-1">
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Issue Date
              </div>
              <div className="font-bold text-slate-800 text-xs">
                {issueDate}
              </div>
              <div className="font-mono text-[10px] text-slate-500 pt-1">
                ID: {certId}
              </div>
            </div>

            {/* Center: Official Seal */}
            <div className="text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border-2 border-slate-800 flex items-center justify-center bg-slate-50 shadow-inner">
                <ShieldCheck size={28} className="text-slate-900" />
              </div>
              <div className="text-[9px] font-bold uppercase tracking-widest text-slate-600 mt-1">
                SarlaYash Verified Seal
              </div>
            </div>

            {/* Right: Sole Signatory Kapil */}
            <div className="text-right space-y-1">
              {/* Elegant script-style digital signature */}
              <div className="font-serif italic font-bold text-2xl text-slate-900 tracking-wide">
                Kapil
              </div>
              <div className="border-t border-slate-300 w-36 ml-auto pt-1" />
              <div className="font-bold text-slate-900 text-xs">
                Kapil
              </div>
              <div className="text-[10px] text-slate-500">
                Founder & Chief Architect
              </div>
              <div className="text-[9px] text-slate-400">
                SarlaYash Mission &bull; Sole Signatory
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
