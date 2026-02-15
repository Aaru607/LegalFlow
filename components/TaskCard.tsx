"use client";

import { useState } from 'react';
import { Trash2, Lock, CheckCircle2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useTaskStore, type Task } from '@/store/taskStore';
import { useToast } from '@/hooks/use-toast';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toggleTask, deleteTask } = useTaskStore();
  const { toast } = useToast();

  const handleToggle = async () => {
    try {
      await toggleTask(task._id, !task.completed);
      
      if (!task.completed) {
        toast({
          title: "✅ Task Completed",
          description: `"${task.name}" has been marked as complete.`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update task",
      });
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      await deleteTask(task._id);
      toast({
        title: "Task Deleted",
        description: `"${task.name}" has been removed.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete task",
      });
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${
        task.isLocked
          ? 'bg-gray-50 border-gray-200 opacity-60'
          : task.completed
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:shadow-md'
          : 'bg-white border-gray-200 hover:shadow-lg hover:border-purple-300'
      }`}
    >
      {/* Gradient accent bar for unlocked tasks */}
      {!task.isLocked && !task.completed && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500" />
      )}
      
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox or Lock Icon */}
          <div className="flex-shrink-0 mt-0.5">
            {task.isLocked ? (
              <div className="h-5 w-5 rounded flex items-center justify-center bg-gray-200">
                <Lock className="h-3 w-3 text-gray-500" />
              </div>
            ) : (
              <Checkbox
                checked={task.completed}
                onCheckedChange={handleToggle}
                disabled={task.isLocked}
                className="h-5 w-5"
              />
            )}
          </div>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-medium leading-relaxed ${
                task.completed
                  ? 'text-gray-500 line-through'
                  : task.isLocked
                  ? 'text-gray-400'
                  : 'text-gray-900'
              }`}
            >
              {task.name}
            </p>
            
            {/* Status Badge */}
            <div className="flex items-center gap-2 mt-2">
              {task.isLocked && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                  <Lock className="h-3 w-3" />
                  Locked
                </span>
              )}
              {task.completed && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  <CheckCircle2 className="h-3 w-3" />
                  Completed
                </span>
              )}
              {!task.isLocked && !task.completed && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                  Pending
                </span>
              )}
            </div>
          </div>

          {/* Delete Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
