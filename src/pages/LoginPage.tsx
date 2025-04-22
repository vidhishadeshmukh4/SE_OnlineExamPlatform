
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpenCheck } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-exam-background p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <BookOpenCheck className="h-12 w-12 text-exam-primary mb-2" />
          <h1 className="text-2xl font-bold text-exam-primary">ExamArena</h1>
        </div>
        
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a 
                    href="#" 
                    className="text-sm text-exam-primary hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-exam-primary hover:bg-exam-secondary" 
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log in"}
              </Button>
            </form>
            
            <div className="mt-4 text-center text-sm">
              <p className="text-exam-text-secondary">
                Demo accounts:
              </p>
              <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                <div className="bg-exam-muted p-2 rounded">
                  <p className="font-semibold">Admin</p>
                  <p>admin@example.com</p>
                  <p>admin123</p>
                </div>
                <div className="bg-exam-muted p-2 rounded">
                  <p className="font-semibold">Examiner</p>
                  <p>examiner@example.com</p>
                  <p>examiner123</p>
                </div>
                <div className="bg-exam-muted p-2 rounded">
                  <p className="font-semibold">Student</p>
                  <p>student@example.com</p>
                  <p>student123</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-exam-text-secondary">
              Don&apos;t have an account?{" "}
              <a 
                href="#" 
                className="text-exam-primary hover:underline"
                onClick={() => navigate("/")}
              >
                Go back to home
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
