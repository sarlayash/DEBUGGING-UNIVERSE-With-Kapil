import React from 'react';
import { 
  Search, 
  Disc3, 
  Flame, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle,
  User,
  LogOut,
  HelpCircle,
  Clock,
  Compass,
  Map
} from 'lucide-react';

export default function Header({ 
  userProfile, 
  onOpenAuth, 
  onLogout,
  onOpenWheel, 
  onOpenTour,
  onOpenSitemap,
  stats, 
  searchQuery, 
  setSearchQuery,
  negativeMarkingEnabled,
  setNegativeMarkingEnabled
}) {
  return (
    <header className="sticky top-0 z-10 bg-white f500-header-border px-6 py-3 flex items-center justify-between gap-4">
      {/* Search Input */}
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search bugs, languages (Python, Go, C++, Rust), or AI portals (Cursor, Claude Code)..."
          className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all"
        />
      </div>

      {/* Center / Right Control Panel */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Demo Tour Button */}
        <button
          onClick={onOpenTour}
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
          title="Start Guided Platform Tour"
        >
          <Compass size={14} className="text-blue-600" />
          <span>Demo Tour</span>
        </button>

        {/* Sitemap Button */}
        <button
          onClick={onOpenSitemap}
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
          title="Open Full Architectural Sitemap"
        >
          <Map size={14} className="text-emerald-600" />
          <span>Sitemap</span>
        </button>

        {/* Negative Marking Rule Indicator */}
        <div 
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-[11px] text-slate-700"
          title="Strict Fortune 500 Evaluation: Incorrect submissions penalize IQ score"
        >
          <AlertTriangle size={13} className="text-amber-600" />
          <span>Negative Marking: <strong className="text-slate-900">Active (-10 XP)</strong></span>
        </div>

        {/* Bonus Spinning Wheel Trigger */}
        <button
          onClick={onOpenWheel}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 hover:border-amber-300 text-xs font-semibold text-amber-900 transition-all shadow-xs group"
          title="Spin the Fortune 500 Bonus Wheel"
        >
          <Disc3 size={15} className="text-amber-600 group-hover:rotate-180 transition-transform duration-500" />
          <span>Bonus Wheel</span>
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
        </button>

        {/* Stats Pill */}
        <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center gap-1.5 text-slate-700" title="Debugging IQ (Net Score after Negative Marking)">
            <Sparkles size={14} className="text-amber-500" />
            <span className="font-bold text-slate-900">{stats.xp}</span> IQ
          </div>
          <div className="w-px h-3.5 bg-slate-200" />
          <div className="flex items-center gap-1.5 text-slate-700" title="Active Learning Streak">
            <Flame size={14} className="text-orange-500" />
            <span className="font-bold text-slate-900">{stats.streak}</span> Days
          </div>
        </div>

        {/* Google User Profile Chip */}
        {userProfile ? (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="flex items-center gap-2">
              {userProfile.photo ? (
                <img 
                  src={userProfile.photo} 
                  alt={userProfile.name} 
                  className="w-7 h-7 rounded-full border border-slate-300 object-cover" 
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-[10px]">
                  {userProfile.name?.charAt(0) || 'U'}
                </div>
              )}
              <div className="hidden lg:block text-left leading-none">
                <div className="text-xs font-semibold text-slate-900 truncate max-w-[120px]">
                  {userProfile.name}
                </div>
                <div className="text-[10px] text-emerald-600 font-medium">
                  Google Verified
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
              title="Sign Out"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-all shadow-xs"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span className="hidden sm:inline">Google Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
