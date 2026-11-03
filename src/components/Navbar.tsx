import React from 'react';
import { Student } from '../types';
import { ShieldCheck, LogOut, Sparkles, User, AlertTriangle } from 'lucide-react';

interface NavbarProps {
  student: Student | null;
  onLogout: () => void;
  altTabStrikes: number;
  highlightAttempts: number;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  student,
  onLogout,
  altTabStrikes,
  highlightAttempts
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#070e22]/90 backdrop-blur-xl border-b border-amber-500/20 shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Title & Presenter Meta (Requested in Prompt) */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-600 to-amber-700 p-[1.5px] shadow-lg shadow-amber-500/20">
              <div className="w-full h-full rounded-2xl bg-[#09122a] flex items-center justify-center">
                <span className="text-xl font-black text-amber-300 font-serif">N2</span>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#09122a] flex items-center justify-center animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300">
                NSTP 2 · CWTS
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                Trimex Colleges
              </span>
            </div>
            
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="gold-gradient-text font-serif">Volunteerism on NSTP 2</span>
            </h1>
            
            <div className="text-[11px] text-slate-300 flex items-center flex-wrap gap-x-2">
              <span className="text-amber-200/90 font-medium">Presenter: Gimbert B. Ludovice</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">gimbertludovice@student.trimexcolleges.edu.ph</span>
              <span className="text-slate-500 hidden md:inline">•</span>
              <span className="text-slate-400 hidden md:inline">Prof. Arjay Gonzales Caraca</span>
            </div>
          </div>
        </div>

        {/* Right Section: Proctor Telemetry, Student First Name, and Logout */}
        <div className="flex items-center gap-3">
          {/* Live Proctor Shield Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-emerald-500/30 shadow-inner">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Cyber Proctor Shield
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Strikes: <span className={altTabStrikes > 0 ? "text-red-400 font-bold" : "text-emerald-300"}>{altTabStrikes}</span> | AI Copy: <span className={highlightAttempts > 0 ? "text-amber-400 font-bold" : "text-slate-300"}>{highlightAttempts}</span>
              </div>
            </div>
          </div>

          {/* Quick Warning Badge if violations exist */}
          {(altTabStrikes > 0 || highlightAttempts > 0) && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>{altTabStrikes + highlightAttempts} Alerts</span>
            </div>
          )}

          {/* Student Profile (Display First Name as requested) */}
          {student ? (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-700/60">
              <div className="text-right hidden sm:block">
                <div className="text-xs text-slate-400">Student Portal</div>
                <div className="text-sm font-bold text-white flex items-center justify-end gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Hello, <strong className="text-amber-300">{student.firstName}</strong></span>
                </div>
              </div>

              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-400 p-[1px] flex items-center justify-center">
                <div className="w-full h-full rounded-[11px] bg-[#0c1836] flex items-center justify-center text-amber-300 font-bold text-sm">
                  {student.firstName[0]}
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                title="Secure Session Logout"
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/40 text-slate-300 hover:text-red-400 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
              <User className="w-3.5 h-3.5" />
              <span>Guest Mode</span>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
