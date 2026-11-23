import React, { useState } from 'react';
import { Check, Edit2, Trash2, Calendar, AlertCircle, Tag } from 'lucide-react';
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

export const TaskTable = ({ todos }) => {
  const { toggleStatus, openEditModal, deleteTodo } = useTodo();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const formatDueDate = (date) => {
    if (!date) return 'No deadline';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <div className="w-full overflow-hidden rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50/70 dark:bg-slate-900/50 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800/80">
              <tr>
                <th scope="col" className="px-6 py-4 w-12">Status</th>
                <th scope="col" className="px-6 py-4">Task</th>
                <th scope="col" className="px-6 py-4">Category</th>
                <th scope="col" className="px-6 py-4">Priority</th>
                <th scope="col" className="px-6 py-4">Due Date</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
              {todos.map((todo) => {
                const isCompleted = todo.status === 'Completed';
                const dueDateObj = todo.dueDate ? new Date(todo.dueDate) : null;
                const isOverdue =
                  dueDateObj &&
                  !isCompleted &&
                  new Date().setHours(0, 0, 0, 0) > new Date(dueDateObj).setHours(0, 0, 0, 0);

                return (
                  <tr
                    key={todo._id}
                    className={`transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30 ${
                      isCompleted ? 'opacity-65' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(todo._id, todo.status)}
                        className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-emerald-500 text-white'
                            : 'border border-slate-300 dark:border-slate-600 hover:border-indigo-500 bg-white dark:bg-slate-800'
                        }`}
                      >
                        {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>
                    </td>

                    {/* Title & Description */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        <span className={isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
                          {todo.title}
                        </span>
                      </div>
                      {todo.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 max-w-md">
                          {todo.description}
                        </p>
                      )}
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          CATEGORY_COLORS[todo.category] || CATEGORY_COLORS.Other
                        }`}
                      >
                        <Tag className="w-3 h-3" />
                        {todo.category}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                          PRIORITY_STYLES[todo.priority] || PRIORITY_STYLES.Medium
                        }`}
                      >
                        {todo.priority}
                      </span>
                    </td>

                    {/* Due Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs">
                        {isOverdue ? (
                          <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {formatDueDate(dueDateObj)} (Overdue)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDueDate(dueDateObj)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(todo)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                          title="Edit Task"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(todo)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                          title="Delete Task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        confirmText="Delete"
        onConfirm={() => {
          if (deleteTarget) {
            deleteTodo(deleteTarget._id);
            setDeleteTarget(null);
          }
        }}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
};
