import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Calendar,
  Layers,
  Star,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
      </div>

      {/* Top Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
            TaskFlow
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all"
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          Modern MERN Stack Todo & Task Operating System
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight mb-6">
          Manage Daily Tasks with <br />
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            Clarity, Focus & Flow.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Designed with Apple-inspired glassmorphism, real-time analytics, automated priority sorting, and secure JWT authentication.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Start For Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-base text-slate-700 dark:text-slate-200 glass-panel border border-slate-300/80 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all hover:scale-[1.02]"
          >
            Live Demo Access
          </Link>
        </div>

        {/* Feature Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            MongoDB & Mongoose
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            HTTP-Only JWT Auth
          </span>
          <span className="flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-indigo-500" />
            Interactive Recharts
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-purple-500" />
            Complete CRUD Operations
          </span>
        </div>
      </section>

      {/* Live Mockup Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <div className="rounded-3xl p-3 sm:p-5 glass-panel border border-slate-200/80 dark:border-slate-800/80 shadow-2xl">
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 md:p-8">
            <div className="flex items-center justify-between pb-6 border-b border-slate-200/60 dark:border-slate-800/60 mb-6">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs font-semibold text-slate-400">
                  taskflow.app/dashboard
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                  Real API Connected
                </span>
              </div>
            </div>

            {/* Mock Task Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl glass-panel border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                    Work
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400">
                    High
                  </span>
                </div>
                <h4 className="font-bold text-sm mb-1">Launch v2 SaaS Dashboard</h4>
                <p className="text-xs text-slate-500">Full-stack MERN with persistent login.</p>
              </div>

              <div className="p-4 rounded-xl glass-panel border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                    Study
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                    Medium
                  </span>
                </div>
                <h4 className="font-bold text-sm mb-1">Database Sharding & Indexes</h4>
                <p className="text-xs text-slate-500">Optimize compound indexes for user todos.</p>
              </div>

              <div className="p-4 rounded-xl glass-panel border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                    Health
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                    Low
                  </span>
                </div>
                <h4 className="font-bold text-sm mb-1">30min Cardio & Recovery</h4>
                <p className="text-xs text-slate-500">Completed at 7:00 AM.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-28">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold mb-3">
            Engineered for Modern Teams & Solopreneurs
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm">
            Everything you need to maintain clarity and execute consistently every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Smart Categorization</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Organize tasks across Work, Health, Personal, Study, Finance, and Shopping with custom priority routing.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Real-Time Analytics</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Instant completion metrics, deadline tracking, overdue warnings, and visual distributions with Recharts.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Secure Authentication</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Bcrypt password hashing, JWT authorization, secure HTTP-only cookies, and complete database isolation.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-8 text-center text-xs text-slate-500">
        <p>© 2025 TaskFlow Inc. Built with MERN Stack (MongoDB, Express, React, Node.js).</p>
      </footer>
    </div>
  );
};
