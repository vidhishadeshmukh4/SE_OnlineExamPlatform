
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useExam } from "@/context/ExamContext";
import { Clock, Edit, Eye, FileText, ListChecks, PenTool, PlusCircle, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const { getUserExams, getUserResults, getUserSubmissions, exams } = useExam();
  const navigate = useNavigate();
  
  const userExams = getUserExams();
  const userResults = getUserResults();
  const userSubmissions = getUserSubmissions();
  
  const totalExams = userExams.length;
  const completedExams = userSubmissions.length;
  const passedExams = userResults.filter(result => result.isPassed).length;
  const averageScore = userResults.length > 0
    ? userResults.reduce((sum, result) => sum + result.percentageScore, 0) / userResults.length
    : 0;
  
  const totalStudents = 25; // Mock data
  const totalExaminers = 5; // Mock data

  return (
    <div className="min-h-screen flex flex-col bg-exam-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-exam-text-primary mb-2">
            Welcome, {user?.name}!
          </h1>
          <p className="text-exam-text-secondary">
            {user?.role === "student"
              ? "Track your progress and take exams"
              : "Manage exams and view student results"}
          </p>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {user?.role === "student" ? (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Available Exams</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-3xl font-bold">{totalExams}</div>
                    <FileText className="h-8 w-8 text-exam-primary opacity-80" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Completed Exams</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-3xl font-bold">{completedExams}</div>
                    <ListChecks className="h-8 w-8 text-exam-secondary opacity-80" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Passed Exams</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-3xl font-bold">{passedExams}</div>
                    <PenTool className="h-8 w-8 text-exam-success opacity-80" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Average Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-3xl font-bold">{averageScore.toFixed(1)}%</div>
                    <Clock className="h-8 w-8 text-exam-accent opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Exams</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-3xl font-bold">{totalExams}</div>
                    <FileText className="h-8 w-8 text-exam-primary opacity-80" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Published Exams</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-3xl font-bold">{userExams.filter(exam => exam.isPublished).length}</div>
                    <ListChecks className="h-8 w-8 text-exam-secondary opacity-80" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-3xl font-bold">{totalStudents}</div>
                    <Users className="h-8 w-8 text-exam-success opacity-80" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Examiners</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-3xl font-bold">{totalExaminers}</div>
                    <PenTool className="h-8 w-8 text-exam-accent opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
        
        {/* Available Exams or Exam Management */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              {user?.role === "student" ? "Available Exams" : "Exam Management"}
            </h2>
            {(user?.role === "admin" || user?.role === "examiner") && (
              <Button onClick={() => navigate("/exams/create")}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create New Exam
              </Button>
            )}
          </div>
          
          {userExams.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-40">
                <p className="text-exam-text-secondary mb-4">
                  {user?.role === "student"
                    ? "No exams are available for you at the moment."
                    : "You haven't created any exams yet."}
                </p>
                {(user?.role === "admin" || user?.role === "examiner") && (
                  <Button onClick={() => navigate("/exams/create")}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Your First Exam
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userExams.map((exam) => (
                <Card key={exam.id} className="card-hover">
                  <CardHeader>
                    <CardTitle>{exam.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {exam.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-exam-text-secondary">Duration:</span>
                        <span className="font-semibold">{exam.duration} minutes</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-exam-text-secondary">Questions:</span>
                        <span className="font-semibold">{exam.questions.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-exam-text-secondary">Passing Score:</span>
                        <span className="font-semibold">{exam.passingScore}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-exam-text-secondary">Status:</span>
                        <span className={`font-semibold ${exam.isPublished ? "text-exam-success" : "text-exam-warning"}`}>
                          {exam.isPublished ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {user?.role === "student" ? (
                      <Button 
                        className="w-full" 
                        onClick={() => navigate(`/exams/${exam.id}/take`)}
                      >
                        Take Exam
                      </Button>
                    ) : (
                      <div className="flex gap-2 w-full">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => navigate(`/exams/${exam.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button 
                          className="flex-1"
                          onClick={() => navigate(`/exams/${exam.id}`)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {/* Recent Results */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Results</h2>
          
          {userResults.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-40">
                <p className="text-exam-text-secondary">
                  {user?.role === "student"
                    ? "You haven't taken any exams yet."
                    : "No students have completed exams yet."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userResults.slice(0, 3).map((result) => (
                <Card key={result.examId} className="card-hover">
                  <CardHeader>
                    <CardTitle>{result.examTitle}</CardTitle>
                    <CardDescription>
                      {user?.role === "student" ? "Your score" : `Student: ${result.userName}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-exam-text-secondary">Score:</span>
                        <span className="font-semibold">{result.score}/{result.totalPoints}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-exam-text-secondary">Percentage:</span>
                        <span className="font-semibold">{result.percentageScore.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-exam-text-secondary">Status:</span>
                        <span className={`font-semibold ${result.isPassed ? "text-exam-success" : "text-exam-danger"}`}>
                          {result.isPassed ? "Passed" : "Failed"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={() => navigate(`/results/${result.examId}`)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <footer className="py-6 border-t bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-exam-text-secondary">
            © 2025 ExamArena. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
