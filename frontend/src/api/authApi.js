import axiosClient from './axiosClient.js';

export const authApi = {
  register: async (userData) => {
    const response = await axiosClient.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await axiosClient.post('/auth/login', credentials);
    return response.data;
  },

  logout: async () => {
    const response = await axiosClient.post('/auth/logout');
    return response.data;
  },

  getMe: async () => {
    const response = await axiosClient.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await axiosClient.put('/auth/profile', data);
    return response.data;
  },

  updatePassword: async (data) => {
    const response = await axiosClient.put('/auth/password', data);
    return response.data;
  },
};
