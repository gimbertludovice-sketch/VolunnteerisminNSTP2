import React, { useState, useEffect, useRef } from 'react';
import { Question, Student, QuizSubmissionRecord } from '../types';
import { ShieldCheck, ChevronLeft, ChevronRight, Clock, Send, Lock, Eye, AlertTriangle } from 'lucide-react';

interface QuizPortalProps {
  student: Student;
  questions: Question[];
  onSubmitQuiz: (submission: QuizSubmissionRecord) => void;
  onRecordViolation: (type: 'ALT_TAB_SWITCH' | 'WINDOW_BLUR' | 'TEXT_HIGHLIGHT_COPY' | 'AI_SHORTCUT_TRIGGER' | 'DEVTOOLS_ACCESS' | 'SCREENSHOT_ATTEMPT' | 'CONTEXT_MENU', desc: string, qIdx: number | null) => void;
  altTabStrikes: number;
  highlightAttempts: number;
}

export const QuizPortal: React.FC<QuizPortalProps> = ({
  student,
  questions,
  onSubmitQuiz,
  onRecordViolation,
  altTabStrikes,
  highlightAttempts
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [startTime] = useState(Date.now());
  const [selectionWarning, setSelectionWarning] = useState(false);

  const currentQ = questions[currentIndex];
  const totalCount = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  // Proctoring: Detect Alt+Tab & Tab Switches
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        onRecordViolation(
          'ALT_TAB_SWITCH',
          `Student navigated away from browser tab (Alt+Tab / Task Switch detected). Question active: Item ${currentIndex + 1}.`,
          currentIndex
        );
      }
    };

    const handleWindowBlur = () => {
      onRecordViolation(
        'WINDOW_BLUR',
        `Browser lost focus (Alt+Tab / External application overlay detected). Question active: Item ${currentIndex + 1}.`,
        currentIndex
      );
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [currentIndex, onRecordViolation]);

  // Proctoring: Detect Copying, Text Highlight / Selection Attempts (AI Prompt Copying)
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      onRecordViolation(
        'TEXT_HIGHLIGHT_COPY',
        `Student attempted to COPY question text (Suspected AI extraction attempt). Question active: Item ${currentIndex + 1}.`,
        currentIndex
      );
      setSelectionWarning(true);
      setTimeout(() => setSelectionWarning(false), 3000);
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      onRecordViolation(
        'CONTEXT_MENU',
        `Right-click context menu intercepted. Question active: Item ${currentIndex + 1}.`,
        currentIndex
      );
    };

    const handleSelectStart = (e: Event) => {
      // Prevent highlighting questions to feed into AI
      onRecordViolation(
        'TEXT_HIGHLIGHT_COPY',
        `Text highlight selection event triggered. Anti-AI extraction shield blocked text drag. Question: Item ${currentIndex + 1}.`,
        currentIndex
      );
      setSelectionWarning(true);
      setTimeout(() => setSelectionWarning(false), 2500);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect Alt+Tab keydown, Ctrl+C, Ctrl+U, F12, PrintScreen
      if (e.key === 'PrintScreen' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'S')) || (e.metaKey && e.shiftKey && e.key === '4')) {
        onRecordViolation(
          'SCREENSHOT_ATTEMPT',
          `Screen capture / Snipping shortcut intercepted (${e.key}). Privacy screen protection engaged. Question: Item ${currentIndex + 1}.`,
          currentIndex
        );
      } else if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        onRecordViolation(
          'AI_SHORTCUT_TRIGGER',
          `Ctrl+C keystroke intercepted (Suspected AI query copying). Question: Item ${currentIndex + 1}.`,
          currentIndex
        );
        setSelectionWarning(true);
        setTimeout(() => setSelectionWarning(false), 2500);
      } else if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'C'))) {
        e.preventDefault();
        onRecordViolation(
          'DEVTOOLS_ACCESS',
          `Developer inspect tools shortcut pressed (${e.key}). Access denied.`,
          currentIndex
        );
      }
    };

    window.addEventListener('copy', handleCopy);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('selectstart', handleSelectStart);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('selectstart', handleSelectStart);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, onRecordViolation]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQ.id]: optIndex
    });
  };

  const handleAutoSubmit = () => {
    finalizeSubmission();
  };

  const finalizeSubmission = () => {
    const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
    
    let totalScore = 0;
    const itemizedAnswers = questions.map((q) => {
      const studentSelectedIdx = selectedAnswers[q.id];
      const isCorrect = studentSelectedIdx !== undefined && studentSelectedIdx === q.correctIndex;
      if (isCorrect) totalScore++;

      return {
        questionId: q.id,
        questionText: q.questionText,
        selectedOption: studentSelectedIdx !== undefined ? q.options[studentSelectedIdx] : 'Unanswered',
        correctOption: q.options[q.correctIndex],
        isCorrect,
        slideReference: q.rationale.slideReference
      };
    });

    const percentage = (totalScore / totalCount) * 100;
    const isPassed = totalScore >= 15; // Passing score 15 / 20

    let riskLevel: QuizSubmissionRecord['proctorRiskLevel'] = 'Clean';
    if (altTabStrikes >= 3 || highlightAttempts >= 5) {
      riskLevel = 'High Risk / Flagged';
    } else if (altTabStrikes >= 1 || highlightAttempts >= 2) {
      riskLevel = 'Medium Risk';
    } else if (highlightAttempts === 1) {
      riskLevel = 'Low Risk';
    }

    const submissionRecord: QuizSubmissionRecord = {
      id: `sub_${Date.now()}`,
      studentId: student.id,
      studentNumber: student.studentNumber,
      firstName: student.firstName,
      lastName: student.lastName,
      fullName: `${student.firstName} ${student.lastName}`,
      email: student.email,
      section: student.section,
      submittedAt: new Date().toLocaleString(),
      score: totalScore,
      totalQuestions: totalCount,
      percentage,
      isPassed,
      timeSpentSeconds: elapsedSeconds,
      answers: itemizedAnswers,
      violations: [], // Populated from parent
      altTabStrikes,
      highlightAttempts,
      proctorRiskLevel: riskLevel
    };

    onSubmitQuiz(submissionRecord);
  };

  return (
    <div className="space-y-6 animate-fadeIn quiz-protected-zone select-none">
      
      {/* Anti-Cheating Warning Toast on Highlight / Copy Attempt */}
      {selectionWarning && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-red-600/90 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-2xl border border-red-300 animate-bounce">
          <AlertTriangle className="w-4 h-4" />
          <span>PROCTOR ALERT: Text selection and copying blocked to prevent AI extraction! Violation logged.</span>
        </div>
      )}

      {/* Top Header Card: Timer, Question Progress, and Proctor Status */}
      <div className="card-3d-luxury rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-amber-500/30">
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Proctored Exam Session
            </span>
          </div>

          <div className="text-xs font-mono text-slate-400 border-l border-slate-700 pl-3">
            Student: <strong className="text-amber-300">{student.firstName} {student.lastName}</strong> ({student.studentNumber})
          </div>
        </div>

        {/* Live Proctor Alerts & Timer */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xs">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className={`font-bold ${timeLeft < 300 ? 'text-red-400 animate-pulse' : 'text-slate-200'}`}>
              {formatTimer(timeLeft)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
            <span>Answered:</span>
            <strong className="text-white">{answeredCount} / {totalCount}</strong>
          </div>
        </div>
      </div>

      {/* Question Jumper / "Back to Number" Navigator Grid (Requested in Prompt) */}
      <div className="card-3d-luxury rounded-2xl p-4 sm:p-5 border border-amber-500/20">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <span>Question Navigator (Back to Number feature)</span>
            <span className="text-[10px] text-slate-500 lowercase">(jump back anytime before submitting)</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Passing Goal: 15 / 20 (75%)
          </div>
        </div>

        {/* 1 to 20 Number Buttons */}
        <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-20 gap-2">
          {questions.map((q, idx) => {
            const isAnswered = selectedAnswers[q.id] !== undefined;
            const isCurrent = currentIndex === idx;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-9 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center cursor-pointer border ${
                  isCurrent
                    ? 'bg-amber-400 text-slate-950 border-amber-300 scale-110 shadow-lg shadow-amber-400/30 z-10'
                    : isAnswered
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 hover:border-emerald-400'
                    : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
                title={`Jump to Question ${idx + 1}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Question Card */}
      <div className="card-3d-luxury rounded-3xl p-6 sm:p-8 border border-amber-500/30 relative">
        
        {/* Question Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-xl bg-amber-400 text-slate-950 font-black text-xs font-mono">
              Item {currentIndex + 1} of {totalCount}
            </span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
              {currentQ.category}
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
              {currentQ.difficulty}
            </span>
          </div>

          <div className="text-xs text-amber-300/80 font-mono">
            {currentQ.rationale.slideReference}
          </div>
        </div>

        {/* Question Text (Protected from copying) */}
        <h3 className="text-base sm:text-xl font-bold text-white leading-relaxed mb-6">
          {currentQ.questionText}
        </h3>

        {/* 4 Shuffled Options */}
        <div className="space-y-3 mb-8">
          {currentQ.options.map((opt, optIdx) => {
            const isSelected = selectedAnswers[currentQ.id] === optIdx;
            const optionLetters = ['A', 'B', 'C', 'D'];

            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full p-4 rounded-2xl text-left transition-all border flex items-start gap-4 group cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500/20 to-yellow-600/10 border-amber-400 shadow-md shadow-amber-500/15 text-white'
                    : 'bg-slate-900/60 hover:bg-slate-850 border-slate-700/80 hover:border-slate-600 text-slate-300 hover:text-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl font-mono text-xs font-black flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                    : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-amber-300'
                }`}>
                  {optionLetters[optIdx]}
                </div>
                <div className="text-xs sm:text-sm pt-1 leading-relaxed">
                  {opt}
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation & Back to Previous Number */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 flex-wrap gap-3">
          
          {/* Back to Previous Number Button (Explicitly requested in prompt) */}
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 disabled:opacity-30 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Question {currentIndex > 0 ? currentIndex : 1}</span>
          </button>

          <div className="flex items-center gap-3">
            {currentIndex < totalCount - 1 ? (
              <button
                onClick={() => setCurrentIndex(currentIndex + 1)}
                className="py-2.5 px-5 rounded-xl gold-button text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="py-2.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/30 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Final Exam</span>
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Confirmation Modal Before Final Submission */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-[#040814]/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="max-w-md w-full card-3d-luxury p-6 sm:p-8 rounded-3xl border border-amber-400/40 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center mx-auto mb-4 text-amber-300">
              <Lock className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-white font-serif mb-2">
              Confirm Final Submission
            </h3>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              You have answered <strong className="text-amber-300">{answeredCount} of {totalCount}</strong> questions.
            </p>

            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 text-left mb-6 space-y-1.5">
              <div className="font-bold flex items-center gap-1 text-amber-300">
                <AlertTriangle className="w-3.5 h-3.5" />
                IMPORTANT EXAMINATION POLICY:
              </div>
              <div>• Once submitted, your score is final and permanently recorded.</div>
              <div>• <strong>No retakes are permitted</strong> (Question 1 will be locked).</div>
              <div>• Detailed explanation rationales and Excel download will be generated immediately.</div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase cursor-pointer"
              >
                Review Answers
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  finalizeSubmission();
                }}
                className="flex-1 py-3 rounded-xl gold-button text-xs font-bold uppercase cursor-pointer shadow-lg shadow-amber-500/25"
              >
                Confirm & Lock Score
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
