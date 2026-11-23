import mongoose from 'mongoose';
import Todo from '../models/Todo.js';
import { memoryStore } from '../config/memoryStore.js';

/**
 * @desc    Create a new todo task
 * @route   POST /api/todos
 * @access  Private
 */
export const createTodo = async (req, res, next) => {
  try {
    const { title, description, category, priority, dueDate, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required.',
      });
    }

    const isDbConnected = mongoose.connection.readyState === 1;
    let newTodo;

    if (isDbConnected) {
      newTodo = await Todo.create({
        title: title.trim(),
        description: description ? description.trim() : '',
        category: category || 'Work',
        priority: priority || 'Medium',
        status: status || 'Pending',
        dueDate: dueDate ? new Date(dueDate) : null,
        completedAt: status === 'Completed' ? new Date() : null,
        user: req.user._id,
      });
    } else {
      newTodo = {
        _id: new mongoose.Types.ObjectId().toString(),
        title: title.trim(),
        description: description ? description.trim() : '',
        category: category || 'Work',
        priority: priority || 'Medium',
        status: status || 'Pending',
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        completedAt: status === 'Completed' ? new Date().toISOString() : null,
        user: req.user._id.toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      memoryStore.todos.unshift(newTodo);
    }

    return res.status(201).json({
      success: true,
      message: 'Todo created successfully!',
      todo: newTodo,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all todos with filtering, search, and sorting
 * @route   GET /api/todos
 * @access  Private
 */
export const getTodos = async (req, res, next) => {
  try {
    const {
      search,
      status,
      priority,
      category,
      overdue,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const query = { user: req.user._id };

      if (status && status !== 'all' && ['Pending', 'Completed'].includes(status)) {
        query.status = status;
      }
      if (priority && priority !== 'all' && ['Low', 'Medium', 'High'].includes(priority)) {
        query.priority = priority;
      }
      if (category && category !== 'all') {
        query.category = category;
      }
      if (overdue === 'true') {
        query.status = 'Pending';
        query.dueDate = { $lt: new Date(), $ne: null };
      }
      if (search && search.trim()) {
        const searchRegex = new RegExp(search.trim(), 'i');
        query.$or = [{ title: searchRegex }, { description: searchRegex }];
      }

      const sort = {};
      const order = sortOrder === 'asc' ? 1 : -1;

      if (sortBy === 'dueDate') {
        sort.dueDate = order;
      } else if (sortBy === 'priority') {
        sort.priority = order;
      } else if (sortBy === 'title') {
        sort.title = order;
      } else {
        sort.createdAt = order;
      }

      const todos = await Todo.find(query).sort(sort);

      return res.status(200).json({
        success: true,
        count: todos.length,
        todos,
      });
    }

    // In-Memory fallback implementation
    const userId = req.user._id.toString();
    const now = new Date();

    let filtered = memoryStore.todos.filter((t) => t.user.toString() === userId);

    if (status && status !== 'all') {
      filtered = filtered.filter((t) => t.status === status);
    }

    if (priority && priority !== 'all') {
      filtered = filtered.filter((t) => t.priority === priority);
    }

    if (category && category !== 'all') {
      filtered = filtered.filter((t) => t.category.toLowerCase() === category.toLowerCase());
    }

    if (overdue === 'true') {
      filtered = filtered.filter(
        (t) => t.status === 'Pending' && t.dueDate && new Date(t.dueDate) < now
      );
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (t) =>
          (t.title && t.title.toLowerCase().includes(q)) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'dueDate') {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        comparison = dateA - dateB;
      } else if (sortBy === 'title') {
        comparison = (a.title || '').localeCompare(b.title || '');
      } else if (sortBy === 'priority') {
        const weights = { High: 3, Medium: 2, Low: 1 };
        comparison = (weights[a.priority] || 0) - (weights[b.priority] || 0);
      } else {
        // createdAt
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        comparison = dateA - dateB;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return res.status(200).json({
      success: true,
      count: filtered.length,
      todos: filtered,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard metrics & task statistics
 * @route   GET /api/todos/stats
 * @access  Private
 */
export const getTodoStats = async (req, res, next) => {
  try {
    const userId = req.user._id.toString();
    const now = new Date();
    const isDbConnected = mongoose.connection.readyState === 1;

    let allUserTodos = [];
    let upcomingTasks = [];
    let recentTasks = [];

    if (isDbConnected) {
      [allUserTodos, upcomingTasks, recentTasks] = await Promise.all([
        Todo.find({ user: req.user._id }),
        Todo.find({
          user: req.user._id,
          status: 'Pending',
          dueDate: { $gte: now },
        })
          .sort({ dueDate: 1 })
          .limit(5),
        Todo.find({ user: req.user._id })
          .sort({ updatedAt: -1 })
          .limit(5),
      ]);
    } else {
      allUserTodos = memoryStore.todos.filter((t) => t.user.toString() === userId);
      upcomingTasks = allUserTodos
        .filter((t) => t.status === 'Pending' && t.dueDate && new Date(t.dueDate) >= now)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5);
      recentTasks = [...allUserTodos]
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
        .slice(0, 5);
    }

    const total = allUserTodos.length;
    let completed = 0;
    let pending = 0;
    let overdue = 0;

    const byPriority = {
      Low: 0,
      Medium: 0,
      High: 0,
    };

    const byCategory = {
      Work: 0,
      Personal: 0,
      Study: 0,
      Health: 0,
      Finance: 0,
      Shopping: 0,
      Other: 0,
    };

    allUserTodos.forEach((todo) => {
      if (todo.status === 'Completed') {
        completed += 1;
      } else {
        pending += 1;
        if (todo.dueDate && new Date(todo.dueDate) < now) {
          overdue += 1;
        }
      }

      if (byPriority[todo.priority] !== undefined) {
        byPriority[todo.priority] += 1;
      }

      if (byCategory[todo.category] !== undefined) {
        byCategory[todo.category] += 1;
      } else {
        byCategory.Other += 1;
      }
    });

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return res.status(200).json({
      success: true,
      stats: {
        total,
        completed,
        pending,
        overdue,
        completionRate,
        byPriority,
        byCategory,
        upcomingTasks,
        recentTasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single todo by ID
 * @route   GET /api/todos/:id
 * @access  Private
 */
export const getTodoById = async (req, res, next) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let todo;

    if (isDbConnected) {
      todo = await Todo.findById(req.params.id);
    } else {
      todo = memoryStore.todos.find((t) => t._id.toString() === req.params.id.toString());
    }

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo item not found.',
      });
    }

    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to access this task.',
      });
    }

    return res.status(200).json({
      success: true,
      todo,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a todo task
 * @route   PUT /api/todos/:id
 * @access  Private
 */
export const updateTodo = async (req, res, next) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let updatedTodo;

    if (isDbConnected) {
      const todo = await Todo.findById(req.params.id);

      if (!todo) {
        return res.status(404).json({ success: false, message: 'Todo item not found.' });
      }

      if (todo.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Forbidden: You cannot modify tasks that do not belong to you.' });
      }

      const { title, description, category, priority, status, dueDate } = req.body;

      if (title !== undefined) todo.title = title.trim();
      if (description !== undefined) todo.description = description.trim();
      if (category !== undefined) todo.category = category;
      if (priority !== undefined) todo.priority = priority;

      if (dueDate !== undefined) {
        todo.dueDate = dueDate ? new Date(dueDate) : null;
      }

      if (status !== undefined) {
        todo.status = status;
        if (status === 'Completed' && !todo.completedAt) {
          todo.completedAt = new Date();
        } else if (status === 'Pending') {
          todo.completedAt = null;
        }
      }

      updatedTodo = await todo.save();
    } else {
      const index = memoryStore.todos.findIndex((t) => t._id.toString() === req.params.id.toString());

      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Todo item not found.' });
      }

      const todo = memoryStore.todos[index];

      if (todo.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Forbidden: You cannot modify tasks that do not belong to you.' });
      }

      const { title, description, category, priority, status, dueDate } = req.body;

      if (title !== undefined) todo.title = title.trim();
      if (description !== undefined) todo.description = description.trim();
      if (category !== undefined) todo.category = category;
      if (priority !== undefined) todo.priority = priority;

      if (dueDate !== undefined) {
        todo.dueDate = dueDate ? new Date(dueDate).toISOString() : null;
      }

      if (status !== undefined) {
        todo.status = status;
        if (status === 'Completed') {
          todo.completedAt = new Date().toISOString();
        } else {
          todo.completedAt = null;
        }
      }

      todo.updatedAt = new Date().toISOString();
      updatedTodo = todo;
    }

    return res.status(200).json({
      success: true,
      message: 'Todo updated successfully!',
      todo: updatedTodo,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle or update status of a todo task
 * @route   PATCH /api/todos/:id/status
 * @access  Private
 */
export const updateTodoStatus = async (req, res, next) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let updatedTodo;
    let targetStatus;

    if (isDbConnected) {
      const todo = await Todo.findById(req.params.id);

      if (!todo) {
        return res.status(404).json({ success: false, message: 'Todo item not found.' });
      }

      if (todo.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Forbidden: You cannot update tasks that do not belong to you.' });
      }

      const { status } = req.body;
      targetStatus = status || (todo.status === 'Completed' ? 'Pending' : 'Completed');

      todo.status = targetStatus;
      todo.completedAt = targetStatus === 'Completed' ? new Date() : null;
      updatedTodo = await todo.save();
    } else {
      const index = memoryStore.todos.findIndex((t) => t._id.toString() === req.params.id.toString());

      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Todo item not found.' });
      }

      const todo = memoryStore.todos[index];

      if (todo.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Forbidden: You cannot update tasks that do not belong to you.' });
      }

      const { status } = req.body;
      targetStatus = status || (todo.status === 'Completed' ? 'Pending' : 'Completed');

      todo.status = targetStatus;
      todo.completedAt = targetStatus === 'Completed' ? new Date().toISOString() : null;
      todo.updatedAt = new Date().toISOString();
      updatedTodo = todo;
    }

    return res.status(200).json({
      success: true,
      message: `Task marked as ${targetStatus.toLowerCase()}!`,
      todo: updatedTodo,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a single todo task
 * @route   DELETE /api/todos/:id
 * @access  Private
 */
export const deleteTodo = async (req, res, next) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const todo = await Todo.findById(req.params.id);

      if (!todo) {
        return res.status(404).json({ success: false, message: 'Todo item not found.' });
      }

      if (todo.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Forbidden: You cannot delete tasks that do not belong to you.' });
      }

      await todo.deleteOne();
    } else {
      const index = memoryStore.todos.findIndex((t) => t._id.toString() === req.params.id.toString());

      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Todo item not found.' });
      }

      if (memoryStore.todos[index].user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Forbidden: You cannot delete tasks that do not belong to you.' });
      }

      memoryStore.todos.splice(index, 1);
    }

    return res.status(200).json({
      success: true,
      message: 'Todo task deleted successfully!',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear all completed tasks for current user
 * @route   DELETE /api/todos/completed/clear
 * @access  Private
 */
export const clearCompletedTodos = async (req, res, next) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let deletedCount = 0;

    if (isDbConnected) {
      const result = await Todo.deleteMany({
        user: req.user._id,
        status: 'Completed',
      });
      deletedCount = result.deletedCount;
    } else {
      const userId = req.user._id.toString();
      const initialCount = memoryStore.todos.length;
      memoryStore.todos = memoryStore.todos.filter(
        (t) => !(t.user.toString() === userId && t.status === 'Completed')
      );
      deletedCount = initialCount - memoryStore.todos.length;
    }

    return res.status(200).json({
      success: true,
      message: `Cleared ${deletedCount} completed task(s).`,
      deletedCount,
    });
  } catch (error) {
    next(error);
  }
};
