import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Task from '@/models/Task';
import Dependency from '@/models/Dependency';
import { isTaskUnlocked } from '@/lib/topologicalSort';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { completed } = await request.json();
    
    await dbConnect();
    
    // Find the task
    const task = await Task.findOne({
      _id: params.id,
      userId: user.id,
    });
    
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    // If trying to complete the task, check if it's unlocked
    if (completed && !task.completed) {
      const allTasks = await Task.find({ userId: user.id }).lean();
      const dependencies = await Dependency.find({ userId: user.id }).lean();
      
      const isUnlocked = isTaskUnlocked(params.id, allTasks, dependencies);
      
      if (!isUnlocked) {
        return NextResponse.json(
          { error: 'Cannot complete task. Dependencies are not met.' },
          { status: 400 }
        );
      }
    }
    
    // Update task
    task.completed = completed;
    await task.save();
    
    return NextResponse.json({
      task: {
        ...task.toObject(),
        _id: task._id.toString(),
      },
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    // Check if task has dependencies
    const hasDependencies = await Dependency.exists({
      userId: user.id,
      $or: [
        { providerId: params.id },
        { dependentId: params.id },
      ],
    });
    
    if (hasDependencies) {
      return NextResponse.json(
        { error: 'Cannot delete task with active dependencies. Remove dependencies first.' },
        { status: 400 }
      );
    }
    
    // Delete the task
    const task = await Task.findOneAndDelete({
      _id: params.id,
      userId: user.id,
    });
    
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
