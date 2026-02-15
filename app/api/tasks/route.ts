import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Task from '@/models/Task';
import Dependency from '@/models/Dependency';
import { topologicalSort, isTaskUnlocked } from '@/lib/topologicalSort';

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    const tasks = await Task.find({ userId: user.id }).lean();
    const dependencies = await Dependency.find({ userId: user.id }).lean();
    
    // Apply topological sort
    const { sortedTasks, hasCycle } = topologicalSort(tasks, dependencies);
    
    // If cycle detected, return error
    if (hasCycle) {
      return NextResponse.json(
        { error: 'Cycle detected in task dependencies' },
        { status: 400 }
      );
    }
    
    // Add locked status to each task
    const tasksWithLockStatus = sortedTasks.map(task => ({
      ...task,
      _id: task._id.toString(),
      isLocked: !isTaskUnlocked(task._id.toString(), tasks, dependencies),
    }));
    
    return NextResponse.json({
      tasks: tasksWithLockStatus,
      dependencies: dependencies.map(dep => ({
        ...dep,
        _id: dep._id.toString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { name } = await request.json();
    
    // Validate input
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Task name is required' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // Create new task
    const task = await Task.create({
      userId: user.id,
      name: name.trim(),
      completed: false,
    });
    
    return NextResponse.json({
      task: {
        ...task.toObject(),
        _id: task._id.toString(),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
