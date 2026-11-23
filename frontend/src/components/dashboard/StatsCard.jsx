import React from 'react';

export const StatsCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  gradient = 'from-indigo-500 to-purple-600',
  iconBg = 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400',
  badge,
  badgeType = 'neutral',
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl p-5 md:p-6 glass-panel border border-slate-200/80 dark:border-slate-800/80 hover:shadow-glass-hover transition-all duration-200 group">
      {/* Subtle top gradient bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-80`}
      />

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${iconBg}`}
        >
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {value}
        </h3>
        {badge && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
              badgeType === 'success'
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                : badgeType === 'danger'
                ? 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400'
                : badgeType === 'warning'
                ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
                : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400'
            }`}
          >
            {badge}
          </span>
        )}
      </div>

      {subtext && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {subtext}
        </p>
      )}
    </div>
  );
};
