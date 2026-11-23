import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext.jsx';

export const TaskCharts = ({ stats }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!stats) return null;

  // Data for Completion Pie/Donut Chart
  const completionData = [
    { name: 'Completed', value: stats.completed || 0, color: '#10B981' },
    { name: 'Pending', value: stats.pending || 0, color: '#6366F1' },
  ];

  // If no tasks exist yet, show placeholder slice
  const hasTasks = stats.total > 0;
  const pieData = hasTasks
    ? completionData
    : [{ name: 'No Tasks', value: 1, color: isDark ? '#334155' : '#E2E8F0' }];

  // Data for Priority Bar Chart
  const priorityData = [
    { name: 'High', count: stats.byPriority?.High || 0, fill: '#EF4444' },
    { name: 'Medium', count: stats.byPriority?.Medium || 0, fill: '#F59E0B' },
    { name: 'Low', count: stats.byPriority?.Low || 0, fill: '#10B981' },
  ];

  // Data for Category Chart
  const categoryData = Object.entries(stats.byCategory || {})
    .filter(([_, count]) => count > 0)
    .map(([category, count]) => ({
      category,
      count,
    }));

  const textColor = isDark ? '#94A3B8' : '#64748B';
  const gridColor = isDark ? '#1E293B' : '#F1F5F9';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Task Completion Ratio */}
      <div className="rounded-2xl p-6 glass-panel border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Task Completion Status
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Overall progress and completion ratio
          </p>
        </div>

        <div className="relative h-60 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={65}
                outerRadius={88}
                paddingAngle={hasTasks ? 5 : 0}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                  borderColor: isDark ? '#334155' : '#E2E8F0',
                  borderRadius: '12px',
                  color: isDark ? '#F1F5F9' : '#0F172A',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Centered percentage in donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100">
              {stats.completionRate || 0}%
            </span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Done
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              Completed ({stats.completed || 0})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-500" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              Pending ({stats.pending || 0})
            </span>
          </div>
        </div>
      </div>

      {/* Chart 2: Priority Breakdown */}
      <div className="rounded-2xl p-6 glass-panel border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Tasks by Priority
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Workload distribution across urgency levels
          </p>
        </div>

        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 12 }} stroke={gridColor} />
              <YAxis allowDecimals={false} tick={{ fill: textColor, fontSize: 12 }} stroke={gridColor} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                  borderColor: isDark ? '#334155' : '#E2E8F0',
                  borderRadius: '12px',
                  color: isDark ? '#F1F5F9' : '#0F172A',
                }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-around pt-3 border-t border-slate-100 dark:border-slate-800/60 text-xs">
          <span className="text-red-600 dark:text-red-400 font-medium">
            High: {stats.byPriority?.High || 0}
          </span>
          <span className="text-amber-600 dark:text-amber-400 font-medium">
            Medium: {stats.byPriority?.Medium || 0}
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
            Low: {stats.byPriority?.Low || 0}
          </span>
        </div>
      </div>
    </div>
  );
};
