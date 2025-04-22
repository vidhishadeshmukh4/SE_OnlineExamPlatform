
import React, { createContext, useContext, useState } from "react";
import { Exam, ExamSubmission, Question, ExamResult } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthContext";

// Mock exam data for demo purposes
const MOCK_EXAMS: Exam[] = [
  {
    id: "1",
    title: "Introduction to Computer Science",
    description: "Basic concepts of computer science and programming",
    duration: 60,
    startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        text: "Which data structure operates on a LIFO principle?",
        options: ["Queue", "Stack", "Linked List", "Tree"],
        correctAnswer: "Stack",
        points: 5,
      },
      {
        id: "q2",
        type: "true-false",
        text: "HTML is a programming language",
        correctAnswer: "false",
        points: 2,
      },
      {
        id: "q3",
        type: "short-answer",
        text: "Define what an algorithm is in your own words",
        correctAnswer: ["algorithm", "step by step", "procedure", "instructions"],
        points: 8,
      },
    ],
    createdBy: "2",
    isPublished: true,
    passingScore: 60,
  },
  {
    id: "2",
    title: "Advanced Mathematics",
    description: "Calculus and linear algebra concepts",
    duration: 90,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        text: "What is the derivative of ln(x)?",
        options: ["1/x", "x", "e^x", "1"],
        correctAnswer: "1/x",
        points: 5,
      },
      {
        id: "q2",
        type: "multiple-choice",
        text: "Which of the following is not a property of a positive definite matrix?",
        options: [
          "All eigenvalues are positive", 
          "Determinant is positive", 
          "It is symmetric", 
          "It is always invertible"
        ],
        correctAnswer: "It is symmetric",
        points: 5,
      },
    ],
    createdBy: "2",
    isPublished: false,
    passingScore: 70,
  },
];

const MOCK_SUBMISSIONS: ExamSubmission[] = [];

interface ExamContextType {
  exams: Exam[];
  submissions: ExamSubmission[];
  results: ExamResult[];
  addExam: (exam: Omit<Exam, "id" | "createdBy">) => void;
  updateExam: (exam: Exam) => void;
  deleteExam: (examId: string) => void;
  publishExam: (examId: string) => void;
  submitExam: (submission: Omit<ExamSubmission, "id">) => ExamResult;
  getExamById: (examId: string) => Exam | undefined;
  getUserExams: () => Exam[];
  getUserSubmissions: () => ExamSubmission[];
  getUserResults: () => ExamResult[];
  calculateResult: (submission: ExamSubmission) => ExamResult;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export function ExamProvider({ children }: { children: React.ReactNode }) {
  const [exams, setExams] = useState<Exam[]>(MOCK_EXAMS);
  const [submissions, setSubmissions] = useState<ExamSubmission[]>(MOCK_SUBMISSIONS);
  const [results, setResults] = useState<ExamResult[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const addExam = (exam: Omit<Exam, "id" | "createdBy">) => {
    if (!user) return;
    
    const newExam: Exam = {
      ...exam,
      id: `exam_${Date.now()}`,
      createdBy: user.id,
    };
    
    setExams([...exams, newExam]);
    toast({
      title: "Exam Created",
      description: "The exam has been created successfully.",
    });
  };

  const updateExam = (exam: Exam) => {
    setExams(exams.map((e) => (e.id === exam.id ? exam : e)));
    toast({
      title: "Exam Updated",
      description: "The exam has been updated successfully.",
    });
  };

  const deleteExam = (examId: string) => {
    setExams(exams.filter((e) => e.id !== examId));
    toast({
      title: "Exam Deleted",
      description: "The exam has been deleted successfully.",
    });
  };

  const publishExam = (examId: string) => {
    setExams(
      exams.map((e) =>
        e.id === examId ? { ...e, isPublished: true } : e
      )
    );
    toast({
      title: "Exam Published",
      description: "The exam has been published and is now available to students.",
    });
  };

  const getExamById = (examId: string) => {
    return exams.find((e) => e.id === examId);
  };

  const getUserExams = () => {
    if (!user) return [];
    
    if (user.role === "student") {
      return exams.filter((e) => e.isPublished);
    } else {
      return exams.filter((e) => e.createdBy === user.id || user.role === "admin");
    }
  };

  const getUserSubmissions = () => {
    if (!user) return [];
    
    if (user.role === "student") {
      return submissions.filter((s) => s.userId === user.id);
    } else {
      const userExamIds = exams
        .filter((e) => e.createdBy === user.id || user.role === "admin")
        .map((e) => e.id);
      
      return submissions.filter((s) => userExamIds.includes(s.examId));
    }
  };

  const getUserResults = () => {
    if (!user) return [];
    
    if (user.role === "student") {
      return results.filter((r) => r.userId === user.id);
    } else {
      const userExamIds = exams
        .filter((e) => e.createdBy === user.id || user.role === "admin")
        .map((e) => e.id);
      
      return results.filter((r) => userExamIds.includes(r.examId));
    }
  };

  const calculateResult = (submission: ExamSubmission): ExamResult => {
    const exam = exams.find((e) => e.id === submission.examId);
    if (!exam) {
      throw new Error("Exam not found");
    }

    const user = { id: submission.userId, name: "User", email: "" };
    let totalPoints = 0;
    let earnedPoints = 0;

    const answerDetails = submission.answers.map((answer) => {
      const question = exam.questions.find((q) => q.id === answer.questionId);
      if (!question) {
        throw new Error(`Question ${answer.questionId} not found in exam`);
      }

      let isCorrect = false;
      if (question.type === "short-answer") {
        // For short answer, we check if any keyword is present in the answer
        const keywords = question.correctAnswer as string[];
        const userAnswer = (answer.answer as string).toLowerCase();
        isCorrect = keywords.some(keyword => 
          userAnswer.includes(keyword.toLowerCase())
        );
      } else {
        // For multiple choice and true-false
        isCorrect = answer.answer === question.correctAnswer;
      }

      totalPoints += question.points;
      const points = isCorrect ? question.points : 0;
      earnedPoints += points;

      return {
        questionId: question.id,
        isCorrect,
        points: points,
        userAnswer: answer.answer,
        correctAnswer: question.correctAnswer,
      };
    });

    const percentageScore = (earnedPoints / totalPoints) * 100;
    const isPassed = percentageScore >= exam.passingScore;

    const result: ExamResult = {
      examId: exam.id,
      examTitle: exam.title,
      userId: submission.userId,
      userName: user.name,
      score: earnedPoints,
      totalPoints,
      percentageScore,
      isPassed,
      submittedAt: new Date(),
      timeTaken: submission.endTime 
        ? Math.round((submission.endTime.getTime() - submission.startTime.getTime()) / 60000)
        : exam.duration,
      answerDetails,
    };

    setResults([...results, result]);
    
    toast({
      title: isPassed ? "Exam Passed!" : "Exam Failed",
      description: `You scored ${percentageScore.toFixed(2)}%. ${isPassed ? "Congratulations!" : "Please try again."}`,
      variant: isPassed ? "default" : "destructive",
    });

    return result;
  };

  const submitExam = (submission: Omit<ExamSubmission, "id">) => {
    const newSubmission: ExamSubmission = {
      ...submission,
      id: `submission_${Date.now()}`,
      endTime: new Date(),
    };
    
    setSubmissions([...submissions, newSubmission]);
    
    return calculateResult(newSubmission);
  };

  return (
    <ExamContext.Provider
      value={{
        exams,
        submissions,
        results,
        addExam,
        updateExam,
        deleteExam,
        publishExam,
        submitExam,
        getExamById,
        getUserExams,
        getUserSubmissions,
        getUserResults,
        calculateResult,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
}

export function useExam() {
  const context = useContext(ExamContext);
  if (context === undefined) {
    throw new Error("useExam must be used within an ExamProvider");
  }
  return context;
}
