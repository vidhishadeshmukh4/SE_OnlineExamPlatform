
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  BookOpenCheck, 
  LogOut, 
  PenTool, 
  Settings, 
  User, 
  BarChart3, 
  Home
} from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm py-4 border-b">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center gap-2">
          <BookOpenCheck className="h-8 w-8 text-exam-primary" />
          <h1 className="text-2xl font-bold text-exam-primary">ExamArena</h1>
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-1 text-exam-text-secondary hover:text-exam-primary transition-colors">
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              
              {(user.role === "admin" || user.role === "examiner") && (
                <Link to="/exams/create" className="flex items-center gap-1 text-exam-text-secondary hover:text-exam-primary transition-colors">
                  <PenTool className="w-4 h-4" />
                  <span>Create Exam</span>
                </Link>
              )}
              
              <Link to="/results" className="flex items-center gap-1 text-exam-text-secondary hover:text-exam-primary transition-colors">
                <BarChart3 className="w-4 h-4" />
                <span>Results</span>
              </Link>
            </nav>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground mt-1 capitalize">
                      {user.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/dashboard")}>
                  <Home className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Log In
            </Button>
            <Button onClick={() => navigate("/login")}>Get Started</Button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
