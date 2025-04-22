
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useExam } from "@/context/ExamContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BookOpenCheck, AlertTriangle, ArrowRight, Clock, ArrowLeft, Send } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Question, ExamSubmission } from "@/types";

const TakeExamPage = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { getExamById, submitExam } = useExam();
  const { user } = useAuth();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [examStartTime] = useState<Date>(new Date());
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  
  const exam = getExamById(examId || "");
  
  useEffect(() => {
    if (exam) {
      setTimeLeft(exam.duration * 60); // Convert minutes to seconds
    }
  }, [exam]);
  
  useEffect(() => {
    if (timeLeft === null) return;
    
    if (timeLeft <= 0) {
      handleSubmitExam();
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev !== null ? prev - 1 : null));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);
  
  if (!exam || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-exam-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-exam-text-secondary">Exam not found or unauthorized access.</p>
            <Button onClick={() => navigate("/dashboard")}>Return to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  
  const formatTime = (timeInSeconds: number) => {
    if (timeInSeconds < 0) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleSubmitExam = () => {
    if (!user) return;
    
    const submission: Omit<ExamSubmission, "id"> = {
      examId: exam.id,
      userId: user.id,
      startTime: examStartTime,
      answers: Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer
      }))
    };
    
    const result = submitExam(submission);
    navigate(`/results/${result.examId}`);
  };
  
  const isAnswered = (question: Question) => {
    return !!answers[question.id];
  };
  
  const progress = Math.round(
    (Object.keys(answers).length / exam.questions.length) * 100
  );
  
  return (
    <div className="min-h-screen flex flex-col bg-exam-background">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpenCheck className="h-6 w-6 text-exam-primary" />
            <div>
              <h1 className="text-lg font-bold text-exam-text-primary">{exam.title}</h1>
              <p className="text-sm text-exam-text-secondary">
                Question {currentQuestionIndex + 1} of {exam.questions.length}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-exam-text-secondary mr-2" />
              <span className={`font-mono text-lg ${timeLeft && timeLeft < 300 ? "text-exam-danger font-bold" : ""}`}>
                {timeLeft !== null ? formatTime(timeLeft) : "00:00"}
              </span>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => setConfirmSubmitOpen(true)}
            >
              Submit Exam
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        {/* Question Panel */}
        <div className="flex-1 space-y-6">
          <Card className="overflow-hidden">
            <div className="border-b bg-muted/30 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold">
                  Question {currentQuestionIndex + 1}
                </div>
                <div className="text-sm text-exam-text-secondary">
                  {currentQuestion.points} points
                </div>
              </div>
            </div>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <p className="text-lg font-medium mb-4">{currentQuestion.text}</p>
                  
                  {currentQuestion.type === "multiple-choice" && currentQuestion.options && (
                    <div className="space-y-2">
                      {currentQuestion.options.map((option, index) => (
                        <div
                          key={index}
                          className={`
                            border rounded-md p-4 flex items-center cursor-pointer transition-all
                            ${answers[currentQuestion.id] === option ? 
                              "bg-exam-primary text-white border-exam-primary" : 
                              "hover:border-exam-primary"
                            }
                          `}
                          onClick={() => handleAnswerChange(currentQuestion.id, option)}
                        >
                          <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300">
                            {answers[currentQuestion.id] === option && (
                              <span className="bg-white h-3 w-3 rounded-full" />
                            )}
                          </span>
                          <span>{option}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {currentQuestion.type === "true-false" && (
                    <div className="flex gap-4">
                      <div
                        className={`
                          flex-1 border rounded-md p-4 text-center cursor-pointer transition-all
                          ${answers[currentQuestion.id] === "true" ? 
                            "bg-exam-primary text-white border-exam-primary" : 
                            "hover:border-exam-primary"
                          }
                        `}
                        onClick={() => handleAnswerChange(currentQuestion.id, "true")}
                      >
                        <span>True</span>
                      </div>
                      
                      <div
                        className={`
                          flex-1 border rounded-md p-4 text-center cursor-pointer transition-all
                          ${answers[currentQuestion.id] === "false" ? 
                            "bg-exam-primary text-white border-exam-primary" : 
                            "hover:border-exam-primary"
                          }
                        `}
                        onClick={() => handleAnswerChange(currentQuestion.id, "false")}
                      >
                        <span>False</span>
                      </div>
                    </div>
                  )}
                  
                  {currentQuestion.type === "short-answer" && (
                    <Textarea
                      placeholder="Enter your answer here..."
                      className="h-40"
                      value={(answers[currentQuestion.id] as string) || ""}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    />
                  )}
                </div>
                
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  {currentQuestionIndex < exam.questions.length - 1 ? (
                    <Button
                      onClick={handleNextQuestion}
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setConfirmSubmitOpen(true)}
                    >
                      Submit Exam
                      <Send className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Question Navigator */}
        <div className="w-full md:w-64 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Progress</CardTitle>
              <CardDescription>
                {Object.keys(answers).length} of {exam.questions.length} answered
              </CardDescription>
              <Progress value={progress} className="h-2" />
            </CardHeader>
            <CardContent className="grid grid-cols-5 gap-2">
              {exam.questions.map((question, index) => (
                <Button
                  key={question.id}
                  variant={isAnswered(question) ? "default" : "outline"}
                  size="sm"
                  className={`h-10 w-10 p-0 font-normal ${
                    currentQuestionIndex === index ? "ring-2 ring-exam-accent" : ""
                  }`}
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                className="w-full"
                onClick={() => setConfirmSubmitOpen(true)}
              >
                Submit Exam
              </Button>
            </CardFooter>
          </Card>
          
          {/* Exam Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Exam Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-exam-text-secondary">Duration:</span>
                <span>{exam.duration} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-exam-text-secondary">Total Points:</span>
                <span>{exam.questions.reduce((sum, q) => sum + q.points, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-exam-text-secondary">Passing Score:</span>
                <span>{exam.passingScore}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Submit Confirmation Dialog */}
      <AlertDialog open={confirmSubmitOpen} onOpenChange={setConfirmSubmitOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Exam</AlertDialogTitle>
            <AlertDialogDescription>
              {Object.keys(answers).length < exam.questions.length ? (
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                  <span>
                    You have only answered {Object.keys(answers).length} out of {exam.questions.length} questions.
                    Unanswered questions will be marked as incorrect. Are you sure you want to submit?
                  </span>
                </div>
              ) : (
                "Are you sure you want to submit your exam? You won't be able to make changes after submission."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Exam</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmitExam}
            >
              Submit Exam
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TakeExamPage;
