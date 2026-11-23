import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { TodoProvider } from './context/TodoContext.jsx';
import { AppRoutes } from './routes/AppRoutes.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <TodoProvider>
            {/* Global Modern Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#172033',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.12)',
                  borderRadius: '16px',
                  border: '1px solid rgba(226, 232, 240, 0.8)',
                  fontSize: '13px',
                  fontWeight: '500',
                  padding: '12px 18px',
                },
                success: {
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#FFFFFF',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#FFFFFF',
                  },
                },
              }}
            />
            <AppRoutes />
          </TodoProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
