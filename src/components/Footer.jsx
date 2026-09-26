import React from 'react';
import { Shield, Award, Terminal, Lock, ExternalLink } from 'lucide-react';

export default function Footer({ onOpenAuth, onSelectTab }) {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Mission & Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                DU
              </div>
              <span className="font-bold text-slate-900 text-sm tracking-tight">
                DEBUGGING UNIVERSE
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Powered By <strong className="text-slate-800">SarlaYash Mission</strong>. Dedicated to building world-class software reliability, distributed systems mastery, and agentic AI debugging excellence.
            </p>
            <div className="text-[11px] text-slate-700 font-medium">
              Sole Signatory: <strong className="text-slate-900">Kapil</strong> (Founder & Chief Architect)
            </div>
          </div>

          {/* Academic & Curriculum Standards */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Curriculum Tracks
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button onClick={() => onSelectTab('practice')} className="hover:text-slate-900 transition-colors">
                  Multi-Language Systems (Go, Rust, C++, Java)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('practice')} className="hover:text-slate-900 transition-colors">
                  Agentic AI Portals (Claude Code, Cursor, Gemini)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('patterns')} className="hover:text-slate-900 transition-colors">
                  Software Diagnostic Patterns Catalog
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('shortcuts')} className="hover:text-slate-900 transition-colors">
                  IDE & GDB Low-Level Debugging Shortcuts
                </button>
              </li>
            </ul>
          </div>

          {/* Proctoring & Examination Integrity */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Examination Integrity
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li className="flex items-center gap-1.5 text-slate-500">
                <Lock size={12} className="text-slate-400" />
                <span>Strict 3-Hour Time Clock (No Early Finish)</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-500">
                <Shield size={12} className="text-slate-400" />
                <span>Anti-Screenshot & Alt-Tab Lockdown</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-500">
                <Terminal size={12} className="text-slate-400" />
                <span>Hidden Edge-Case Test Suites</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-500">
                <Award size={12} className="text-slate-400" />
                <span>Sole Authorized Signatory: Kapil</span>
              </li>
            </ul>
          </div>

          {/* Verification & Placement */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Fortune 500 Placement
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Certification issued exclusively to verified Google accounts that demonstrate full mastery and complete the final 3-hour non-repeated proctored challenge.
            </p>
            <div className="pt-1">
              <button 
                onClick={() => onSelectTab('certificate')}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-900 hover:underline"
              >
                Inspect Certificate Verification Standards &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; 2026 <strong>DEBUGGING UNIVERSE With Kapil</strong>. Powered By <strong>SarlaYash Mission</strong>. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Proctoring Engine Online
            </span>
            <span>Google Single Sign-On Enforced</span>
            <span>Version 2.6.4 (Enterprise)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
