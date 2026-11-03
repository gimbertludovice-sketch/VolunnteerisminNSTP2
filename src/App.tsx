import React, { useState, useEffect } from 'react';
import { Student, Question, ProctorViolation, QuizSubmissionRecord } from './types';
import { NSTP_2_QUESTIONS } from './data/nstpQuestions';
import { prepareStudentQuestions, createProctorViolation, INITIAL_SAMPLE_GRADEBOOK } from './utils/security';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LoginModal } from './components/LoginModal';
import { PresentationViewer } from './components/PresentationViewer';
import { QuizPortal } from './components/QuizPortal';
import { QuizResults } from './components/QuizResults';
import { DataEntryAudit } from './components/DataEntryAudit';
import { GradebookExcel } from './components/GradebookExcel';
import { SecurityWatermark } from './components/SecurityWatermark';

export default function App() {
  const [student, setStudent] = useState<Student | null>(() => {
    const saved = localStorage.getItem('nstp2_active_student');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<'module' | 'quiz' | 'data-entry' | 'excel' | 'results'>('module');
  const [questions, setQuestions] = useState<Question[]>(() => prepareStudentQuestions(NSTP_2_QUESTIONS));

  const [altTabStrikes, setAltTabStrikes] = useState<number>(() => {
    const saved = localStorage.getItem('nstp2_strikes');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [highlightAttempts, setHighlightAttempts] = useState<number>(() => {
    const saved = localStorage.getItem('nstp2_highlights');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [violations, setViolations] = useState<ProctorViolation[]>(() => {
    const saved = localStorage.getItem('nstp2_violations');
    return saved ? JSON.parse(saved) : [];
  });

  const [submission, setSubmission] = useState<QuizSubmissionRecord | null>(() => {
    const saved = localStorage.getItem('nstp2_submission');
    return saved ? JSON.parse(saved) : null;
  });

  const [gradebookRecords, setGradebookRecords] = useState<QuizSubmissionRecord[]>(() => {
    const saved = localStorage.getItem('nstp2_master_gradebook');
    return saved ? JSON.parse(saved) : INITIAL_SAMPLE_GRADEBOOK;
  });

  const [isBlackedOut, setIsBlackedOut] = useState(false);
  const [blackoutReason, setBlackoutReason] = useState('');
  const [enableMoireFilter, setEnableMoireFilter] = useState(true);

  // Synchronize state to localStorage
  useEffect(() => {
    if (student) {
      localStorage.setItem('nstp2_active_student', JSON.stringify(student));
    } else {
      localStorage.removeItem('nstp2_active_student');
    }
  }, [student]);

  useEffect(() => {
    localStorage.setItem('nstp2_strikes', altTabStrikes.toString());
    localStorage.setItem('nstp2_highlights', highlightAttempts.toString());
    localStorage.setItem('nstp2_violations', JSON.stringify(violations));
  }, [altTabStrikes, highlightAttempts, violations]);

  useEffect(() => {
    if (submission) {
      localStorage.setItem('nstp2_submission', JSON.stringify(submission));
    }
  }, [submission]);

  useEffect(() => {
    localStorage.setItem('nstp2_master_gradebook', JSON.stringify(gradebookRecords));
  }, [gradebookRecords]);

  // Login handler
  const handleLoginSuccess = (verifiedStudent: Student) => {
    setStudent(verifiedStudent);
    // Randomize fresh set of questions and choices uniquely for this student
    setQuestions(prepareStudentQuestions(NSTP_2_QUESTIONS));
    setActiveTab('module');
  };

  // Logout handler
  const handleLogout = () => {
    setStudent(null);
    setSubmission(null);
    setAltTabStrikes(0);
    setHighlightAttempts(0);
    setViolations([]);
    localStorage.removeItem('nstp2_active_student');
    localStorage.removeItem('nstp2_submission');
    localStorage.removeItem('nstp2_strikes');
    localStorage.removeItem('nstp2_highlights');
    localStorage.removeItem('nstp2_violations');
    setActiveTab('module');
  };

  // Violation recorder
  const handleRecordViolation = (
    type: ProctorViolation['type'],
    description: string,
    questionIndex: number | null
  ) => {
    let severity: ProctorViolation['severity'] = 'medium';

    if (type === 'ALT_TAB_SWITCH' || type === 'WINDOW_BLUR') {
      severity = 'high';
      setAltTabStrikes((prev) => prev + 1);
      // Engage security privacy blackout veil during exam tab
      if (activeTab === 'quiz') {
        setIsBlackedOut(true);
        setBlackoutReason('Alt+Tab or external task switch detected! The examination screen has been obscured for security.');
      }
    } else if (type === 'TEXT_HIGHLIGHT_COPY' || type === 'AI_SHORTCUT_TRIGGER') {
      severity = 'high';
      setHighlightAttempts((prev) => prev + 1);
    } else if (type === 'SCREENSHOT_ATTEMPT') {
      severity = 'critical';
      setIsBlackedOut(true);
      setBlackoutReason('Screen capture / screenshot shortcut detected! Screen privacy blackout veil engaged.');
    } else if (type === 'DEVTOOLS_ACCESS') {
      severity = 'critical';
    }

    const newViolation = createProctorViolation(type, description, questionIndex, severity);
    setViolations((prev) => [newViolation, ...prev]);
  };

  // Quiz submission handler
  const handleSubmitQuiz = (completedSubmission: QuizSubmissionRecord) => {
    // Attach current violations
    const finalRecord = {
      ...completedSubmission,
      violations: [...violations]
    };

    setSubmission(finalRecord);
    setGradebookRecords((prev) => [finalRecord, ...prev.filter(r => r.id !== finalRecord.id)]);
    setActiveTab('results');
  };

  // Simulated violation test for faculty
  const handleSimulateViolation = (type: ProctorViolation['type']) => {
    handleRecordViolation(type, `[Faculty Simulation Test] Simulated ${type} trigger.`, null);
  };

  const handleClearLogs = () => {
    setViolations([]);
    setAltTabStrikes(0);
    setHighlightAttempts(0);
  };

  return (
    <div className="min-h-screen bg-[#060b18] text-slate-100 flex flex-col relative">
      
      {/* Security Privacy Screen Protection & Dynamic Watermark */}
      <SecurityWatermark
        student={student}
        isBlackedOut={isBlackedOut}
        blackoutReason={blackoutReason}
        onDismissBlackout={() => setIsBlackedOut(false)}
        enableMoireFilter={enableMoireFilter}
      />

      {/* Top Navbar */}
      <Navbar
        student={student}
        onLogout={handleLogout}
        altTabStrikes={altTabStrikes}
        highlightAttempts={highlightAttempts}
        activeTab={activeTab}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Left Sidebar with Icons */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            // Prevent navigating back to quiz if already submitted (score locked)
            if (tab === 'quiz' && submission) {
              setActiveTab('results');
            } else {
              setActiveTab(tab);
            }
          }}
          hasSubmittedQuiz={!!submission}
          altTabStrikes={altTabStrikes}
          highlightAttempts={highlightAttempts}
        />

        {/* Dynamic Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
          {activeTab === 'module' && (
            <PresentationViewer
              onStartQuiz={() => setActiveTab('quiz')}
              hasSubmittedQuiz={!!submission}
            />
          )}

          {activeTab === 'quiz' && student && !submission && (
            <QuizPortal
              student={student}
              questions={questions}
              onSubmitQuiz={handleSubmitQuiz}
              onRecordViolation={handleRecordViolation}
              altTabStrikes={altTabStrikes}
              highlightAttempts={highlightAttempts}
            />
          )}

          {activeTab === 'results' && submission && (
            <QuizResults
              submission={submission}
              questions={questions}
              onViewModule={() => setActiveTab('module')}
            />
          )}

          {activeTab === 'data-entry' && (
            <DataEntryAudit
              student={student}
              violations={violations}
              altTabStrikes={altTabStrikes}
              highlightAttempts={highlightAttempts}
              onClearLogs={handleClearLogs}
              onSimulateViolation={handleSimulateViolation}
            />
          )}

          {activeTab === 'excel' && (
            <GradebookExcel
              records={gradebookRecords}
              currentStudentSubmission={submission}
            />
          )}
        </main>

      </div>

      {/* Login Modal (shown if not authenticated) */}
      {!student && (
        <LoginModal onSuccess={handleLoginSuccess} />
      )}

      {/* Footer & Copyright */}
      <footer className="w-full bg-[#040812] border-t border-slate-900 py-6 px-4 text-center text-xs text-slate-300 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            Volunteerism on NSTP 2 · Presented by <strong className="text-amber-300">Gimbert B. Ludovice</strong>
          </div>
          <div>
            Trimex Colleges · Instructor: Prof. Arjay Gonzales Caraca · WITMWD3M1
          </div>
          <div>
            © 2026 All Rights Reserved · Cyber Proctor Active
          </div>
        </div>
      </footer>

    </div>
  );
}
