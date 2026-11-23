import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const NotFoundPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
          <Sparkles className="w-3.5 h-3.5" />
          Error 404
        </div>

        <h1 className="text-7xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          404
        </h1>

        <h2 className="text-2xl font-bold tracking-tight">
          Page Not Found
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          The page or resource you are looking for doesn't exist, was renamed, or has been removed from the server.
        </p>

        <div className="pt-2">
          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            {isAuthenticated ? 'Return to Dashboard' : 'Back to Home'}
          </Link>
        </div>
      </div>
    </div>
  );
};
