import { create } from 'zustand';

export interface Task {
  _id: string;
  userId: string;
  name: string;
  completed: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Dependency {
  _id: string;
  userId: string;
  providerId: string;
  dependentId: string;
  createdAt: string;
}

interface TaskStore {
  tasks: Task[];
  dependencies: Dependency[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchTasks: () => Promise<void>;
  createTask: (name: string) => Promise<void>;
  toggleTask: (taskId: string, completed: boolean) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  createDependency: (providerId: string, dependentId: string) => Promise<void>;
  deleteDependency: (dependencyId: string) => Promise<void>;
  clearError: () => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  dependencies: [],
  loading: false,
  error: null,
  
  fetchTasks: async () => {
    set({ loading: true, error: null });
    
    try {
      const response = await fetch('/api/tasks');
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      const data = await response.json();
      set({ 
        tasks: data.tasks,
        dependencies: data.dependencies,
        loading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred',
        loading: false,
      });
    }
  },
  
  createTask: async (name: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create task');
      }
      
      // Refetch tasks to get the sorted list
      await get().fetchTasks();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred',
        loading: false,
      });
      throw error;
    }
  },
  
  toggleTask: async (taskId: string, completed: boolean) => {
    set({ error: null });
    
    // Optimistic update
    const currentTasks = get().tasks;
    set({
      tasks: currentTasks.map(task =>
        task._id === taskId ? { ...task, completed } : task
      ),
    });
    
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update task');
      }
      
      // Refetch to update locked states
      await get().fetchTasks();
    } catch (error) {
      // Revert optimistic update
      set({ tasks: currentTasks });
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred',
      });
      throw error;
    }
  },
  
  deleteTask: async (taskId: string) => {
    set({ error: null });
    
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete task');
      }
      
      // Remove task from state
      set({
        tasks: get().tasks.filter(task => task._id !== taskId),
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred',
      });
      throw error;
    }
  },
  
  createDependency: async (providerId: string, dependentId: string) => {
    set({ error: null });
    
    try {
      const response = await fetch('/api/dependency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ providerId, dependentId }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create dependency');
      }
      
      // Refetch tasks to get updated sort order and locked states
      await get().fetchTasks();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred',
      });
      throw error;
    }
  },
  
  deleteDependency: async (dependencyId: string) => {
    set({ error: null });
    
    try {
      const response = await fetch(`/api/dependency?id=${dependencyId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete dependency');
      }
      
      // Refetch tasks to get updated sort order and locked states
      await get().fetchTasks();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred',
      });
      throw error;
    }
  },
  
  clearError: () => set({ error: null }),
}));
