import axiosClient from './axiosClient.js';

export const todoApi = {
  getTodos: async (params = {}) => {
    const response = await axiosClient.get('/todos', { params });
    return response.data;
  },

  getStats: async () => {
    const response = await axiosClient.get('/todos/stats');
    return response.data;
  },

  getTodoById: async (id) => {
    const response = await axiosClient.get(`/todos/${id}`);
    return response.data;
  },

  createTodo: async (todoData) => {
    const response = await axiosClient.post('/todos', todoData);
    return response.data;
  },

  updateTodo: async (id, todoData) => {
    const response = await axiosClient.put(`/todos/${id}`, todoData);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await axiosClient.patch(`/todos/${id}/status`, { status });
    return response.data;
  },

  deleteTodo: async (id) => {
    const response = await axiosClient.delete(`/todos/${id}`);
    return response.data;
  },

  clearCompleted: async () => {
    const response = await axiosClient.delete('/todos/completed/clear');
    return response.data;
  },
};
