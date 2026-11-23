import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Lock,
  Bell,
  ShieldAlert,
  Save,
  Database,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export const SettingsPage = () => {
  const { updatePassword, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Notification toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword || !newPassword) {
      setPasswordError('Please fill in both current and new password.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordLoading(true);
    const result = await updatePassword({
      currentPassword,
      newPassword,
      confirmNewPassword,
    });
    setPasswordLoading(false);

    if (result.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } else {
      setPasswordError(result.message || 'Failed to update password.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your workspace experience, interface theme, and credentials
        </p>
      </div>

      {/* Appearance Settings */}
      <div className="rounded-3xl p-6 sm:p-8 glass-panel border border-slate-200/80 dark:border-slate-800/80">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
          Appearance & Theme
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Choose between sleek Light mode or deep Dark mode
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => {
              if (theme !== 'light') toggleTheme();
            }}
            className={`p-4 rounded-2xl border text-left flex items-center gap-4 transition-all ${
              theme === 'light'
                ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-2 ring-indigo-600/20'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                Light Mode
              </h4>
              <p className="text-xs text-slate-500">
                Crisp Apple-inspired clean white aesthetic
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              if (theme !== 'dark') toggleTheme();
            }}
            className={`p-4 rounded-2xl border text-left flex items-center gap-4 transition-all ${
              theme === 'dark'
                ? 'border-indigo-500 bg-indigo-950/40 shadow-sm ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-indigo-400 flex items-center justify-center">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                Dark Mode
              </h4>
              <p className="text-xs text-slate-500">
                Deep obsidian tone with vibrant neon accents
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="rounded-3xl p-6 sm:p-8 glass-panel border border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Security & Password
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Update your password to keep your tasks and workspace secure
        </p>

        {passwordError && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm">
            {passwordError}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              New Password (min 6 characters)
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={passwordLoading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {passwordLoading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Notifications Preferences */}
      <div className="rounded-3xl p-6 sm:p-8 glass-panel border border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Notification Alerts
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Configure how you want to be reminded about approaching deadlines
        </p>

        <div className="space-y-4 max-w-lg">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40">
            <div>
              <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 block">
                Deadline Reminders
              </span>
              <span className="text-xs text-slate-500">
                Receive warnings when a task is within 24 hours of due date
              </span>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40">
            <div>
              <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 block">
                Completion Sound Effects
              </span>
              <span className="text-xs text-slate-500">
                Play a pleasant chime when marking a task complete
              </span>
            </div>
            <input
              type="checkbox"
              checked={soundAlerts}
              onChange={(e) => setSoundAlerts(e.target.checked)}
              className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Backend & Database Status */}
      <div className="rounded-3xl p-6 sm:p-8 glass-panel border border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Database className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            System & Database Architecture
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Environment configuration and connected services
        </p>

        <div className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Backend Server:</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">Node.js Express (Port 5000)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Authentication:</span>
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">Bcrypt + HTTP-only JWT</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Database Engine:</span>
            <span className="font-mono font-bold text-purple-600 dark:text-purple-400">MongoDB with Mongoose Schemas</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Frontend:</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">React + Vite + Tailwind CSS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
