import { ProctorViolation, Question } from '../types';

export const TRIMEX_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@(student\.)?trimexcolleges\.edu\.ph$/i;

export function validateTrimexEmail(email: string): { isValid: boolean; message: string } {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) {
    return { isValid: false, message: 'Institutional email is required.' };
  }

  // Reject personal or dummy email providers
  const prohibitedDomains = [
    'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com',
    'icloud.com', 'proton.me', 'protonmail.com', 'mail.com',
    'tempmail.com', 'yopmail.com', '10minutemail.com'
  ];

  const domain = trimmed.split('@')[1];
  if (prohibitedDomains.includes(domain)) {
    return {
      isValid: false,
      message: 'ACCESS DENIED: Personal email providers (@gmail, @yahoo, etc.) are strictly prohibited. You must use your official Trimex student institutional email (@student.trimexcolleges.edu.ph).'
    };
  }

  if (!TRIMEX_EMAIL_REGEX.test(trimmed)) {
    return {
      isValid: false,
      message: 'Invalid domain. Only official Trimex institutional emails (*@student.trimexcolleges.edu.ph or *@trimexcolleges.edu.ph) are permitted.'
    };
  }

  return { isValid: true, message: 'Valid Trimex Institutional Email verified.' };
}

export function generate6DigitOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Fisher-Yates array shuffling
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Shuffles questions while ensuring options remain synchronized with the correct answer
 */
export function prepareStudentQuestions(questions: Question[]): Question[] {
  // First shuffle the 20 questions
  const shuffledQuestions = shuffleArray(questions);

  // Then for each question, randomize the 4 options and preserve correctIndex
  return shuffledQuestions.map((q) => {
    const originalCorrectOption = q.options[q.correctIndex];
    const shuffledOptions = shuffleArray(q.options);
    const newCorrectIndex = shuffledOptions.indexOf(originalCorrectOption);

    return {
      ...q,
      options: shuffledOptions,
      correctIndex: newCorrectIndex
    };
  });
}

export function createProctorViolation(
  type: ProctorViolation['type'],
  description: string,
  questionIndex: number | null,
  severity: ProctorViolation['severity'] = 'medium'
): ProctorViolation {
  return {
    id: `viol_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toLocaleTimeString(),
    type,
    description,
    questionIndex: questionIndex !== null ? questionIndex + 1 : null,
    severity
  };
}

export const INITIAL_SAMPLE_GRADEBOOK = [
  {
    id: 'trimex_rec_01',
    studentId: 'std_01',
    studentNumber: '2023-01948',
    firstName: 'Maria',
    lastName: 'Santos',
    fullName: 'Maria Santos',
    email: 'msantos@student.trimexcolleges.edu.ph',
    section: 'WITMWD3M1',
    submittedAt: '2026-11-03 07:15:22',
    score: 18,
    totalQuestions: 20,
    percentage: 90.0,
    isPassed: true,
    timeSpentSeconds: 640,
    answers: [],
    violations: [],
    altTabStrikes: 0,
    highlightAttempts: 0,
    proctorRiskLevel: 'Clean' as const
  },
  {
    id: 'trimex_rec_02',
    studentId: 'std_02',
    studentNumber: '2023-02115',
    firstName: 'Joshua',
    lastName: 'Reyes',
    fullName: 'Joshua Reyes',
    email: 'jreyes@student.trimexcolleges.edu.ph',
    section: 'WITMWD3M1',
    submittedAt: '2026-11-03 07:42:09',
    score: 16,
    totalQuestions: 20,
    percentage: 80.0,
    isPassed: true,
    timeSpentSeconds: 820,
    answers: [],
    violations: [],
    altTabStrikes: 1,
    highlightAttempts: 2,
    proctorRiskLevel: 'Low Risk' as const
  },
  {
    id: 'trimex_rec_03',
    studentId: 'std_03',
    studentNumber: '2023-01824',
    firstName: 'Christian',
    lastName: 'Dela Cruz',
    fullName: 'Christian Dela Cruz',
    email: 'cdelacruz@student.trimexcolleges.edu.ph',
    section: 'WITMWD3M1',
    submittedAt: '2026-11-03 08:05:41',
    score: 14,
    totalQuestions: 20,
    percentage: 70.0,
    isPassed: false,
    timeSpentSeconds: 510,
    answers: [],
    violations: [],
    altTabStrikes: 3,
    highlightAttempts: 5,
    proctorRiskLevel: 'High Risk / Flagged' as const
  }
];
