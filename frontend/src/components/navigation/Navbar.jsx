import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Plus,
  Sun,
  Moon,
  Bell,
  User,
  Settings,
  LogOut,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useTodo } from '../../context/TodoContext.jsx';

export const Navbar = ({ onOpenSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { filters, updateFilter, openCreateModal, stats } = useTodo();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.name || 'User'
  )}&background=6366F1&color=fff&bold=true`;

  const handleSearchChange = (e) => {
    updateFilter('search', e.target.value);
    // If user is on dashboard and types a search query, navigate to tasks page
    if (window.location.pathname === '/dashboard' && e.target.value.trim().length > 0) {
      navigate('/tasks');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 glass-panel border-b border-slate-200/80 dark:border-slate-800/80 px-4 md:px-8 flex items-center justify-between">
      {/* Left: Mobile hamburger & search */}
      <div className="flex items-center gap-3 md:gap-4 flex-1 max-w-md">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks, descriptions..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
      </div>

      {/* Right: Actions, Theme, Notifications, Profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Quick Add Button */}
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">New Task</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle color theme"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {(stats?.overdue > 0 || stats?.pending > 0) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
            )}
          </button>

          {notificationsOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setNotificationsOpen(false)}
              />
              <div className="absolute right-0 top-12 z-30 w-80 rounded-2xl glass-dropdown p-4 shadow-2xl border border-slate-200 dark:border-slate-800 text-sm animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">
                    Notifications
                  </h4>
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                    Live
                  </span>
                </div>

                <div className="py-3 space-y-2.5 max-h-64 overflow-y-auto">
                  {stats?.overdue > 0 && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-xs">
                      <span className="font-bold text-red-700 dark:text-red-400 block mb-0.5">
                        Overdue Notice
                      </span>
                      <p className="text-red-600 dark:text-red-300">
                        You have {stats.overdue} task(s) past due date. Review them now.
                      </p>
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/30 text-xs">
                    <span className="font-bold text-indigo-700 dark:text-indigo-400 block mb-0.5">
                      Daily Focus
                    </span>
                    <p className="text-slate-600 dark:text-slate-400">
                      You have {stats?.pending || 0} pending task(s) waiting for completion.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-indigo-500/30 transition-all"
          >
            <img
              src={user?.avatar || defaultAvatar}
              alt={user?.name || 'Profile'}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
            />
          </button>

          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setProfileOpen(false)}
              />
              <div className="absolute right-0 top-12 z-30 w-56 rounded-2xl glass-dropdown p-2 shadow-2xl border border-slate-200 dark:border-slate-800 text-sm animate-in fade-in zoom-in-95 duration-150">
                {/* User Info Header */}
                <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800">
                  <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {user?.email}
                  </p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate('/profile');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <User className="w-4 h-4 text-indigo-500" />
                    Profile Details
                  </button>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-purple-500" />
                    Account Settings
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
