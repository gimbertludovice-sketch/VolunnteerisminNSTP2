export interface Student {
  id: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  section: string;
  loginTime: string;
  isVerified: boolean;
}

export interface QuestionRationale {
  correctReason: string;
  distractorAnalysis: string;
  slideReference: string;
  learningOutcome: string;
}

export interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctIndex: number;
  rationale: QuestionRationale;
  category: string;
  difficulty: 'Intermediate' | 'Challenging' | 'Advanced';
}

export interface ProctorViolation {
  id: string;
  timestamp: string;
  type: 'ALT_TAB_SWITCH' | 'WINDOW_BLUR' | 'TEXT_HIGHLIGHT_COPY' | 'AI_SHORTCUT_TRIGGER' | 'DEVTOOLS_ACCESS' | 'SCREENSHOT_ATTEMPT' | 'CONTEXT_MENU';
  description: string;
  questionIndex: number | null;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface QuizSubmissionRecord {
  id: string;
  studentId: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  section: string;
  submittedAt: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  isPassed: boolean;
  timeSpentSeconds: number;
  answers: {
    questionId: number;
    questionText: string;
    selectedOption: string;
    correctOption: string;
    isCorrect: boolean;
    slideReference: string;
  }[];
  violations: ProctorViolation[];
  altTabStrikes: number;
  highlightAttempts: number;
  proctorRiskLevel: 'Clean' | 'Low Risk' | 'Medium Risk' | 'High Risk / Flagged';
}

export interface SlideContent {
  id: number;
  pageNumber: number;
  title: string;
  subtitle?: string;
  badge?: string;
  keyIdea: string;
  cards: {
    number?: string;
    title: string;
    description: string;
    tag?: string;
    color?: string;
  }[];
}
