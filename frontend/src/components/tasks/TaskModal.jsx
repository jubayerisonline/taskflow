import React, { useState, useEffect } from 'react';
import { X, Calendar, Flag, Tag, CheckCircle2, Clock } from 'lucide-react';
import { useTodo } from '../../context/TodoContext.jsx';

const CATEGORIES = ['Work', 'Personal', 'Study', 'Health', 'Finance', 'Shopping', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High'];

export const TaskModal = () => {
  const { isModalOpen, modalMode, selectedTodo, closeModal, createTodo, updateTodo } = useTodo();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('Pending');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isModalOpen && modalMode === 'edit' && selectedTodo) {
      setTitle(selectedTodo.title || '');
      setDescription(selectedTodo.description || '');
      setCategory(selectedTodo.category || 'Work');
      setPriority(selectedTodo.priority || 'Medium');
      setStatus(selectedTodo.status || 'Pending');

      if (selectedTodo.dueDate) {
        // Format to YYYY-MM-DD for date input
        const d = new Date(selectedTodo.dueDate);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        setDueDate(`${yyyy}-${mm}-${dd}`);
      } else {
        setDueDate('');
      }
    } else {
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('Work');
      setPriority('Medium');
      setStatus('Pending');
      setDueDate('');
      setError('');
    }
  }, [isModalOpen, modalMode, selectedTodo]);

  if (!isModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    setError('');
    setSubmitting(true);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      status,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    };

    let result;
    if (modalMode === 'edit' && selectedTodo) {
      result = await updateTodo(selectedTodo._id, payload);
    } else {
      result = await createTodo(payload);
    }

    setSubmitting(false);
    if (!result?.success) {
      setError(result?.message || 'Operation failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl glass-dropdown p-6 md:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 mb-2">
            {modalMode === 'edit' ? 'Edit Task' : 'New Task'}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {modalMode === 'edit' ? 'Update Task Details' : 'Create a New Task'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {modalMode === 'edit'
              ? 'Modify the details below and save your changes.'
              : 'Add details and set due date to keep your productivity high.'}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Complete quarterly review presentation"
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add extra context, checklist items, or notes..."
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Category Chips */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    category === cat
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Priority & Due Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5" />
                Priority
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {PRIORITIES.map((p) => {
                  const isActive = priority === p;
                  let activeClass = 'bg-indigo-600 text-white';
                  if (p === 'High') activeClass = 'bg-red-500 text-white';
                  if (p === 'Medium') activeClass = 'bg-amber-500 text-white';
                  if (p === 'Low') activeClass = 'bg-emerald-500 text-white';

                  return (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`py-2 rounded-xl text-xs font-semibold text-center transition-all ${
                        isActive
                          ? activeClass + ' shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Status (If editing) */}
          {modalMode === 'edit' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Status
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus('Pending')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all ${
                    status === 'Pending'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  Pending
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('Completed')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all ${
                    status === 'Completed'
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Completed
                </button>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={closeModal}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {submitting
                ? 'Saving...'
                : modalMode === 'edit'
                ? 'Save Changes'
                : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
