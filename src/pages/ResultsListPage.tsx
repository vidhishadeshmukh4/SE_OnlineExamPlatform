
import { useNavigate } from "react-router-dom";
import { useExam } from "@/context/ExamContext";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, CheckCircle2, Clock, FileText, XCircle } from "lucide-react";
import { format } from "date-fns";

const ResultsListPage = () => {
  const navigate = useNavigate();
  const { getUserResults } = useExam();
  const { user } = useAuth();
  
  const results = getUserResults();
  
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-exam-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center space-y-4">
              <p className="text-exam-text-secondary">Unauthorized access.</p>
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
        
        <Card>
          <CardHeader>
            <CardTitle>All Results</CardTitle>
          </CardHeader>
          {results.length === 0 ? (
            <CardContent className="text-center py-10">
              <div className="flex flex-col items-center justify-center">
                <FileText className="h-12 w-12 text-exam-text-secondary opacity-40 mb-4" />
                <p className="text-exam-text-secondary">No results found.</p>
                <p className="text-sm text-exam-text-secondary mt-2">
                  {user.role === "student" 
                    ? "You haven't taken any exams yet." 
                    : "No students have completed any exams yet."}
                </p>
              </div>
            </CardContent>
          ) : (
            <>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exam</TableHead>
                      {user.role !== "student" && <TableHead>Student</TableHead>}
                      <TableHead>Score</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time Taken</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result) => (
                      <TableRow key={`${result.examId}-${result.userId}`}>
                        <TableCell className="font-medium">{result.examTitle}</TableCell>
                        {user.role !== "student" && <TableCell>{result.userName}</TableCell>}
                        <TableCell>{result.score}/{result.totalPoints}</TableCell>
                        <TableCell>{result.percentageScore.toFixed(1)}%</TableCell>
                        <TableCell>
                          {result.isPassed ? (
                            <div className="flex items-center text-exam-success font-medium">
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Passed
                            </div>
                          ) : (
                            <div className="flex items-center text-exam-danger font-medium">
                              <XCircle className="h-4 w-4 mr-1" />
                              Failed
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {format(new Date(result.submittedAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-exam-text-secondary" />
                            <span>{result.timeTaken} mins</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/results/${result.examId}`)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="border-t py-4">
                <div className="text-sm text-exam-text-secondary">
                  Showing {results.length} result{results.length !== 1 ? "s" : ""}
                </div>
              </CardFooter>
            </>
          )}
        </Card>
      </main>
    </div>
  );
};

export default ResultsListPage;
