import mongoose, { Schema, model, models, Document } from 'mongoose';

// TypeScript interface for Dependency
export interface IDependency extends Document {
  userId: string;
  providerId: string; // Task that must be completed first
  dependentId: string; // Task that depends on provider
  createdAt: Date;
}

// MongoDB Schema
const DependencySchema = new Schema<IDependency>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
    providerId: {
      type: String,
      required: [true, 'Provider task ID is required'],
    },
    dependentId: {
      type: String,
      required: [true, 'Dependent task ID is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient lookups
DependencySchema.index({ userId: 1, providerId: 1, dependentId: 1 }, { unique: true });
DependencySchema.index({ userId: 1, dependentId: 1 });

// Export model
const Dependency = models.Dependency || model<IDependency>('Dependency', DependencySchema);

export default Dependency;
