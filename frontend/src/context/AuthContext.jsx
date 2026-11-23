import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { authApi } from '../api/authApi.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('taskflow_token');
      if (token) {
        try {
          const data = await authApi.getMe();
          if (data.success && data.user) {
            setUser(data.user);
          } else {
            setUser(null);
            localStorage.removeItem('taskflow_token');
          }
        } catch (error) {
          console.warn('Session check failed or expired:', error?.response?.data?.message || error.message);
          setUser(null);
          localStorage.removeItem('taskflow_token');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      const data = await authApi.register(userData);
      if (data.success) {
        if (data.token) {
          localStorage.setItem('taskflow_token', data.token);
        }
        setUser(data.user);
        toast.success(data.message || 'Account created successfully! Welcome to TaskFlow.');
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      const data = await authApi.login(credentials);
      if (data.success) {
        if (data.token) {
          localStorage.setItem('taskflow_token', data.token);
        }
        setUser(data.user);
        toast.success(`Welcome back, ${data.user.name}!`);
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.warn('Logout API error:', error.message);
    } finally {
      localStorage.removeItem('taskflow_token');
      setUser(null);
      toast.success('Logged out successfully.');
    }
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      const data = await authApi.updateProfile(profileData);
      if (data.success) {
        setUser(data.user);
        toast.success('Profile updated successfully!');
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update profile.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Change password
  const updatePassword = async (passwords) => {
    try {
      const data = await authApi.updatePassword(passwords);
      if (data.success) {
        toast.success(data.message || 'Password updated successfully!');
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to change password.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        updateProfile,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
