import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { todoApi } from '../api/todoApi.js';
import { useAuth } from './AuthContext.jsx';

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  // Filters and Sorting
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    category: 'all',
    overdue: 'false',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [selectedTodo, setSelectedTodo] = useState(null);

  // Fetch todos with active filters
  const fetchTodos = useCallback(async (customParams = {}) => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const queryParams = { ...filters, ...customParams };
      // Clean queryParams to remove empty strings or 'all' values
      const cleanParams = {};
      Object.keys(queryParams).forEach((key) => {
        if (queryParams[key] !== '' && queryParams[key] !== 'all') {
          cleanParams[key] = queryParams[key];
        }
      });
      // Always include sort
      cleanParams.sortBy = queryParams.sortBy || 'createdAt';
      cleanParams.sortOrder = queryParams.sortOrder || 'desc';

      const data = await todoApi.getTodos(cleanParams);
      if (data.success) {
        setTodos(data.todos || []);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
      toast.error('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [filters, isAuthenticated]);

  // Fetch dashboard stats
  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) return;
    setStatsLoading(true);
    try {
      const data = await todoApi.getStats();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  }, [isAuthenticated]);

  // Initial load when user authenticates
  useEffect(() => {
    if (isAuthenticated) {
      fetchTodos();
      fetchStats();
    } else {
      setTodos([]);
      setStats(null);
    }
  }, [isAuthenticated, fetchTodos, fetchStats]);

  // Create a new todo
  const createTodo = async (todoData) => {
    try {
      const data = await todoApi.createTodo(todoData);
      if (data.success) {
        toast.success('Task created successfully!');
        setTodos((prev) => [data.todo, ...prev]);
        fetchStats();
        closeModal();
        return { success: true, todo: data.todo };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create task.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Update existing todo
  const updateTodo = async (id, updateData) => {
    try {
      const data = await todoApi.updateTodo(id, updateData);
      if (data.success) {
        toast.success('Task updated successfully!');
        setTodos((prev) =>
          prev.map((item) => (item._id === id ? data.todo : item))
        );
        fetchStats();
        closeModal();
        return { success: true, todo: data.todo };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update task.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Toggle status between Pending and Completed
  const toggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    // Optimistic UI update
    setTodos((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              status: nextStatus,
              completedAt: nextStatus === 'Completed' ? new Date().toISOString() : null,
            }
          : item
      )
    );

    try {
      const data = await todoApi.updateStatus(id, nextStatus);
      if (data.success) {
        toast.success(`Task marked as ${nextStatus.toLowerCase()}!`);
        fetchStats();
      }
    } catch (error) {
      // Revert on error
      setTodos((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: currentStatus } : item
        )
      );
      const msg = error.response?.data?.message || 'Failed to update task status.';
      toast.error(msg);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      const data = await todoApi.deleteTodo(id);
      if (data.success) {
        toast.success('Task deleted.');
        setTodos((prev) => prev.filter((item) => item._id !== id));
        fetchStats();
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to delete task.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Clear completed todos
  const clearCompleted = async () => {
    try {
      const data = await todoApi.clearCompleted();
      if (data.success) {
        toast.success(data.message || 'Cleared completed tasks.');
        setTodos((prev) => prev.filter((item) => item.status !== 'Completed'));
        fetchStats();
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to clear completed tasks.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Modal helpers
  const openCreateModal = () => {
    setModalMode('create');
    setSelectedTodo(null);
    setIsModalOpen(true);
  };

  const openEditModal = (todo) => {
    setModalMode('edit');
    setSelectedTodo(todo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTodo(null);
  };

  // Filter modifier
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      priority: 'all',
      category: 'all',
      overdue: 'false',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        stats,
        loading,
        statsLoading,
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        fetchTodos,
        fetchStats,
        createTodo,
        updateTodo,
        toggleStatus,
        deleteTodo,
        clearCompleted,
        isModalOpen,
        modalMode,
        selectedTodo,
        openCreateModal,
        openEditModal,
        closeModal,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};
