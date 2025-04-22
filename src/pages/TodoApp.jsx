
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Plus, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  // Load todos from localStorage on initial render
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim() === '') {
      toast.error("Todo cannot be empty");
      return;
    }

    const todo = {
      id: Date.now(),
      text: newTodo,
      completed: false
    };

    setTodos([...todos, todo]);
    setNewTodo('');
    toast.success("Todo added successfully");
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast.info("Todo removed");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="container mx-auto max-w-md p-4 mt-10">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-exam-primary">Todo App</h1>
        
        <div className="flex gap-2 mb-6">
          <Input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a new todo..."
            className="flex-1"
          />
          <Button onClick={addTodo} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {todos.length > 0 ? (
            todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">No todos yet. Add some tasks above!</p>
          )}
        </div>
        
        {todos.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground text-right">
            {todos.filter(t => t.completed).length} of {todos.length} completed
          </div>
        )}
      </div>
    </div>
  );
};

const TodoItem = ({ todo, onToggle, onDelete }) => {
  return (
    <div className={`flex items-center justify-between p-3 border rounded-md group ${todo.completed ? 'bg-muted/50' : 'bg-card'}`}>
      <div className="flex items-center gap-3">
        <Checkbox 
          checked={todo.completed} 
          onCheckedChange={() => onToggle(todo.id)}
          className="h-5 w-5"
        />
        <span className={`${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
          {todo.text}
        </span>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
};

export default TodoApp;
