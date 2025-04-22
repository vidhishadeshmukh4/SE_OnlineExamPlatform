
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useExam } from "@/context/ExamContext";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Check, Clock, FileText, Pencil, PlayCircle, Trash2, ArrowLeft, Eye } from "lucide-react";

const ExamDetailPage = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { getExamById, deleteExam, publishExam } = useExam();
  const { user } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  
  const exam = getExamById(examId || "");
  
  if (!exam) {
    return (
      <div className="min-h-screen flex flex-col bg-exam-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center space-y-4">
              <p className="text-exam-text-secondary">Exam not found.</p>
              <Button onClick={() => navigate("/dashboard")}>Return to Dashboard</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const handleDelete = () => {
    deleteExam(exam.id);
    navigate("/dashboard");
  };
  
  const handlePublish = () => {
    publishExam(exam.id);
    setPublishDialogOpen(false);
  };

  const canEdit = user?.role === "admin" || (user?.role === "examiner" && user.id === exam.createdBy);

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
            <h1 className="text-3xl font-bold">{exam.title}</h1>
          </div>
          
          <div className="flex gap-2">
            {user?.role === "student" ? (
              <Button onClick={() => navigate(`/exams/${exam.id}/take`)}>
                <PlayCircle className="h-4 w-4 mr-2" />
                Take Exam
              </Button>
            ) : canEdit ? (
              <>
                {!exam.isPublished && (
                  <Button onClick={() => setPublishDialogOpen(true)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Publish
                  </Button>
                )}
                <Button variant="outline">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </>
            ) : null}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{exam.description}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Exam Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-exam-text-secondary">Status</span>
                <span className={`font-medium ${exam.isPublished ? "text-exam-success" : "text-exam-warning"}`}>
                  {exam.isPublished ? "Published" : "Draft"}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-exam-text-secondary">Duration</span>
                <span className="font-medium">{exam.duration} minutes</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-exam-text-secondary">Questions</span>
                <span className="font-medium">{exam.questions.length}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-exam-text-secondary">Passing Score</span>
                <span className="font-medium">{exam.passingScore}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-exam-text-secondary">Total Points</span>
                <span className="font-medium">
                  {exam.questions.reduce((sum, q) => sum + q.points, 0)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="questions">
          <TabsList className="mb-4">
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="questions">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Questions ({exam.questions.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {exam.questions.map((question, index) => (
                  <div 
                    key={question.id} 
                    className="border rounded-md p-4 mb-4 last:mb-0"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <span className="font-bold mr-2">Q{index + 1}</span>
                        <span className="bg-exam-muted text-exam-primary text-xs px-2 py-1 rounded-full">
                          {question.type === "multiple-choice" ? "Multiple Choice" : 
                           question.type === "true-false" ? "True/False" : "Short Answer"}
                        </span>
                      </div>
                      <span className="text-sm">
                        {question.points} points
                      </span>
                    </div>
                    
                    <p className="mb-3">{question.text}</p>
                    
                    {question.type === "multiple-choice" && question.options && (
                      <div className="pl-4 space-y-1">
                        {question.options.map((option, oIndex) => (
                          <div 
                            key={oIndex}
                            className={`flex items-center p-2 rounded-md ${
                              option === question.correctAnswer ? "bg-green-50 text-green-700" : ""
                            }`}
                          >
                            {option === question.correctAnswer && (
                              <Check className="h-4 w-4 mr-2 text-green-500" />
                            )}
                            <span>{option}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {question.type === "true-false" && (
                      <div className="pl-4 space-y-1">
                        <div className={`flex items-center p-2 rounded-md ${
                          question.correctAnswer === "true" ? "bg-green-50 text-green-700" : ""
                        }`}>
                          {question.correctAnswer === "true" && (
                            <Check className="h-4 w-4 mr-2 text-green-500" />
                          )}
                          <span>True</span>
                        </div>
                        <div className={`flex items-center p-2 rounded-md ${
                          question.correctAnswer === "false" ? "bg-green-50 text-green-700" : ""
                        }`}>
                          {question.correctAnswer === "false" && (
                            <Check className="h-4 w-4 mr-2 text-green-500" />
                          )}
                          <span>False</span>
                        </div>
                      </div>
                    )}
                    
                    {question.type === "short-answer" && (
                      <div className="pl-4 mt-2">
                        <div className="bg-green-50 text-green-700 p-2 rounded-md">
                          <p className="text-sm font-medium mb-1">Accepted keywords:</p>
                          {Array.isArray(question.correctAnswer) ? (
                            <div className="flex flex-wrap gap-1">
                              {question.correctAnswer.map((keyword, kIndex) => (
                                <span 
                                  key={kIndex}
                                  className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              {question.correctAnswer}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="submissions">
            <Card>
              <CardHeader>
                <CardTitle>Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <div className="flex flex-col items-center justify-center">
                    <FileText className="h-12 w-12 text-exam-text-secondary opacity-40 mb-4" />
                    <p className="text-exam-text-secondary">No submissions yet.</p>
                    <p className="text-sm text-exam-text-secondary mt-2">
                      Students will appear here after taking the exam.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Exam</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this exam? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Publish Confirmation Dialog */}
      <AlertDialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish Exam</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to publish this exam? Students will be able to take it after publishing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePublish}>
              Publish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExamDetailPage;
