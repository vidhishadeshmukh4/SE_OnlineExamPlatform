
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExam } from "@/context/ExamContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Plus, AlertTriangle, Check, ArrowLeft, Save, Send } from "lucide-react";
import { Question } from "@/types";

const ExamCreationPage = () => {
  const navigate = useNavigate();
  const { addExam } = useExam();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("60");
  const [passingScore, setPassingScore] = useState("60");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeTab, setActiveTab] = useState("details");
  
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    type: "multiple-choice",
    text: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    points: 5,
  });

  const isDetailsValid = 
    title.trim() !== "" && 
    description.trim() !== "" && 
    !isNaN(Number(duration)) && 
    Number(duration) > 0 &&
    !isNaN(Number(passingScore)) && 
    Number(passingScore) > 0 && 
    Number(passingScore) <= 100;
  
  const isQuestionsValid = questions.length > 0;

  const addNewQuestion = () => {
    if (!currentQuestion.text || 
        (currentQuestion.type === "multiple-choice" && (!currentQuestion.options || !currentQuestion.correctAnswer)) ||
        (currentQuestion.type === "true-false" && !currentQuestion.correctAnswer)) {
      return;
    }
    
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      type: currentQuestion.type!,
      text: currentQuestion.text!,
      options: currentQuestion.options,
      correctAnswer: currentQuestion.correctAnswer!,
      points: currentQuestion.points || 5,
    };
    
    setQuestions([...questions, newQuestion]);
    
    // Reset form
    setCurrentQuestion({
      type: "multiple-choice",
      text: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      points: 5,
    });
  };

  const removeQuestion = (questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  const handleOptionChange = (index: number, value: string) => {
    if (!currentQuestion.options) return;
    
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const handleSaveExam = () => {
    addExam({
      title,
      description,
      duration: Number(duration),
      questions,
      isPublished: false,
      passingScore: Number(passingScore),
    });
    
    navigate("/dashboard");
  };

  const handlePublishExam = () => {
    addExam({
      title,
      description,
      duration: Number(duration),
      questions,
      isPublished: true,
      passingScore: Number(passingScore),
    });
    
    navigate("/dashboard");
  };
  
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
            <h1 className="text-3xl font-bold">Create New Exam</h1>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveExam} disabled={!isDetailsValid || !isQuestionsValid}>
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
            <Button onClick={handlePublishExam} disabled={!isDetailsValid || !isQuestionsValid}>
              <Send className="h-4 w-4 mr-2" />
              Publish Exam
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-[400px] mb-6">
            <TabsTrigger value="details">Exam Details</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Exam Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter exam title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter exam description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      placeholder="Enter duration in minutes"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="passingScore">Passing Score (%)</Label>
                    <Input
                      id="passingScore"
                      type="number"
                      min="1"
                      max="100"
                      placeholder="Enter passing score percentage"
                      value={passingScore}
                      onChange={(e) => setPassingScore(e.target.value)}
                    />
                  </div>
                </div>
                
                {!isDetailsValid && (
                  <div className="flex items-center bg-amber-50 text-amber-700 p-3 rounded-md">
                    <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                    <p className="text-sm">Please fill in all required fields with valid values.</p>
                  </div>
                )}
                
                <Button 
                  className="w-full" 
                  onClick={() => setActiveTab("questions")}
                  disabled={!isDetailsValid}
                >
                  Next: Add Questions
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="questions">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Questions List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Questions ({questions.length})</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {questions.length === 0 ? (
                      <div className="text-center py-10">
                        <p className="text-exam-text-secondary mb-4">No questions added yet.</p>
                        <p className="text-sm text-exam-text-secondary">
                          Use the form on the right to add exam questions.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {questions.map((question, index) => (
                          <div 
                            key={question.id}
                            className="border rounded-md p-4 relative"
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-2 h-6 w-6"
                              onClick={() => removeQuestion(question.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            
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
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Question Creation Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Add Question</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="questionType">Question Type</Label>
                      <Select
                        value={currentQuestion.type}
                        onValueChange={(value: "multiple-choice" | "true-false" | "short-answer") => 
                          setCurrentQuestion({ 
                            ...currentQuestion, 
                            type: value,
                            options: value === "multiple-choice" ? ["", "", "", ""] : undefined,
                            correctAnswer: value === "true-false" ? "true" : "",
                          })
                        }
                      >
                        <SelectTrigger id="questionType">
                          <SelectValue placeholder="Select question type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                          <SelectItem value="true-false">True/False</SelectItem>
                          <SelectItem value="short-answer">Short Answer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="questionText">Question Text</Label>
                      <Textarea
                        id="questionText"
                        placeholder="Enter the question"
                        value={currentQuestion.text}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="points">Points</Label>
                      <Input
                        id="points"
                        type="number"
                        min="1"
                        placeholder="Points"
                        value={currentQuestion.points}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, points: Number(e.target.value) })}
                      />
                    </div>
                    
                    {currentQuestion.type === "multiple-choice" && (
                      <div className="space-y-3">
                        <Label>Options</Label>
                        {currentQuestion.options?.map((option, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder={`Option ${index + 1}`}
                              value={option}
                              onChange={(e) => handleOptionChange(index, e.target.value)}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              type="button"
                              className={`flex-shrink-0 ${
                                option === currentQuestion.correctAnswer
                                  ? "bg-green-100 text-green-600"
                                  : ""
                              }`}
                              onClick={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: option })}
                            >
                              {option === currentQuestion.correctAnswer ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <span className="text-xs">Set</span>
                              )}
                            </Button>
                          </div>
                        ))}
                        <p className="text-xs text-exam-text-secondary">
                          Click "Set" to mark the correct answer.
                        </p>
                      </div>
                    )}
                    
                    {currentQuestion.type === "true-false" && (
                      <div className="space-y-2">
                        <Label>Correct Answer</Label>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant={currentQuestion.correctAnswer === "true" ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: "true" })}
                          >
                            True
                          </Button>
                          <Button
                            type="button"
                            variant={currentQuestion.correctAnswer === "false" ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: "false" })}
                          >
                            False
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {currentQuestion.type === "short-answer" && (
                      <div className="space-y-2">
                        <Label htmlFor="keywords">Keywords (comma separated)</Label>
                        <Textarea
                          id="keywords"
                          placeholder="Enter keywords for correct answer, separated by commas"
                          value={Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer.join(", ") : currentQuestion.correctAnswer}
                          onChange={(e) => {
                            const keywords = e.target.value.split(",").map(k => k.trim()).filter(k => k);
                            setCurrentQuestion({ ...currentQuestion, correctAnswer: keywords });
                          }}
                          rows={3}
                        />
                        <p className="text-xs text-exam-text-secondary">
                          Enter keywords that should be present in the correct answer.
                          The answer will be marked correct if any of these keywords are found.
                        </p>
                      </div>
                    )}
                    
                    <Button 
                      onClick={addNewQuestion} 
                      className="w-full"
                      disabled={
                        !currentQuestion.text || 
                        (currentQuestion.type === "multiple-choice" && 
                          (!currentQuestion.options?.some(o => o.trim() !== "") || 
                           !currentQuestion.correctAnswer)) ||
                        (currentQuestion.type === "true-false" && !currentQuestion.correctAnswer) ||
                        (currentQuestion.type === "short-answer" && 
                          (!Array.isArray(currentQuestion.correctAnswer) || 
                           currentQuestion.correctAnswer.length === 0))
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("details")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Details
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleSaveExam}
                  disabled={!isQuestionsValid || !isDetailsValid}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </Button>
                <Button 
                  onClick={handlePublishExam}
                  disabled={!isQuestionsValid || !isDetailsValid}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Publish Exam
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ExamCreationPage;
