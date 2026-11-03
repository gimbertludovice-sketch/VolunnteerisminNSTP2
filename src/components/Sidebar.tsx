import React from 'react';
import { BookOpen, FileSpreadsheet, ShieldAlert, CheckCircle2, HelpCircle, Lock } from 'lucide-react';

interface SidebarProps {
  activeTab: 'module' | 'quiz' | 'data-entry' | 'excel' | 'results';
  setActiveTab: (tab: 'module' | 'quiz' | 'data-entry' | 'excel' | 'results') => void;
  hasSubmittedQuiz: boolean;
  altTabStrikes: number;
  highlightAttempts: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  hasSubmittedQuiz,
  altTabStrikes,
  highlightAttempts
}) => {
  const totalViolations = altTabStrikes + highlightAttempts;

  const navItems = [
    {
      id: 'module' as const,
      label: 'Books · NSTP 2 Module',
      shortLabel: 'Books',
      icon: BookOpen,
      subtext: '12 Slides & 3D Video',
      badge: '12 Slides'
    },
    {
      id: 'quiz' as const,
      label: 'Proctored Quiz',
      shortLabel: 'Quiz',
      icon: HelpCircle,
      subtext: '20 Randomized Items',
      badge: hasSubmittedQuiz ? 'Locked' : 'Active',
      isLocked: hasSubmittedQuiz
    },
    {
      id: 'data-entry' as const,
      label: 'Data Entry · Proctor Telemetry',
      shortLabel: 'Data Entry',
      icon: ShieldAlert,
      subtext: 'AI Access & Cheat Counters',
      badge: totalViolations > 0 ? `${totalViolations} Alerts` : '0 Strikes',
      badgeColor: totalViolations > 0 ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'excel' as const,
      label: 'Excel Gradebook & Records',
      shortLabel: 'Excel',
      icon: FileSpreadsheet,
      subtext: 'Export .xlsx Gradebook',
      badge: 'Export'
    }
  ];

  return (
    <aside className="w-full md:w-64 lg:w-72 bg-[#081026]/90 border-r border-amber-500/15 p-4 flex flex-col justify-between shrink-0 backdrop-blur-xl">
      <div className="space-y-6">
        
        {/* Module Header Badge */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-yellow-600/5 to-transparent border border-amber-500/25">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider font-mono">
              Academic Navigation
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-snug">
            Trimex Colleges NSTP 2 Volunteerism Online Assessment & Module System
          </p>
        </div>

        {/* Navigation Item List */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group cursor-pointer ${
                  isActive
                    ? 'card-3d-luxury border-amber-400/60 shadow-lg shadow-amber-500/15 text-white'
                    : 'hover:bg-slate-800/50 text-slate-300 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/30'
                      : 'bg-slate-800/80 text-amber-300 group-hover:bg-amber-400/20'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold flex items-center gap-1.5">
                      {item.shortLabel}
                      {item.isLocked && <Lock className="w-3 h-3 text-amber-400 inline" />}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{item.subtext}</div>
                  </div>
                </div>

                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold border ${
                    item.badgeColor || (isActive ? 'bg-amber-400/20 text-amber-300 border-amber-400/40' : 'bg-slate-800 text-slate-400 border-slate-700')
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Results Tab (shown if completed) */}
          {hasSubmittedQuiz && (
            <button
              onClick={() => setActiveTab('results')}
              className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group cursor-pointer ${
                activeTab === 'results'
                  ? 'card-3d-luxury border-emerald-400/60 shadow-lg shadow-emerald-500/15 text-white'
                  : 'hover:bg-slate-800/50 text-slate-300 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  activeTab === 'results' ? 'bg-emerald-400 text-slate-950' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-emerald-300">Exam Results & Feedback</div>
                  <div className="text-[11px] text-slate-400">Score, Rationale & Weaknesses</div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Final
              </span>
            </button>
          )}
        </nav>
      </div>

      {/* Footer Info & Copyright */}
      <div className="mt-8 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-mono text-slate-300">Passing Grade: 15 / 20</span>
        </div>
        <p className="text-[10px] text-slate-300 leading-normal">
          © 2026 Gimbert B. Ludovice · WITMWD3M1. All Rights Reserved. Trimex Colleges NSTP 2 Department.
        </p>
      </div>
    </aside>
  );
};
