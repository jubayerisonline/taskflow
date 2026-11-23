import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      trim: true,
      enum: {
        values: ['Work', 'Personal', 'Study', 'Health', 'Finance', 'Shopping', 'Other'],
        message: '{VALUE} is not a valid category',
      },
      default: 'Work',
    },
    priority: {
      type: String,
      required: [true, 'Please specify a priority'],
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: '{VALUE} is not a valid priority',
      },
      default: 'Medium',
    },
    status: {
      type: String,
      required: [true, 'Please specify a status'],
      enum: {
        values: ['Pending', 'Completed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Pending',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A todo must belong to a user'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for user querying and dashboard aggregation
todoSchema.index({ user: 1, status: 1 });
todoSchema.index({ user: 1, dueDate: 1 });
todoSchema.index({ user: 1, priority: 1 });
todoSchema.index({ user: 1, category: 1 });
todoSchema.index({ user: 1, createdAt: -1 });

const Todo = mongoose.model('Todo', todoSchema);

export default Todo;
