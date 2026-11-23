import React, { useState } from 'react';
import {
  Check,
  Calendar,
  AlertCircle,
  MoreVertical,
  Edit2,
  Trash2,
  Clock,
  Tag,
} from 'lucide-react';
import { useTodo } from '../../context/TodoContext.jsx';
import { ConfirmDialog } from '../common/ConfirmDialog.jsx';

const PRIORITY_STYLES = {
  High: 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 border-red-200 dark:border-red-800/50',
  Medium: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800/50',
  Low: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50',
};

const CATEGORY_COLORS = {
  Work: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400',
  Personal: 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400',
  Study: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
  Health: 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400',
  Finance: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
  Shopping: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400',
  Other: 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
};

export const TaskCard = ({ todo }) => {
  const { toggleStatus, openEditModal, deleteTodo } = useTodo();
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const isCompleted = todo.status === 'Completed';

  // Format due date & check overdue
  const dueDateObj = todo.dueDate ? new Date(todo.dueDate) : null;
  const isOverdue =
    dueDateObj &&
    !isCompleted &&
    new Date().setHours(0, 0, 0, 0) > new Date(dueDateObj).setHours(0, 0, 0, 0);

  const formatDueDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <div
        className={`group relative rounded-2xl p-5 transition-all duration-200 glass-panel border ${
          isCompleted
            ? 'opacity-70 border-slate-200/50 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-900/30'
            : isOverdue
            ? 'border-red-200 dark:border-red-900/40 hover:shadow-glass-hover'
            : 'border-slate-200/80 dark:border-slate-800/80 hover:shadow-glass-hover hover:-translate-y-0.5'
        }`}
      >
        <div className="flex items-start gap-3.5">
          {/* Status Checkbox Button */}
          <button
            onClick={() => toggleStatus(todo._id, todo.status)}
            aria-label={isCompleted ? 'Mark task as pending' : 'Mark task as complete'}
            className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
              isCompleted
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm shadow-emerald-500/20'
                : 'border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 bg-white/70 dark:bg-slate-800/70'
            }`}
          >
            {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4
                className={`text-base font-semibold transition-all leading-tight ${
                  isCompleted
                    ? 'line-through text-slate-400 dark:text-slate-500'
                    : 'text-slate-900 dark:text-slate-100'
                }`}
              >
                {todo.title}
              </h4>

              {/* Action Dropdown Menu */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-8 z-30 w-36 rounded-xl glass-dropdown p-1.5 shadow-xl border border-slate-200 dark:border-slate-800 text-sm animate-in fade-in zoom-in-95 duration-100">
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          openEditModal(todo);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-left text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          setDeleteConfirmOpen(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            {todo.description && (
              <p
                className={`mt-1.5 text-sm leading-relaxed line-clamp-2 ${
                  isCompleted
                    ? 'text-slate-400 dark:text-slate-600'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {todo.description}
              </p>
            )}

            {/* Badges & Meta Info */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/60">
              {/* Category Pill */}
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  CATEGORY_COLORS[todo.category] || CATEGORY_COLORS.Other
                }`}
              >
                <Tag className="w-3 h-3" />
                {todo.category}
              </span>

              {/* Priority Pill */}
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                  PRIORITY_STYLES[todo.priority] || PRIORITY_STYLES.Medium
                }`}
              >
                {todo.priority}
              </span>

              {/* Due Date Indicator */}
              {dueDateObj && (
                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium ml-auto ${
                    isOverdue
                      ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-2 py-0.5 rounded-md'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {isOverdue ? (
                    <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                  ) : (
                    <Calendar className="w-3.5 h-3.5" />
                  )}
                  {formatDueDate(dueDateObj)}
                  {isOverdue && ' (Overdue)'}
                </span>
              )}

              {/* If completed, show completed date */}
              {isCompleted && todo.completedAt && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 ml-auto">
                  <Check className="w-3 h-3" />
                  Done {formatDueDate(todo.completedAt)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Task"
        message={`Are you sure you want to permanently delete "${todo.title}"? This action cannot be undone.`}
        confirmText="Delete Task"
        onConfirm={() => deleteTodo(todo._id)}
        onClose={() => setDeleteConfirmOpen(false)}
      />
    </>
  );
};
