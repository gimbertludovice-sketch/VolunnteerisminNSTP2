import React, { useState } from 'react';
import { QuizSubmissionRecord } from '../types';
import { exportBatchGradebookToExcel, exportSingleStudentToExcel } from '../utils/excelExport';
import { FileSpreadsheet, Search, CheckCircle2, XCircle, Eye, AlertTriangle, ShieldCheck, Download, Award } from 'lucide-react';

interface GradebookExcelProps {
  records: QuizSubmissionRecord[];
  currentStudentSubmission: QuizSubmissionRecord | null;
}

export const GradebookExcel: React.FC<GradebookExcelProps> = ({
  records,
  currentStudentSubmission
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<QuizSubmissionRecord | null>(null);

  // Combine current student submission if not already in records
  const allRecords = React.useMemo(() => {
    const list = [...records];
    if (currentStudentSubmission && !list.some(r => r.id === currentStudentSubmission.id)) {
      list.unshift(currentStudentSubmission);
    }
    return list;
  }, [records, currentStudentSubmission]);

  const filtered = allRecords.filter(r =>
    r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.studentNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="card-3d-luxury rounded-3xl p-6 sm:p-8 border border-amber-500/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              Trimex Faculty Excel Records Management
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
              Master Gradebook & Excel Export
            </h2>

            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Official records repository for NSTP 2 Volunteerism Examination. Export complete multi-sheet Excel (.xlsx) workbooks containing itemized question audits (1 to 20), student answers, and proctoring telemetry.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
              <div>Course: <span className="text-white font-bold">NSTP 2 (CWTS)</span></div>
              <div>•</div>
              <div>Instructor: <span className="text-amber-300">Prof. Arjay Gonzales Caraca</span></div>
              <div>•</div>
              <div>Presenter: <span className="text-amber-300">Gimbert B. Ludovice</span></div>
            </div>
          </div>

          {/* Master Export Button */}
          <button
            onClick={() => exportBatchGradebookToExcel(allRecords)}
            className="py-3 px-6 rounded-2xl gold-button text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-amber-500/25 shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Master Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Gradebook Table Card */}
      <div className="card-3d-luxury rounded-3xl p-6 sm:p-8 border border-amber-500/30">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Student Records ({filtered.length} Submissions)
            </span>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, ID, or email..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Student ID</th>
                <th className="py-3 px-3">Trimex Email</th>
                <th className="py-3 px-3">Score (20)</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Alt+Tab</th>
                <th className="py-3 px-3">AI Copy</th>
                <th className="py-3 px-3">Risk Level</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3.5 px-3 font-sans font-semibold text-white whitespace-nowrap">
                    {r.fullName}
                  </td>
                  <td className="py-3.5 px-3 text-slate-300 whitespace-nowrap">
                    {r.studentNumber}
                  </td>
                  <td className="py-3.5 px-3 text-slate-400 whitespace-nowrap">
                    {r.email}
                  </td>
                  <td className="py-3.5 px-3 font-bold text-white whitespace-nowrap">
                    {r.score} / {r.totalQuestions} ({r.percentage.toFixed(0)}%)
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      r.isPassed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-red-500/20 text-red-300 border border-red-500/40'
                    }`}>
                      {r.isPassed ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {r.isPassed ? 'PASSED' : 'FAILED'}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-300 whitespace-nowrap">
                    <span className={r.altTabStrikes > 0 ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                      {r.altTabStrikes} strikes
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-300 whitespace-nowrap">
                    <span className={r.highlightAttempts > 0 ? 'text-blue-400 font-bold' : 'text-slate-400'}>
                      {r.highlightAttempts}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className={`font-bold uppercase text-[10px] ${
                      r.proctorRiskLevel.includes('High')
                        ? 'text-red-400'
                        : r.proctorRiskLevel.includes('Medium')
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}>
                      {r.proctorRiskLevel}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right whitespace-nowrap space-x-2">
                    <button
                      onClick={() => setSelectedRecord(r)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans cursor-pointer border border-slate-700"
                      title="Inspect 1-20 Question Breakdown"
                    >
                      <Eye className="w-3.5 h-3.5 inline mr-1" />
                      Review
                    </button>
                    <button
                      onClick={() => exportSingleStudentToExcel(r)}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-xs font-sans cursor-pointer border border-amber-400/40"
                      title="Export Student Sheet"
                    >
                      <Download className="w-3.5 h-3.5 inline mr-1" />
                      .xlsx
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Inspect Modal for Selected Record */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-[#040814]/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-3xl w-full card-3d-luxury rounded-3xl p-6 sm:p-8 border border-amber-400/40 my-8">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-amber-300 uppercase tracking-wider">Candidate Audit Sheet</span>
                <h3 className="text-xl font-bold text-white font-serif">{selectedRecord.fullName}</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedRecord.email} · {selectedRecord.studentNumber}</p>
              </div>

              <div className="text-right">
                <div className="text-2xl font-black font-mono text-amber-300">
                  {selectedRecord.score} / {selectedRecord.totalQuestions}
                </div>
                <div className={`text-xs font-bold ${selectedRecord.isPassed ? 'text-emerald-400' : 'text-red-400'}`}>
                  {selectedRecord.isPassed ? 'PASSED (≥15)' : 'FAILED (<15)'}
                </div>
              </div>
            </div>

            {/* Questions 1-20 audit */}
            <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
              {selectedRecord.answers.length > 0 ? (
                selectedRecord.answers.map((ans, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border text-xs ${
                      ans.isCorrect ? 'bg-slate-900/60 border-emerald-500/30' : 'bg-red-950/20 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-slate-300">Item {idx + 1}</span>
                      <span className={`font-mono font-bold uppercase ${ans.isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                        {ans.isCorrect ? 'CORRECT' : 'WRONG'}
                      </span>
                    </div>
                    <p className="text-white font-semibold mb-2">{ans.questionText}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400">Student Answer: </span>
                        <strong className={ans.isCorrect ? 'text-emerald-300' : 'text-red-300'}>{ans.selectedOption}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Correct Answer: </span>
                        <strong className="text-amber-300">{ans.correctOption}</strong>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">
                  Summary record available. Itemized choice breakdown is stored in master Excel workbook.
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
              <button
                onClick={() => exportSingleStudentToExcel(selectedRecord)}
                className="py-2.5 px-4 rounded-xl gold-button text-xs font-bold uppercase flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Student .xlsx</span>
              </button>

              <button
                onClick={() => setSelectedRecord(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
