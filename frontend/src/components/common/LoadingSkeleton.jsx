import React from 'react';

export const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="w-full animate-pulse">
      <div className="h-10 bg-slate-100 rounded-lg mb-4" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-3 border-b border-slate-100">
          {Array.from({ length: cols }).map((_, j) => (
            <div
              key={j}
              className="h-4 bg-slate-100 rounded"
              style={{ width: `${Math.max(40, 100 / cols)}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse space-y-4">
      <div className="h-4 bg-slate-100 rounded w-1/3" />
      <div className="h-8 bg-slate-200 rounded w-2/3" />
      <div className="h-3 bg-slate-100 rounded w-1/2" />
    </div>
  );
};
