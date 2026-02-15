import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Dependency from '@/models/Dependency';
import Task from '@/models/Task';
import { wouldCreateCycle } from '@/lib/topologicalSort';

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { providerId, dependentId } = await request.json();
    
    // Validate input
    if (!providerId || !dependentId) {
      return NextResponse.json(
        { error: 'Provider and dependent task IDs are required' },
        { status: 400 }
      );
    }
    
    if (providerId === dependentId) {
      return NextResponse.json(
        { error: 'A task cannot depend on itself' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // Verify both tasks exist and belong to user
    const providerTask = await Task.findOne({ _id: providerId, userId: user.id });
    const dependentTask = await Task.findOne({ _id: dependentId, userId: user.id });
    
    if (!providerTask || !dependentTask) {
      return NextResponse.json(
        { error: 'One or both tasks not found' },
        { status: 404 }
      );
    }
    
    // Check if dependency already exists
    const existingDep = await Dependency.findOne({
      userId: user.id,
      providerId,
      dependentId,
    });
    
    if (existingDep) {
      return NextResponse.json(
        { error: 'This dependency already exists' },
        { status: 400 }
      );
    }
    
    // CRITICAL: Check for cycles before creating dependency
    const allDependencies = (await Dependency.find({ userId: user.id }).lean()) as IDependency[];
    
    if (wouldCreateCycle(allDependencies, providerId, dependentId)) {
      return NextResponse.json(
        { error: '⚠️ Cycle Detected! Cannot create this dependency as it would create an infinite loop.' },
        { status: 400 }
      );
    }
    
    // Create the dependency
    const dependency = await Dependency.create({
      userId: user.id,
      providerId,
      dependentId,
    });
    
    return NextResponse.json({
      dependency: {
        ...dependency.toObject(),
        _id: dependency._id.toString(),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating dependency:', error);
    return NextResponse.json(
      { error: 'Failed to create dependency' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const dependencyId = searchParams.get('id');
    
    if (!dependencyId) {
      return NextResponse.json(
        { error: 'Dependency ID is required' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // Delete the dependency
    const dependency = await Dependency.findOneAndDelete({
      _id: dependencyId,
      userId: user.id,
    });
    
    if (!dependency) {
      return NextResponse.json(
        { error: 'Dependency not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Dependency deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting dependency:', error);
    return NextResponse.json(
      { error: 'Failed to delete dependency' },
      { status: 500 }
    );
  }
}
