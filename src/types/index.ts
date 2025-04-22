
export type UserRole = "admin" | "examiner" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Question {
  id: string;
  type: "multiple-choice" | "true-false" | "short-answer";
  text: string;
  options?: string[];
  correctAnswer: string | string[];
  points: number;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  startDate?: Date;
  endDate?: Date;
  questions: Question[];
  createdBy: string; // user id
  isPublished: boolean;
  passingScore: number;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  answers: {
    questionId: string;
    answer: string | string[];
  }[];
  score?: number;
  isPassed?: boolean;
}

export interface ExamResult {
  examId: string;
  examTitle: string;
  userId: string;
  userName: string;
  score: number;
  totalPoints: number;
  percentageScore: number;
  isPassed: boolean;
  submittedAt: Date;
  timeTaken: number; // in minutes
  answerDetails: {
    questionId: string;
    isCorrect: boolean;
    points: number;
    userAnswer: string | string[];
    correctAnswer: string | string[];
  }[];
}
