import React from 'react';
import { 
  Code2, 
  Terminal, 
  BookOpen, 
  Keyboard, 
  Briefcase, 
  Disc3, 
  Award, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Flame,
  UserCheck,
  Layers,
  Compass,
  Map,
  Users
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  collapsed, 
  setCollapsed,
  userProfile,
  onOpenAuth,
  stats,
  assessmentStatus,
  onOpenWheel,
  onOpenTour,
  onOpenSitemap
}) {
  const navItems = [
    {
      id: 'levels',
      label: '3-Level Journey',
      icon: Layers,
      badge: 'Gated',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
      description: 'L1 Foundation, L2 Systems, L3 Defense'
    },
    {
      id: 'mcq',
      label: 'MCQ Diagnostic Arena',
      icon: Code2,
      badge: '14+ Domains',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      description: '10 Easy, 10 Med, 10 Hard per language'
    },
    {
      id: 'practice',
      label: 'Practice Arena',
      icon: Code2,
      badge: 'All Languages & AI',
      description: 'Practice challenges with hints & test suites'
    },
    {
      id: 'ide',
      label: 'Interactive IDE',
      icon: Terminal,
      badge: 'Integrated',
      description: 'Embedded syntax editor & test runner'
    },
    {
      id: 'patterns',
      label: 'Learn Patterns',
      icon: BookOpen,
      badge: 'Architectural',
      description: 'Core systematic debugging patterns'
    },
    {
      id: 'shortcuts',
      label: 'IDE Shortcuts',
      icon: Keyboard,
      badge: 'Cheatsheet',
      description: 'VS Code, Cursor, Chrome, GDB'
    },
    {
      id: 'interviews',
      label: 'Fortune 500 Interviews',
      icon: Briefcase,
      badge: 'Placements',
      description: 'Google, Meta, Stripe mock rounds'
    },
    {
      id: 'wiifm',
      label: 'WIIFM Stakeholder Hub',
      icon: Users,
      badge: 'All Roles',
      description: 'Value for Learners, TPOs, HR & CXOs'
    },
    {
      id: 'wheel',
      label: 'Spinning Wheel',
      icon: Disc3,
      badge: 'Daily Bonus',
      action: onOpenWheel,
      description: 'Earn tokens, streak freezes & bonus XP'
    },
    {
      id: 'badges',
      label: 'Earned Badges',
      icon: Award,
      badge: 'Verified',
      description: 'Official badges signed by Kapil'
    },
    {
      id: 'assessment',
      label: '3-Hour Final Assessment',
      icon: ShieldAlert,
      badge: assessmentStatus?.status === 'COMPLETED' ? 'Passed' : (assessmentStatus?.status === 'DISQUALIFIED' ? 'Locked' : 'Proctored'),
      badgeColor: assessmentStatus?.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200',
      description: '180-min strict exam with anti-cheat proctor'
    },
    {
      id: 'certificate',
      label: 'Executive Certificate',
      icon: CheckCircle2,
      badge: assessmentStatus?.passed ? 'Unlocked' : 'Locked',
      badgeColor: assessmentStatus?.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500',
      description: 'Issued by Kapil upon completion'
    }
  ];

  return (
    <aside 
      className={`relative z-20 flex flex-col bg-white f500-sidebar-border h-screen transition-all duration-300 select-none ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        {!collapsed ? (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                DU
              </div>
              <div>
                <h1 className="font-extrabold text-sm tracking-tight text-slate-900 leading-tight">
                  DEBUGGING UNIVERSE
                </h1>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  With Kapil
                </div>
              </div>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Powered By SarlaYash Mission
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 mx-auto rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-base shadow-sm">
            DU
          </div>
        )}

        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* User Status Card */}
      {!collapsed && (
        <div className="p-3 mx-3 mt-3 rounded-lg bg-slate-50 border border-slate-200">
          {userProfile ? (
            <div className="flex items-center gap-3">
              {userProfile.photo ? (
                <img 
                  src={userProfile.photo} 
                  alt={userProfile.name} 
                  className="w-9 h-9 rounded-full border border-slate-300 object-cover" 
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-slate-800 text-white font-semibold flex items-center justify-center text-xs">
                  {userProfile.name?.charAt(0) || 'U'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {userProfile.name}
                  </p>
                  <UserCheck size={12} className="text-emerald-600 flex-shrink-0" />
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  {userProfile.email}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-xs font-semibold text-slate-800 mb-1">
                Google Sign-Up Required
              </div>
              <p className="text-[11px] text-slate-500 mb-2">
                Official Certification issued to Google verified learners only.
              </p>
              <button
                onClick={onOpenAuth}
                className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors shadow-sm"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Sign in with Google
              </button>
            </div>
          )}

          {/* Quick Metrics Bar */}
          <div className="mt-2.5 pt-2 border-t border-slate-200 grid grid-cols-2 gap-1 text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Sparkles size={12} className="text-amber-500" />
              <span className="font-semibold text-slate-800">{stats.xp}</span> IQ / XP
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 justify-end">
              <Flame size={12} className="text-orange-500" />
              <span className="font-semibold text-slate-800">{stats.streak}</span> Day Streak
            </div>
          </div>
        </div>
      )}

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  setActiveTab(item.id);
                }
              }}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                isActive
                  ? 'bg-slate-900 text-white font-medium shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon 
                size={18} 
                className={`flex-shrink-0 ${
                  isActive ? 'text-white' : 'text-slate-500'
                }`} 
              />
              
              {!collapsed && (
                <div className="flex-1 min-w-0 flex items-center justify-between">
                  <span className="text-xs truncate">{item.label}</span>
                  {item.badge && (
                    <span 
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium border ${
                        item.badgeColor || (isActive 
                          ? 'bg-slate-800 text-slate-200 border-slate-700' 
                          : 'bg-slate-100 text-slate-600 border-slate-200')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Tour & Sitemap Quick Launchers */}
      <div className="p-3 border-t border-slate-200 space-y-1.5">
        <button
          onClick={onOpenTour}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
          title="Start Guided Platform Tour"
        >
          <Compass size={16} className="text-blue-600 shrink-0" />
          {!collapsed && <span>Guided Demo Tour</span>}
        </button>

        <button
          onClick={onOpenSitemap}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
          title="View Architectural Platform Sitemap"
        >
          <Map size={16} className="text-emerald-600 shrink-0" />
          {!collapsed && <span>Platform Sitemap</span>}
        </button>
      </div>

      {/* Footer Info in Sidebar */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-200 text-center bg-slate-50/50">
          <div className="text-[11px] font-medium text-slate-500">
            Sole Signatory & Architect
          </div>
          <div className="text-xs font-bold text-slate-800">
            Kapil
          </div>
          <div className="text-[10px] text-slate-400">
            SarlaYash Mission
          </div>
        </div>
      )}
    </aside>
  );
}
