
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { BookOpenCheck, BookOpen, CheckSquare, Award, Clock, BarChart3 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-white shadow-sm py-4 border-b">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpenCheck className="h-8 w-8 text-exam-primary" />
            <h1 className="text-2xl font-bold text-exam-primary">ExamArena</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Log In
                </Button>
                <Button onClick={() => navigate("/login")}>Get Started</Button>
              </>
            )}
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-exam-primary to-exam-secondary text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Conduct Secure Online Exams with Instant Results
            </h1>
            <p className="text-lg mb-8">
              ExamArena provides a comprehensive platform for creating, 
              managing, and taking online exams with role-based access control, 
              various question types, and automated grading.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-white text-exam-primary hover:bg-gray-100"
                onClick={() => navigate("/login")}
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-exam-background p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="bg-exam-muted p-3 rounded-full mb-4">
                <BookOpen className="h-6 w-6 text-exam-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multiple Question Types</h3>
              <p className="text-exam-text-secondary">
                Create diverse exams with multiple choice, true/false, and short answer questions to test different types of knowledge.
              </p>
            </div>
            
            <div className="bg-exam-background p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="bg-exam-muted p-3 rounded-full mb-4">
                <CheckSquare className="h-6 w-6 text-exam-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Automatic Grading</h3>
              <p className="text-exam-text-secondary">
                Save time with instant grading and result generation as soon as students complete their exams.
              </p>
            </div>
            
            <div className="bg-exam-background p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="bg-exam-muted p-3 rounded-full mb-4">
                <Award className="h-6 w-6 text-exam-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
              <p className="text-exam-text-secondary">
                Secure platform with different permission levels for administrators, examiners, and students.
              </p>
            </div>
            
            <div className="bg-exam-background p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="bg-exam-muted p-3 rounded-full mb-4">
                <Clock className="h-6 w-6 text-exam-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Timed Assessments</h3>
              <p className="text-exam-text-secondary">
                Set time limits for exams to simulate real testing environments and ensure fair assessment.
              </p>
            </div>
            
            <div className="bg-exam-background p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="bg-exam-muted p-3 rounded-full mb-4">
                <BarChart3 className="h-6 w-6 text-exam-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Detailed Analytics</h3>
              <p className="text-exam-text-secondary">
                Access comprehensive reports and analytics to track student performance and identify areas for improvement.
              </p>
            </div>
            
            <div className="bg-exam-background p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="bg-exam-muted p-3 rounded-full mb-4">
                <BookOpenCheck className="h-6 w-6 text-exam-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Exam Management</h3>
              <p className="text-exam-text-secondary">
                Easily create, edit, and manage exams with a user-friendly interface designed for educators.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-exam-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-exam-text-secondary mb-8 max-w-2xl mx-auto">
            Join thousands of educators and institutions already using ExamArena to deliver secure, efficient online assessments.
          </p>
          <Button 
            size="lg" 
            className="bg-exam-primary hover:bg-exam-secondary"
            onClick={() => navigate("/login")}
          >
            Create Your First Exam
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 bg-white border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <BookOpenCheck className="h-6 w-6 text-exam-primary" />
              <span className="text-xl font-bold text-exam-primary">ExamArena</span>
            </div>
            <div className="text-exam-text-secondary text-sm">
              © 2025 ExamArena. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
