import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Trash2,
  Search,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { useTodo } from '../context/TodoContext.jsx';
import { TaskCard } from '../components/tasks/TaskCard.jsx';
import { ConfirmDialog } from '../components/common/ConfirmDialog.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';

export const CompletedTasksPage = () => {
  const { todos, fetchTodos, clearCompleted, loading } = useTodo();
  const [search, setSearch] = useState('');
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);

  useEffect(() => {
    fetchTodos({ status: 'Completed' });
  }, [fetchTodos]);

  const completedTodos = todos.filter((t) => t.status === 'Completed');

  const filtered = completedTodos.filter((t) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (t.title && t.title.toLowerCase().includes(q)) ||
      (t.description && t.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Productivity Log
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Completed Tasks
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review your accomplishments and achievements
          </p>
        </div>

        {completedTodos.length > 0 && (
          <button
            onClick={() => setClearConfirmOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 hover:bg-red-100 dark:hover:bg-red-900/60 transition-all self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            Clear Completed
          </button>
        )}
      </div>

      {/* Celebration Banner */}
      <div className="rounded-2xl p-5 glass-panel border border-emerald-200/60 dark:border-emerald-900/40 bg-gradient-to-r from-emerald-500/10 to-teal-500/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              {completedTodos.length} Tasks Successfully Finished
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Great momentum! You can uncheck any task to restore it back to your active list.
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Filter completed tasks..."
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
          icon={RotateCcw}
          title="No completed tasks yet"
          description="Mark your active tasks as completed to populate this hall of fame!"
        />
      )}

      {/* Clear All Confirmation Dialog */}
      <ConfirmDialog
        isOpen={clearConfirmOpen}
        title="Clear All Completed Tasks?"
        message={`Are you sure you want to permanently clear ${completedTodos.length} completed task(s)? This will permanently remove them from your database.`}
        confirmText="Clear All"
        onConfirm={clearCompleted}
        onClose={() => setClearConfirmOpen(false)}
      />
    </div>
  );
};
