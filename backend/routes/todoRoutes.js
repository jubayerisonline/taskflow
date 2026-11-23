import express from 'express';
import {
  createTodo,
  getTodos,
  getTodoStats,
  getTodoById,
  updateTodo,
  updateTodoStatus,
  deleteTodo,
  clearCompletedTodos,
} from '../controllers/todoController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth protection to all todo endpoints
router.use(protect);

// Specific routes first
router.get('/stats', getTodoStats);
router.delete('/completed/clear', clearCompletedTodos);

// Collection routes
router.route('/')
  .post(createTodo)
  .get(getTodos);

// Item routes
router.route('/:id')
  .get(getTodoById)
  .put(updateTodo)
  .delete(deleteTodo);

router.patch('/:id/status', updateTodoStatus);

export default router;
