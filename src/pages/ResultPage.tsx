import { useNavigate, useParams } from "react-router-dom";
import { useExam } from "@/context/ExamContext";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Check, Clock, FileText, Medal, X } from "lucide-react";

const ResultPage = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const navigate = useNavigate();
  const { results, getExamById } = useExam();
  const { user } = useAuth();
  
  const result = results.find((r) => r.examId === resultId);
  
  if (!result || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-exam-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center space-y-4">
              <p className="text-exam-text-secondary">Result not found or unauthorized access.</p>
              <Button onClick={() => navigate("/dashboard")}>Return to Dashboard</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const exam = getExamById(result.examId);
  
  if (!exam) {
    return (
      <div className="min-h-screen flex flex-col bg-exam-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center space-y-4">
              <p className="text-exam-text-secondary">Exam not found for this result.</p>
              <Button onClick={() => navigate("/dashboard")}>Return to Dashboard</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-exam-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Exam Results</h1>
          </div>
        </div>
        
        {/* Result Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="col-span-3">
            <Card className="bg-gradient-to-br from-exam-primary to-exam-secondary text-white overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{exam.title}</h2>
                    <p className="text-white/80 mb-4">{result.isPassed ? "Congratulations! You passed the exam." : "You did not meet the passing score."}</p>
                    <div className="flex items-center mb-6">
                      <div className="flex items-center mr-6">
                        <FileText className="h-5 w-5 mr-2 opacity-80" />
                        <span>Score: {result.score} / {result.totalPoints}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 opacity-80" />
                        <span>Time: {result.timeTaken} minutes</span>
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 flex justify-between">
                        <span>Your score: {result.percentageScore.toFixed(1)}%</span>
                        <span>Passing score: {exam.passingScore}%</span>
                      </div>
                      <Progress value={result.percentageScore} className="h-2" />
                    </div>
                  </div>
                  <div className="mt-6 md:mt-0 text-center">
                    <div className="p-6">
                      {result.isPassed ? (
                        <Medal className="h-20 w-20 text-yellow-300 mx-auto" />
                      ) : (
                        <div className="h-20 w-20 flex items-center justify-center rounded-full border-4 border-red-400 mx-auto">
                          <X className="h-12 w-12" />
                        </div>
                      )}
                      <div className="mt-2 text-xl font-bold">
                        {result.isPassed ? "PASSED" : "FAILED"}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Detailed Results */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Questions & Answers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {exam.questions.map((question, index) => {
              const answerDetail = result.answerDetails.find(
                (a) => a.questionId === question.id
              );
              
              if (!answerDetail) return null;
              
              return (
                <div 
                  key={question.id}
                  className={`border rounded-md p-4 ${
                    answerDetail.isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <span className="font-bold mr-2">Q{index + 1}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        answerDetail.isCorrect 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {answerDetail.isCorrect ? (
                          <span className="flex items-center">
                            <Check className="h-3 w-3 mr-1" />
                            Correct
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <X className="h-3 w-3 mr-1" />
                            Incorrect
                          </span>
                        )}
                      </span>
                    </div>
                    <span className="text-sm">
                      {answerDetail.isCorrect ? answerDetail.points : 0} / {question.points} points
                    </span>
                  </div>
                  
                  <p className="mb-4">{question.text}</p>
                  
                  {question.type === "multiple-choice" && question.options && (
                    <div className="space-y-2 pl-4">
                      {question.options.map((option, oIndex) => (
                        <div 
                          key={oIndex}
                          className={`p-2 rounded-md flex items-center ${
                            option === answerDetail.correctAnswer
                              ? "bg-green-100 text-green-800" 
                              : option === answerDetail.userAnswer
                                ? "bg-red-100 text-red-800"
                                : ""
                          }`}
                        >
                          {option === answerDetail.correctAnswer ? (
                            <Check className="h-4 w-4 mr-2 text-green-600" />
                          ) : option === answerDetail.userAnswer ? (
                            <X className="h-4 w-4 mr-2 text-red-600" />
                          ) : null}
                          <span>{option}</span>
                          
                          {option === answerDetail.correctAnswer && (
                            <span className="ml-2 text-xs text-green-600">(Correct Answer)</span>
                          )}
                          {option === answerDetail.userAnswer && option !== answerDetail.correctAnswer && (
                            <span className="ml-2 text-xs text-red-600">(Your Answer)</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {question.type === "true-false" && (
                    <div className="space-y-2 pl-4">
                      <div className={`p-2 rounded-md flex items-center ${
                        answerDetail.correctAnswer === "true"
                          ? "bg-green-100 text-green-800" 
                          : answerDetail.userAnswer === "true"
                            ? "bg-red-100 text-red-800"
                            : ""
                      }`}>
                        {answerDetail.correctAnswer === "true" ? (
                          <Check className="h-4 w-4 mr-2 text-green-600" />
                        ) : answerDetail.userAnswer === "true" ? (
                          <X className="h-4 w-4 mr-2 text-red-600" />
                        ) : null}
                        <span>True</span>
                        
                        {answerDetail.correctAnswer === "true" && (
                          <span className="ml-2 text-xs text-green-600">(Correct Answer)</span>
                        )}
                        {answerDetail.userAnswer === "true" && answerDetail.correctAnswer !== "true" && (
                          <span className="ml-2 text-xs text-red-600">(Your Answer)</span>
                        )}
                      </div>
                      
                      <div className={`p-2 rounded-md flex items-center ${
                        answerDetail.correctAnswer === "false"
                          ? "bg-green-100 text-green-800" 
                          : answerDetail.userAnswer === "false"
                            ? "bg-red-100 text-red-800"
                            : ""
                      }`}>
                        {answerDetail.correctAnswer === "false" ? (
                          <Check className="h-4 w-4 mr-2 text-green-600" />
                        ) : answerDetail.userAnswer === "false" ? (
                          <X className="h-4 w-4 mr-2 text-red-600" />
                        ) : null}
                        <span>False</span>
                        
                        {answerDetail.correctAnswer === "false" && (
                          <span className="ml-2 text-xs text-green-600">(Correct Answer)</span>
                        )}
                        {answerDetail.userAnswer === "false" && answerDetail.correctAnswer !== "false" && (
                          <span className="ml-2 text-xs text-red-600">(Your Answer)</span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {question.type === "short-answer" && (
                    <div className="space-y-4 pl-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Your Answer:</p>
                        <div className={`p-3 rounded-md border ${
                          answerDetail.isCorrect ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"
                        }`}>
                          <p>{answerDetail.userAnswer as string || "No answer provided"}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-1">Expected Keywords:</p>
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(answerDetail.correctAnswer) ? (
                            answerDetail.correctAnswer.map((keyword, kIndex) => (
                              <span 
                                key={kIndex}
                                className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                              >
                                {keyword}
                              </span>
                            ))
                          ) : (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              {answerDetail.correctAnswer}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
        
        <div className="flex justify-between">
          <Button onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <Button onClick={() => navigate("/results")}>
            View All Results
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ResultPage;
