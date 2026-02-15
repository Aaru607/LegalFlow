"use client";

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTaskStore } from '@/store/taskStore';
import { useToast } from '@/hooks/use-toast';

export function TaskCreator() {
  const [taskName, setTaskName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { createTask } = useTaskStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a task name",
      });
      return;
    }

    setIsCreating(true);
    try {
      await createTask(taskName.trim());
      setTaskName('');
      toast({
        title: "✨ Task Created",
        description: `"${taskName.trim()}" has been added to your workflow.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create task",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Task</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Enter task name..."
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            disabled={isCreating}
            className="w-full"
          />
        </div>
        
        <Button
          type="submit"
          disabled={isCreating || !taskName.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isCreating ? 'Adding Task...' : 'Add Task'}
        </Button>
      </form>
    </div>
  );
}
