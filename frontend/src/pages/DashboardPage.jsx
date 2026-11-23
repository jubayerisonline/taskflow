import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Percent,
  Plus,
  ArrowRight,
  Calendar,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTodo } from '../context/TodoContext.jsx';
import { StatsCard } from '../components/dashboard/StatsCard.jsx';
import { TaskCharts } from '../components/dashboard/TaskCharts.jsx';
import { TaskCard } from '../components/tasks/TaskCard.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { stats, fetchStats, fetchTodos, openCreateModal } = useTodo();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const recentTasks = stats?.recentTasks || [];
  const upcomingTasks = stats?.upcomingTasks || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 glass-panel border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Daily Focus Overview
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}!
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
              {stats?.overdue > 0
                ? `You have ${stats.overdue} overdue task(s) requiring attention today. Keep pushing forward!`
                : stats?.pending > 0
                ? `You're on track with ${stats.pending} pending task(s). Let's make today productive!`
                : 'All caught up! Excellent work maintaining your workflow.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Create Task
            </button>
            <Link
              to="/tasks"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-slate-700 dark:text-slate-200 glass-panel border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Metric / Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Tasks"
          value={stats?.total || 0}
          subtext="Assigned in your workspace"
          icon={CheckSquare}
          gradient="from-indigo-500 to-blue-500"
          iconBg="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400"
        />

        <StatsCard
          title="Completed"
          value={stats?.completed || 0}
          subtext={`${stats?.completionRate || 0}% overall completion`}
          icon={CheckCircle2}
          gradient="from-emerald-500 to-teal-500"
          iconBg="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
          badge={`${stats?.completionRate || 0}%`}
          badgeType="success"
        />

        <StatsCard
          title="Pending"
          value={stats?.pending || 0}
          subtext="In progress or waiting"
          icon={Clock}
          gradient="from-amber-500 to-orange-500"
          iconBg="bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
        />

        <StatsCard
          title="Overdue"
          value={stats?.overdue || 0}
          subtext={stats?.overdue > 0 ? 'Requires immediate action' : 'Zero overdue tasks'}
          icon={AlertCircle}
          gradient="from-red-500 to-rose-500"
          iconBg="bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400"
          badge={stats?.overdue > 0 ? 'Urgent' : 'Clear'}
          badgeType={stats?.overdue > 0 ? 'danger' : 'success'}
        />
      </div>

      {/* Interactive Charts Section */}
      <TaskCharts stats={stats} />

      {/* Upcoming Deadlines & Recent Tasks Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Deadlines */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Upcoming Deadlines
              </h3>
            </div>
            <Link
              to="/tasks/pending"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
            >
              See all pending
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {upcomingTasks.length > 0 ? (
            <div className="space-y-3">
              {upcomingTasks.map((todo) => (
                <TaskCard key={todo._id} todo={todo} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No upcoming deadlines"
              description="You have no pending tasks scheduled with future due dates."
              actionText="Schedule Task"
              onAction={openCreateModal}
            />
          )}
        </div>

        {/* Recent Tasks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Recent Tasks
              </h3>
            </div>
            <Link
              to="/tasks"
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-1"
            >
              All tasks
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentTasks.length > 0 ? (
            <div className="space-y-3">
              {recentTasks.map((todo) => (
                <TaskCard key={todo._id} todo={todo} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No recent tasks"
              description="Get started by creating your very first task."
              actionText="Create Task"
              onAction={openCreateModal}
            />
          )}
        </div>
      </div>
    </div>
  );
};
