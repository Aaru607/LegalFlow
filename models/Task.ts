import mongoose, { Schema, model, models, Document } from 'mongoose';

// TypeScript interface for Task
export interface ITask extends Document {
  userId: string;
  name: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// MongoDB Schema
const TaskSchema = new Schema<ITask>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Task name is required'],
      trim: true,
      maxlength: [200, 'Task name cannot be more than 200 characters'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
TaskSchema.index({ userId: 1, createdAt: -1 });

// Export model - check if model exists to prevent OverwriteModelError
const Task = models.Task || model<ITask>('Task', TaskSchema);

export default Task;
