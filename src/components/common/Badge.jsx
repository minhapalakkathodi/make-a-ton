import React from 'react';
import { getStatusConfig } from '../../utils/formatters';
import { cn } from '../../utils/helpers';

export const Badge = ({
  status,
  variant,
  children,
  size = 'md',
  dot = true,
  className = '',
}) => {
  // If status is provided, automatically resolve colors & label
  let styling = '';
  let dotColor = '';
  let content = children;

  if (status) {
    const config = getStatusConfig(status);
    styling = config.bg;
    dotColor = config.dot;
    content = children || config.label;
  } else {
    // Explicit variant fallbacks
    const variants = {
      success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      warning: 'bg-amber-50 text-amber-700 border-amber-200',
      danger: 'bg-rose-50 text-rose-700 border-rose-200',
      info: 'bg-blue-50 text-blue-700 border-blue-200',
      neutral: 'bg-slate-100 text-slate-700 border-slate-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
    };
    const dotColors = {
      success: 'bg-emerald-500',
      warning: 'bg-amber-500',
      danger: 'bg-rose-500',
      info: 'bg-blue-500',
      neutral: 'bg-slate-400',
      purple: 'bg-purple-500',
    };
    styling = variants[variant] || variants.neutral;
    dotColor = dotColors[variant] || dotColors.neutral;
  }

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border border-solid shrink-0 select-none',
        styling,
        sizes[size],
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColor)} />}
      <span>{content}</span>
    </span>
  );
};

