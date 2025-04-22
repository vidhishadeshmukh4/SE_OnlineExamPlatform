
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ExamProvider } from "./context/ExamContext";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ExamCreationPage from "./pages/ExamCreationPage";
import ExamDetailPage from "./pages/ExamDetailPage";
import TakeExamPage from "./pages/TakeExamPage";
import ResultPage from "./pages/ResultPage";
import ResultsListPage from "./pages/ResultsListPage";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRoles = ["admin", "examiner", "student"] }: { 
  children: React.ReactNode, 
  allowedRoles?: string[] 
}) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<LoginPage />} />
    
    <Route path="/dashboard" element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } />
    
    <Route path="/exams/create" element={
      <ProtectedRoute allowedRoles={["admin", "examiner"]}>
        <ExamCreationPage />
      </ProtectedRoute>
    } />
    
    <Route path="/exams/:examId" element={
      <ProtectedRoute>
        <ExamDetailPage />
      </ProtectedRoute>
    } />
    
    <Route path="/exams/:examId/take" element={
      <ProtectedRoute allowedRoles={["student"]}>
        <TakeExamPage />
      </ProtectedRoute>
    } />
    
    <Route path="/results/:resultId" element={
      <ProtectedRoute>
        <ResultPage />
      </ProtectedRoute>
    } />
    
    <Route path="/results" element={
      <ProtectedRoute>
        <ResultsListPage />
      </ProtectedRoute>
    } />
    
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ExamProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ExamProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
