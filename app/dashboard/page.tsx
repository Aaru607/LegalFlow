"use client";

import { useEffect } from 'react';
import { UserButton } from '@clerk/nextjs';
import { Workflow, Loader2 } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { TaskCard } from '@/components/TaskCard';
import { TaskCreator } from '@/components/TaskCreator';
import { DependencyManager } from '@/components/DependencyManager';
import { Toaster } from '@/components/ui/toaster';

export default function DashboardPage() {
  const { tasks, loading, error, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header with gradient */}
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <Workflow className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  LegalFlow
                </h1>
                <p className="text-xs text-gray-500">Smart Task Management</p>
              </div>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Your Workflow Dashboard
            </h2>
            <p className="text-gray-600">
              Manage tasks with automatic dependency sorting and cycle detection.
            </p>
          </div>

          {/* Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Task Creation & Dependencies */}
            <div className="lg:col-span-1 space-y-6">
              <TaskCreator />
              <DependencyManager />
            </div>

            {/* Right Column - Task List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm min-h-[600px]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Sorted Tasks
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Tasks are automatically sorted by dependencies
                    </p>
                  </div>
                  {tasks.length > 0 && (
                    <div className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-sm font-medium">
                      {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
                    </div>
                  )}
                </div>

                {/* Loading State */}
                {loading && (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-3" />
                    <p className="text-gray-500">Loading your tasks...</p>
                  </div>
                )}

                {/* Error State */}
                {error && !loading && (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                      <span className="text-3xl">⚠️</span>
                    </div>
                    <p className="text-red-600 font-medium mb-2">Error Loading Tasks</p>
                    <p className="text-gray-500 text-sm">{error}</p>
                  </div>
                )}

                {/* Empty State */}
                {!loading && !error && tasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center mb-4">
                      <Workflow className="h-10 w-10 text-purple-600" />
                    </div>
                    <p className="text-gray-900 font-medium mb-2">No tasks yet</p>
                    <p className="text-gray-500 text-sm text-center max-w-sm">
                      Create your first task to start building your workflow. Dependencies will be automatically sorted!
                    </p>
                  </div>
                )}

                {/* Task List */}
                {!loading && !error && tasks.length > 0 && (
                  <div className="space-y-3">
                    {tasks.map((task, index) => (
                      <div key={task._id} className="relative">
                        {/* Position indicator */}
                        <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                        <TaskCard task={task} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info Footer */}
          <div className="mt-8 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">💡</span>
              </div>
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-1">How it works:</p>
                <ul className="space-y-1 text-gray-600">
                  <li>• Tasks are automatically sorted using <strong>Kahn's Algorithm</strong> (Topological Sort)</li>
                  <li>• Locked tasks (🔒) cannot be completed until their dependencies are done</li>
                  <li>• The system prevents circular dependencies to avoid infinite loops</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Toaster />
    </div>
  );
}
