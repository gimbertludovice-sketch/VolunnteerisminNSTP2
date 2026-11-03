import React from 'react';
import { Student } from '../types';
import { ShieldAlert, EyeOff } from 'lucide-react';

interface SecurityWatermarkProps {
  student: Student | null;
  isBlackedOut: boolean;
  blackoutReason: string;
  onDismissBlackout?: () => void;
  enableMoireFilter?: boolean;
}

export const SecurityWatermark: React.FC<SecurityWatermarkProps> = ({
  student,
  isBlackedOut,
  blackoutReason,
  onDismissBlackout,
  enableMoireFilter = true
}) => {
  return (
    <>
      {/* Dynamic Drifting Holographic Watermark Grid */}
      {student && (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden select-none opacity-[0.065] flex flex-wrap gap-12 p-6 content-around justify-around rotate-[-12deg] scale-125">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="text-center font-mono text-[11px] text-amber-300 font-semibold tracking-wider uppercase whitespace-nowrap">
              <div>TRIMEX COLLEGES SECURE EXAM · {student.firstName} {student.lastName}</div>
              <div>ID: {student.studentNumber} · {student.email}</div>
              <div>PROCTOR ACTIVE · ANTI-LEAK SHIELD</div>
            </div>
          ))}
        </div>
      )}

      {/* Anti-Camera Moiré Micro-Lattice Overlay (Distorts mobile phone camera sensors when photographed) */}
      {enableMoireFilter && (
        <div className="fixed inset-0 pointer-events-none z-30 anti-camera-moire opacity-40 mix-blend-overlay" />
      )}

      {/* Security Privacy Screen Blackout Veil (Triggers on Alt+Tab, Window Blur, or Screenshot Key) */}
      {isBlackedOut && (
        <div className="fixed inset-0 z-50 bg-[#040814]/95 backdrop-blur-2xl flex items-center justify-center p-6 select-none animate-fadeIn">
          <div className="max-w-md w-full card-3d-luxury p-8 rounded-2xl text-center border-2 border-red-500/50 shadow-2xl shadow-red-500/20">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-5 text-red-400">
              <ShieldAlert className="w-8 h-8 animate-bounce" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <EyeOff className="w-3.5 h-3.5" />
              Cybersecurity Proctor Alert
            </div>

            <h3 className="text-xl font-bold text-white mb-2 font-serif tracking-wide">
              Security Violation Intercepted
            </h3>

            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              {blackoutReason || 'Alt+Tab window focus loss or screen capture shortcut detected. The examination screen has been obscured for integrity protection.'}
            </p>

            <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/20 text-xs text-red-300 mb-6 font-mono text-left space-y-1">
              <div>• Strike logged to Trimex Faculty Proctor Audit</div>
              <div>• Window focus loss timestamped</div>
              <div>• Questions and choices remain scrambled</div>
            </div>

            {onDismissBlackout && (
              <button
                onClick={onDismissBlackout}
                className="w-full py-3 px-4 rounded-xl gold-button text-sm font-bold uppercase tracking-wider cursor-pointer"
              >
                Return to Exam Session
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
