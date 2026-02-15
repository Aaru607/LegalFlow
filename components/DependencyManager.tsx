"use client";

import { useState } from 'react';
import { ArrowRight, Trash2, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTaskStore } from '@/store/taskStore';
import { useToast } from '@/hooks/use-toast';

export function DependencyManager() {
  const [providerId, setProviderId] = useState<string>('');
  const [dependentId, setDependentId] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  
  const { tasks, dependencies, createDependency, deleteDependency } = useTaskStore();
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!providerId || !dependentId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select both tasks",
      });
      return;
    }

    if (providerId === dependentId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "A task cannot depend on itself",
      });
      return;
    }

    setIsCreating(true);
    try {
      await createDependency(providerId, dependentId);
      setProviderId('');
      setDependentId('');
      toast({
        title: "🔗 Dependency Added",
        description: "Task dependency has been created successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create dependency",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (depId: string) => {
    try {
      await deleteDependency(depId);
      toast({
        title: "Dependency Removed",
        description: "The task dependency has been removed.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete dependency",
      });
    }
  };

  const getTaskName = (taskId: string) => {
    return tasks.find(t => t._id === taskId)?.name || 'Unknown Task';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <LinkIcon className="h-5 w-5 text-purple-600" />
        <h2 className="text-lg font-semibold text-gray-900">Manage Dependencies</h2>
      </div>
      
      {/* Add Dependency Section */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Dependent Task (needs completion of another)
            </label>
            <Select value={dependentId} onValueChange={setDependentId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select dependent task" />
              </SelectTrigger>
              <SelectContent>
                {tasks.map(task => (
                  <SelectItem key={task._id} value={task._id}>
                    {task.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-center">
            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-xs font-medium">
              depends on
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Provider Task (must be completed first)
            </label>
            <Select value={providerId} onValueChange={setProviderId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select provider task" />
              </SelectTrigger>
              <SelectContent>
                {tasks.map(task => (
                  <SelectItem key={task._id} value={task._id}>
                    {task.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleCreate}
          disabled={isCreating || !providerId || !dependentId || tasks.length < 2}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
        >
          <LinkIcon className="h-4 w-4 mr-2" />
          {isCreating ? 'Creating...' : 'Create Dependency'}
        </Button>
      </div>

      {/* Existing Dependencies */}
      {dependencies.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Active Dependencies</h3>
          <div className="space-y-2">
            {dependencies.map(dep => (
              <div
                key={dep._id}
                className="group flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 hover:border-purple-300 transition-colors"
              >
                <div className="flex-1 flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-900 truncate">
                    {getTaskName(dep.dependentId)}
                  </span>
                  <ArrowRight className="h-4 w-4 text-purple-500 flex-shrink-0" />
                  <span className="text-gray-600 truncate">
                    {getTaskName(dep.providerId)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(dep._id)}
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {dependencies.length === 0 && (
        <div className="text-center py-6 text-gray-400 text-sm">
          No dependencies yet. Create one above to get started.
        </div>
      )}
    </div>
  );
}
