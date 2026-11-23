import React, { useEffect, useState } from 'react';
import { Clock, AlertCircle, Plus, CheckCircle2, Search } from 'lucide-react';
import { useTodo } from '../context/TodoContext.jsx';
import { TaskCard } from '../components/tasks/TaskCard.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';

export const PendingTasksPage = () => {
  const { todos, fetchTodos, openCreateModal, loading } = useTodo();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTodos({ status: 'Pending' });
  }, [fetchTodos]);

  const pendingTodos = todos.filter((t) => t.status === 'Pending');

  // Filter with local search
  const filtered = pendingTodos.filter((t) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (t.title && t.title.toLowerCase().includes(q)) ||
      (t.description && t.description.toLowerCase().includes(q))
    );
  });

  const now = new Date();
  const overdueCount = pendingTodos.filter(
    (t) => t.dueDate && new Date(t.dueDate) < now
  ).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 mb-2">
            <Clock className="w-3.5 h-3.5" />
            Active Tasks Queue
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Pending Tasks
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Tasks in progress waiting for completion
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          New Task
        </button>
      </div>

      {/* Overdue Warning Callout if any */}
      {overdueCount > 0 && (
        <div className="p-4 rounded-2xl bg-red-50/80 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-center justify-between gap-4 text-red-700 dark:text-red-300">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
            <p className="text-sm font-medium">
              You have <strong>{overdueCount} overdue task(s)</strong> that need your attention.
            </p>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider bg-red-100 dark:bg-red-900/60 px-2.5 py-1 rounded-lg">
            Action Needed
          </span>
        </div>
      )}

      {/* Quick Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Filter pending tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl text-sm bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Task Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 rounded-2xl glass-panel animate-pulse bg-slate-200/50 dark:bg-slate-800/50"
            />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((todo) => (
            <TaskCard key={todo._id} todo={todo} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CheckCircle2}
          title="No pending tasks!"
          description="You've conquered all your open tasks. Feel free to relax or schedule upcoming work."
          actionText="Create New Task"
          onAction={openCreateModal}
        />
      )}
    </div>
  );
};
