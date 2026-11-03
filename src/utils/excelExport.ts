import * as XLSX from 'xlsx';
import { QuizSubmissionRecord } from '../types';

export function exportSingleStudentToExcel(record: QuizSubmissionRecord) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Executive Performance Summary
  const summaryData = [
    ['TRIMEX COLLEGES - NSTP 2 EXAMINATION PORTAL'],
    ['Volunteerism on NSTP 2 | Lead Presenter: Gimbert B. Ludovice'],
    ['Instructor: Professor Arjay Gonzales Caraca | Section: WITMWD3M1'],
    [],
    ['STUDENT OFFICIAL CREDENTIALS'],
    ['Student ID / Number', record.studentNumber || 'N/A'],
    ['First Name', record.firstName],
    ['Last Name', record.lastName],
    ['Trimex Institutional Email', record.email],
    ['Academic Section', record.section || 'WITMWD3M1'],
    ['Submission Timestamp', record.submittedAt],
    ['Duration (Seconds)', record.timeSpentSeconds],
    [],
    ['EXAMINATION EVALUATION'],
    ['Total Score', `${record.score} / ${record.totalQuestions}`],
    ['Score Percentage', `${record.percentage.toFixed(1)}%`],
    ['Passing Cutoff', '15 / 20 (75.0%)'],
    ['Official Status', record.isPassed ? 'PASSED' : 'FAILED'],
    ['Incorrect Questions', record.answers.filter(a => !a.isCorrect).map((_, i) => `Item ${i + 1}`).join(', ') || 'None (Perfect Score)'],
    [],
    ['CYBERSECURITY & PROCTORING AUDIT'],
    ['Alt+Tab / Window Blur Strikes', record.altTabStrikes],
    ['AI Copy / Text Selection Attempts', record.highlightAttempts],
    ['Total Recorded Violations', record.violations.length],
    ['Proctoring Risk Level', record.proctorRiskLevel],
    ['Security Protocol Check', record.altTabStrikes > 2 ? 'FLAGGED FOR MANUAL FACULTY REVIEW' : 'VERIFIED NORMAL EXAM INTEGRITY']
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  // Style column widths
  wsSummary['!cols'] = [{ wch: 35 }, { wch: 55 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Score Summary');

  // Sheet 2: Detailed Question-by-Question Audit & Explanations (1 to 20)
  const auditHeaders = [
    'Item #',
    'Result Status',
    'Question Text',
    'Student Selected Answer',
    'Official Correct Answer',
    'Slide Reference',
    'Acceptable Reason & Concept Explanation'
  ];

  const auditRows = record.answers.map((ans, idx) => {
    return [
      idx + 1,
      ans.isCorrect ? 'CORRECT' : 'INCORRECT',
      ans.questionText,
      ans.selectedOption,
      ans.correctOption,
      ans.slideReference,
      // Explain rationale
      ans.isCorrect
        ? `CORRECT: Student accurately identified the core NSTP 2 principle demonstrated in ${ans.slideReference}.`
        : `INCORRECT: Selected "${ans.selectedOption}". The correct principle requires understanding ${ans.correctOption} as taught in ${ans.slideReference}.`
    ];
  });

  const wsAudit = XLSX.utils.aoa_to_sheet([auditHeaders, ...auditRows]);
  wsAudit['!cols'] = [
    { wch: 8 },
    { wch: 14 },
    { wch: 45 },
    { wch: 35 },
    { wch: 35 },
    { wch: 25 },
    { wch: 60 }
  ];
  XLSX.utils.book_append_sheet(wb, wsAudit, 'Itemized 1-20 Audit');

  // Sheet 3: Proctoring Telemetry Security Log
  const telemetryHeaders = ['Incident #', 'Timestamp', 'Incident Type', 'Severity', 'Description'];
  const telemetryRows = record.violations.map((v, i) => [
    i + 1,
    v.timestamp,
    v.type,
    v.severity.toUpperCase(),
    v.description
  ]);

  const wsTelemetry = XLSX.utils.aoa_to_sheet([
    telemetryHeaders,
    ...(telemetryRows.length > 0 ? telemetryRows : [['N/A', 'N/A', 'NONE', 'CLEAN', 'No cheating or security violations detected.']])
  ]);
  wsTelemetry['!cols'] = [{ wch: 12 }, { wch: 24 }, { wch: 22 }, { wch: 14 }, { wch: 50 }];
  XLSX.utils.book_append_sheet(wb, wsTelemetry, 'Proctor Security Log');

  // Download the file
  const fileName = `NSTP2_Volunteerism_Exam_${record.lastName}_${record.firstName}_Score${record.score}_of_20.xlsx`;
  XLSX.writeFile(wb, fileName);
}

export function exportBatchGradebookToExcel(records: QuizSubmissionRecord[]) {
  const wb = XLSX.utils.book_new();

  const headers = [
    'Student ID',
    'First Name',
    'Last Name',
    'Trimex Email',
    'Section',
    'Score',
    'Total',
    'Percentage',
    'Status (Pass/Fail)',
    'Alt+Tab Strikes',
    'Highlight/Copy Attempts',
    'Risk Level',
    'Submission Date'
  ];

  const rows = records.map(r => [
    r.studentNumber,
    r.firstName,
    r.lastName,
    r.email,
    r.section,
    r.score,
    r.totalQuestions,
    `${r.percentage.toFixed(1)}%`,
    r.isPassed ? 'PASSED' : 'FAILED',
    r.altTabStrikes,
    r.highlightAttempts,
    r.proctorRiskLevel,
    r.submittedAt
  ]);

  const ws = XLSX.utils.aoa_to_sheet([
    ['TRIMEX COLLEGES - OFFICIAL MASTER GRADEBOOK (NSTP 2 VOLUNTEERISM)'],
    ['Instructor: Professor Arjay Gonzales Caraca | Presenter: Gimbert B. Ludovice'],
    [],
    headers,
    ...rows
  ]);

  ws['!cols'] = [
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 32 },
    { wch: 12 },
    { wch: 8 },
    { wch: 8 },
    { wch: 12 },
    { wch: 12 },
    { wch: 16 },
    { wch: 20 },
    { wch: 18 },
    { wch: 22 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Master Gradebook');
  XLSX.writeFile(wb, `Trimex_NSTP2_Master_Gradebook_${new Date().toISOString().slice(0, 10)}.xlsx`);
}
