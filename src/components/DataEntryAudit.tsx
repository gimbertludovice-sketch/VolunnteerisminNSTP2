import React, { useState } from 'react';
import { ProctorViolation, Student } from '../types';
import { ShieldAlert, AlertTriangle, Eye, Copy, RefreshCw, Filter, ShieldCheck, Terminal, Trash2 } from 'lucide-react';

interface DataEntryAuditProps {
  student: Student | null;
  violations: ProctorViolation[];
  altTabStrikes: number;
  highlightAttempts: number;
  onClearLogs?: () => void;
  onSimulateViolation?: (type: ProctorViolation['type']) => void;
}

export const DataEntryAudit: React.FC<DataEntryAuditProps> = ({
  student,
  violations,
  altTabStrikes,
  highlightAttempts,
  onClearLogs,
  onSimulateViolation
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  const screenshotAttempts = violations.filter(v => v.type === 'SCREENSHOT_ATTEMPT').length;
  const devToolsAttempts = violations.filter(v => v.type === 'DEVTOOLS_ACCESS' || v.type === 'CONTEXT_MENU').length;
  const totalIncidents = violations.length;

  // Filtered violations
  const filteredViolations = violations.filter(v => {
    if (filterType === 'all') return true;
    if (filterType === 'alt-tab') return v.type === 'ALT_TAB_SWITCH' || v.type === 'WINDOW_BLUR';
    if (filterType === 'ai-highlight') return v.type === 'TEXT_HIGHLIGHT_COPY' || v.type === 'AI_SHORTCUT_TRIGGER';
    if (filterType === 'screenshot') return v.type === 'SCREENSHOT_ATTEMPT';
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="card-3d-luxury rounded-3xl p-6 sm:p-8 border border-amber-500/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <ShieldAlert className="w-3.5 h-3.5" />
              Data Entry · AI Access & Cheating Counter
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
              Cybersecurity Proctor Telemetry
            </h2>
            
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Monitors and records suspicious academic integrity breaches: Alt+Tab window switching, question text highlighting (AI prompt extraction attempts), and mobile camera / screenshot captures.
            </p>

            {student && (
              <div className="mt-4 flex items-center gap-3 text-xs font-mono text-slate-300">
                <span className="text-amber-400 font-bold">Monitored Candidate:</span>
                <span>{student.firstName} {student.lastName} ({student.studentNumber})</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{student.email}</span>
              </div>
            )}
          </div>

          {/* Quick Simulation Testing for Faculty */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 space-y-2 text-right">
            <div className="text-[10px] font-mono uppercase text-slate-400">Faculty Test Triggers:</div>
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                onClick={() => onSimulateViolation?.('ALT_TAB_SWITCH')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 border border-slate-600 font-mono cursor-pointer"
              >
                + Sim Alt+Tab
              </button>
              <button
                onClick={() => onSimulateViolation?.('TEXT_HIGHLIGHT_COPY')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-blue-300 border border-slate-600 font-mono cursor-pointer"
              >
                + Sim AI Copy
              </button>
              <button
                onClick={() => onSimulateViolation?.('SCREENSHOT_ATTEMPT')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-red-300 border border-slate-600 font-mono cursor-pointer"
              >
                + Sim Screenshot
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Proctor Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Alt + Tab Counter */}
        <div className="card-3d-luxury rounded-2xl p-5 border border-amber-500/25 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase font-bold text-slate-400">Alt + Tab Switches</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-amber-300">
            {altTabStrikes} <span className="text-xs font-normal text-slate-400">strikes</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Window blur or task-switching away from the active examination viewport.
          </p>
        </div>

        {/* AI Prompt Highlighting / Copying Counter */}
        <div className="card-3d-luxury rounded-2xl p-5 border border-blue-500/25 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase font-bold text-slate-400">AI Copy / Highlighting</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Copy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-blue-300">
            {highlightAttempts} <span className="text-xs font-normal text-slate-400">attempts</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Mouse drag, text selection, or Ctrl+C copying to export questions into AI bots.
          </p>
        </div>

        {/* Screenshot / Phone Photo Privacy Intercepts */}
        <div className="card-3d-luxury rounded-2xl p-5 border border-purple-500/25 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase font-bold text-slate-400">Screen Capture Intercepts</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-purple-300">
            {screenshotAttempts} <span className="text-xs font-normal text-slate-400">intercepts</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            PrintScreen, Snipping tool, or mobile camera moiré filter activations.
          </p>
        </div>

        {/* Integrity Rating */}
        <div className="card-3d-luxury rounded-2xl p-5 border border-emerald-500/25 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase font-bold text-slate-400">Proctoring Risk Level</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-xl font-black font-mono ${
            altTabStrikes >= 3 || highlightAttempts >= 5
              ? 'text-red-400'
              : altTabStrikes > 0 || highlightAttempts > 0
              ? 'text-amber-400'
              : 'text-emerald-400'
          }`}>
            {altTabStrikes >= 3 || highlightAttempts >= 5
              ? 'FLAGGED'
              : altTabStrikes > 0 || highlightAttempts > 0
              ? 'MONITORED'
              : 'VERIFIED CLEAN'}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Automated compliance score synced directly into the Excel gradebook report.
          </p>
        </div>

      </div>

      {/* Real-time Chronological Telemetry Log Table */}
      <div className="card-3d-luxury rounded-3xl p-6 sm:p-8 border border-amber-500/30">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b border-slate-800 gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white font-serif">
              Data Entry Incident Stream ({filteredViolations.length} Events)
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 font-mono focus:border-amber-400 focus:outline-none"
            >
              <option value="all">All Incidents</option>
              <option value="alt-tab">Alt + Tab Only</option>
              <option value="ai-highlight">AI Copy / Highlighting</option>
              <option value="screenshot">Screen Captures</option>
            </select>

            {onClearLogs && violations.length > 0 && (
              <button
                onClick={onClearLogs}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 cursor-pointer"
                title="Clear Proctor Stream"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        {filteredViolations.length === 0 ? (
          <div className="text-center py-12 text-slate-400 space-y-2">
            <ShieldCheck className="w-12 h-12 text-emerald-400/60 mx-auto" />
            <div className="text-sm font-semibold text-slate-300">Clean Session Logged</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No unauthorized tab switches, text highlighting, or AI clipboard queries detected during this examination session.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Time</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Question Target</th>
                  <th className="py-3 px-3">Severity</th>
                  <th className="py-3 px-3">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredViolations.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{v.timestamp}</td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                        v.type === 'ALT_TAB_SWITCH' || v.type === 'WINDOW_BLUR'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : v.type === 'TEXT_HIGHLIGHT_COPY' || v.type === 'AI_SHORTCUT_TRIGGER'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {v.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                      {v.questionIndex ? `Item ${v.questionIndex}` : 'Global View'}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`font-bold ${
                        v.severity === 'critical' || v.severity === 'high' ? 'text-red-400' : 'text-amber-400'
                      }`}>
                        {v.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-sans text-xs">
                      {v.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};
