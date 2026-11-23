import React from 'react';

export const Badge = ({ children, variant = 'neutral', size = 'md', className = '' }) => {
  const variants = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/80',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/80',
    info: 'bg-sky-50 text-sky-700 border-sky-200/80',
    primary: 'bg-teal-50 text-teal-700 border-teal-200/80',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${variants[variant] || variants.neutral} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};
