import React, { useState } from 'react';
import { QuizSubmissionRecord, Question } from '../types';
import { exportSingleStudentToExcel } from '../utils/excelExport';
import { CheckCircle2, XCircle, Award, FileSpreadsheet, Lock, Sparkles, Filter, ChevronDown, ChevronUp, BookOpen, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizResultsProps {
  submission: QuizSubmissionRecord;
  questions: Question[];
  onViewModule: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  submission,
  questions,
  onViewModule
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'correct' | 'incorrect'>('all');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Trigger celebration confetti on pass
  React.useEffect(() => {
    if (submission.isPassed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [submission.isPassed]);

  const incorrectCount = submission.totalQuestions - submission.score;

  // Map original questions for rationale lookup
  const questionMap = new Map<number, Question>();
  questions.forEach(q => questionMap.set(q.id, q));

  const filteredAnswers = submission.answers.filter(ans => {
    if (filterMode === 'correct') return ans.isCorrect;
    if (filterMode === 'incorrect') return !ans.isCorrect;
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Executive Score Card */}
      <div className={`card-3d-luxury rounded-3xl p-6 sm:p-10 border relative overflow-hidden ${
        submission.isPassed
          ? 'border-emerald-500/40 shadow-2xl shadow-emerald-500/10'
          : 'border-amber-500/40 shadow-2xl shadow-amber-500/10'
      }`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono mb-3">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-300">Final Official Score Recorded (No Retakes Permitted)</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-serif">
              {submission.isPassed ? (
                <span>Congratulations, <strong className="gold-gradient-text">{submission.firstName}</strong>!</span>
              ) : (
                <span>Assessment Completed, <strong className="text-amber-300">{submission.firstName}</strong></span>
              )}
            </h2>

            <p className="text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
              {submission.isPassed
                ? `You have successfully surpassed the Trimex institutional passing cutoff (15 / 20) with a score of ${submission.score} out of 20 (${submission.percentage.toFixed(1)}%). Your competencies in NSTP 2 Volunteerism are verified.`
                : `You achieved ${submission.score} out of 20 (${submission.percentage.toFixed(1)}%). The required passing threshold is 15 / 20. Review the detailed concept explanations below to strengthen your understanding.`}
            </p>

            {/* Quick Meta */}
            <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono text-slate-300">
              <div>Student ID: <span className="text-white font-bold">{submission.studentNumber}</span></div>
              <div>•</div>
              <div>Submitted: <span className="text-white">{submission.submittedAt}</span></div>
              <div>•</div>
              <div>Section: <span className="text-white">{submission.section}</span></div>
            </div>
          </div>

          {/* Score Badge */}
          <div className="flex flex-col items-center shrink-0">
            <div className={`w-36 h-36 rounded-3xl p-1 flex items-center justify-center shadow-2xl ${
              submission.isPassed
                ? 'bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-300'
                : 'bg-gradient-to-tr from-amber-600 via-yellow-500 to-red-500'
            }`}>
              <div className="w-full h-full rounded-[22px] bg-[#08122a] flex flex-col items-center justify-center text-center p-2">
                <div className="text-3xl sm:text-4xl font-black font-mono text-white">
                  {submission.score}<span className="text-lg text-slate-400 font-normal">/20</span>
                </div>
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
                  {submission.percentage.toFixed(0)}%
                </div>
                <div className={`mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  submission.isPassed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {submission.isPassed ? 'PASSED (≥15)' : 'FAILED (<15)'}
                </div>
              </div>
            </div>

            {/* Excel Download Button (Requested in Prompt) */}
            <button
              onClick={() => exportSingleStudentToExcel(submission)}
              className="mt-4 py-2.5 px-4 rounded-xl gold-button text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Official Excel Sheet (.xlsx)</span>
            </button>
          </div>

        </div>
      </div>

      {/* Performance Matrix: Visualizing Areas of Strength & Weakness */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="card-3d-luxury rounded-2xl p-5 border border-slate-700/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Passing Cutoff</span>
            <span className="text-xs font-mono font-bold text-amber-400">15 / 20</span>
          </div>
          <div className="text-2xl font-black text-white font-mono">
            75.0%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Institutional minimum score to qualify for NSTP 2 CWTS fieldwork deployment.
          </p>
        </div>

        <div className="card-3d-luxury rounded-2xl p-5 border border-slate-700/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Correct Answers</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {submission.score} Questions
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Mastered principles across core values, work plans, and community sectors.
          </p>
        </div>

        <div className="card-3d-luxury rounded-2xl p-5 border border-slate-700/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Incorrect Answers</span>
            <XCircle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400 font-mono">
            {incorrectCount} Questions
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Targeted weakness areas requiring review in the NSTP 2 slides module.
          </p>
        </div>

      </div>

      {/* Itemized 1 to 20 Breakdown with Acceptable Reasons & Detailed Feedback */}
      <div className="card-3d-luxury rounded-3xl p-6 sm:p-8 border border-amber-500/30">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                Itemized Question Analysis (1 to 20)
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">Acceptable Reasons & Rationale</span>
            </div>
            <h3 className="text-xl font-bold text-white font-serif mt-1">
              Comprehensive Answer Explanations
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border ${
                filterMode === 'all'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              All (20)
            </button>
            <button
              onClick={() => setFilterMode('correct')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border ${
                filterMode === 'correct'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              Correct ({submission.score})
            </button>
            <button
              onClick={() => setFilterMode('incorrect')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border ${
                filterMode === 'incorrect'
                  ? 'bg-red-500 text-slate-950 border-red-400 font-bold'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              Mistakes ({incorrectCount})
            </button>
          </div>
        </div>

        {/* Question List (1 to 20) */}
        <div className="space-y-4">
          {filteredAnswers.map((ans, idx) => {
            const originalQ = questionMap.get(ans.questionId);
            const isExpanded = expandedIndex === idx;

            return (
              <div
                key={ans.questionId}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  ans.isCorrect
                    ? 'bg-slate-950/60 border-emerald-500/30'
                    : 'bg-slate-950/80 border-red-500/40 shadow-md shadow-red-500/5'
                }`}
              >
                {/* Collapsible Header */}
                <div
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/50"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl font-mono text-xs font-black flex items-center justify-center shrink-0 ${
                      ans.isCorrect ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'
                    }`}>
                      {ans.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-slate-300">
                          Item {idx + 1} of 20
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                          {ans.slideReference}
                        </span>
                        <span className={`text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded ${
                          ans.isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {ans.isCorrect ? 'Correct' : 'Needs Review'}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-white mt-1 line-clamp-2">
                        {ans.questionText}
                      </h4>
                    </div>
                  </div>

                  <div className="text-slate-400 shrink-0">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {/* Expanded Details: Answers & Rationale */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 pt-0 border-t border-slate-800/80 space-y-4 text-xs sm:text-sm">
                    
                    {/* Answers Comparison Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      <div className={`p-3.5 rounded-xl border ${
                        ans.isCorrect ? 'bg-emerald-950/30 border-emerald-500/30' : 'bg-red-950/30 border-red-500/30'
                      }`}>
                        <div className="text-[11px] font-mono uppercase font-bold text-slate-400 mb-1">
                          Your Selected Answer:
                        </div>
                        <div className={`font-semibold ${ans.isCorrect ? 'text-emerald-300' : 'text-red-300'}`}>
                          {ans.selectedOption}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700">
                        <div className="text-[11px] font-mono uppercase font-bold text-amber-400 mb-1">
                          Official Correct Answer:
                        </div>
                        <div className="font-semibold text-white">
                          {ans.correctOption}
                        </div>
                      </div>
                    </div>

                    {/* Acceptable Reason & Rationale (Explicitly requested by user) */}
                    {originalQ && (
                      <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/25 space-y-2">
                        <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase font-mono">
                          <BookOpen className="w-4 h-4 text-amber-400" />
                          <span>Acceptable Reason & Concept Explanation:</span>
                        </div>
                        <p className="text-slate-200 leading-relaxed text-xs">
                          {originalQ.rationale.correctReason}
                        </p>
                        
                        {!ans.isCorrect && (
                          <div className="pt-2 border-t border-slate-800 text-xs text-red-200/90">
                            <strong className="text-red-300">Why your answer was incorrect: </strong>
                            {originalQ.rationale.distractorAnalysis}
                          </div>
                        )}

                        <div className="pt-1 text-[11px] font-mono text-slate-400">
                          Target Competency: {originalQ.rationale.learningOutcome}
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* Policy Notice: Retakes are strictly disabled */}
      <div className="card-3d-luxury rounded-2xl p-4 sm:p-5 border border-slate-700 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-300">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Score Finalization Lock Policy
            </div>
            <p className="text-xs text-slate-300">
              Exam retakes back to Question 1 are disabled. Your official submission is saved in the Trimex master gradebook.
            </p>
          </div>
        </div>

        <button
          onClick={onViewModule}
          className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-semibold flex items-center gap-2 cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Return to NSTP 2 Course Module</span>
        </button>
      </div>

    </div>
  );
};
