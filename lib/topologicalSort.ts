import { ITask } from '@/models/Task';
import { IDependency } from '@/models/Dependency';

/**
 * Represents the result of topological sorting
 */
export interface TopologicalSortResult {
  sortedTasks: ITask[];
  hasCycle: boolean;
}

/**
 * Detects if adding a new dependency would create a cycle
 * @param dependencies - All existing dependencies
 * @param newProviderId - The provider task ID for the new dependency
 * @param newDependentId - The dependent task ID for the new dependency
 * @returns true if cycle would be created, false otherwise
 */
export function wouldCreateCycle(
  dependencies: IDependency[],
  newProviderId: string,
  newDependentId: string
): boolean {
  // Create adjacency list including the hypothetical new edge
  const graph = new Map<string, string[]>();
  
  // Add existing dependencies
  dependencies.forEach(dep => {
    if (!graph.has(dep.providerId)) {
      graph.set(dep.providerId, []);
    }
    graph.get(dep.providerId)!.push(dep.dependentId);
  });
  
  // Add the new dependency we're testing
  if (!graph.has(newProviderId)) {
    graph.set(newProviderId, []);
  }
  graph.get(newProviderId)!.push(newDependentId);
  
  // Perform DFS to detect cycle
  const visited = new Set<string>();
  const recStack = new Set<string>();
  
  function hasCycleDFS(node: string): boolean {
    visited.add(node);
    recStack.add(node);
    
    const neighbors = graph.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (hasCycleDFS(neighbor)) {
          return true;
        }
      } else if (recStack.has(neighbor)) {
        // Back edge found - cycle detected!
        return true;
      }
    }
    
    recStack.delete(node);
    return false;
  }
  
  // Check all nodes
  const allNodes = new Set<string>();
  dependencies.forEach(dep => {
    allNodes.add(dep.providerId);
    allNodes.add(dep.dependentId);
  });
  allNodes.add(newProviderId);
  allNodes.add(newDependentId);
  
  for (const node of allNodes) {
    if (!visited.has(node)) {
      if (hasCycleDFS(node)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Performs topological sort using Kahn's Algorithm
 * @param tasks - Array of tasks to sort
 * @param dependencies - Array of dependencies between tasks
 * @returns Sorted tasks in valid execution order
 */
export function topologicalSort(
  tasks: ITask[],
  dependencies: IDependency[]
): TopologicalSortResult {
  // Create a map for quick task lookup
  const taskMap = new Map<string, ITask>();
  tasks.forEach(task => {
    taskMap.set(task._id.toString(), task);
  });
  
  // Build adjacency list and in-degree count
  const graph = new Map<string, string[]>();
  const inDegree = new Map<string, number>();
  
  // Initialize all tasks with 0 in-degree
  tasks.forEach(task => {
    const taskId = task._id.toString();
    graph.set(taskId, []);
    inDegree.set(taskId, 0);
  });
  
  // Build the graph from dependencies
  dependencies.forEach(dep => {
    const providerId = dep.providerId.toString();
    const dependentId = dep.dependentId.toString();
    
    // Only process if both tasks exist
    if (taskMap.has(providerId) && taskMap.has(dependentId)) {
      graph.get(providerId)!.push(dependentId);
      inDegree.set(dependentId, (inDegree.get(dependentId) || 0) + 1);
    }
  });
  
  // Kahn's Algorithm: Start with nodes that have no dependencies (in-degree = 0)
  const queue: string[] = [];
  inDegree.forEach((degree, taskId) => {
    if (degree === 0) {
      queue.push(taskId);
    }
  });
  
  const sortedTaskIds: string[] = [];
  
  // Process the queue
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    sortedTaskIds.push(currentId);
    
    // Reduce in-degree for all dependent tasks
    const dependents = graph.get(currentId) || [];
    dependents.forEach(dependentId => {
      const newDegree = inDegree.get(dependentId)! - 1;
      inDegree.set(dependentId, newDegree);
      
      // If in-degree becomes 0, add to queue
      if (newDegree === 0) {
        queue.push(dependentId);
      }
    });
  }
  
  // Check if all tasks were processed (no cycle)
  const hasCycle = sortedTaskIds.length !== tasks.length;
  
  // Convert sorted IDs back to task objects
  const sortedTasks = sortedTaskIds
    .map(id => taskMap.get(id))
    .filter((task): task is ITask => task !== undefined);
  
  return {
    sortedTasks,
    hasCycle,
  };
}

/**
 * Get all tasks that must be completed before a given task
 * @param taskId - The task to check dependencies for
 * @param dependencies - All dependencies
 * @returns Array of provider task IDs
 */
export function getTaskDependencies(
  taskId: string,
  dependencies: IDependency[]
): string[] {
  return dependencies
    .filter(dep => dep.dependentId.toString() === taskId)
    .map(dep => dep.providerId.toString());
}

/**
 * Check if a task can be completed (all dependencies are met)
 * @param taskId - The task to check
 * @param tasks - All tasks
 * @param dependencies - All dependencies
 * @returns true if task can be completed, false if locked
 */
export function isTaskUnlocked(
  taskId: string,
  tasks: ITask[],
  dependencies: IDependency[]
): boolean {
  const providerIds = getTaskDependencies(taskId, dependencies);
  
  // If no dependencies, task is unlocked
  if (providerIds.length === 0) {
    return true;
  }
  
  // Check if all provider tasks are completed
  const taskMap = new Map<string, ITask>();
  tasks.forEach(task => {
    taskMap.set(task._id.toString(), task);
  });
  
  return providerIds.every(providerId => {
    const providerTask = taskMap.get(providerId);
    return providerTask?.completed === true;
  });
}
