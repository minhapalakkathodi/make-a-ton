import React from 'react';
import { cn } from '../../utils/helpers';

export const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-slate-200/80 shadow-xs transition-all duration-150',
        hover && 'hover:shadow-md hover:border-slate-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', action }) => {
  return (
    <div
      className={cn(
        'px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4',
        className
      )}
    >
      <div>{children}</div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export const CardTitle = ({ children, className = '' }) => {
  return (
    <h3 className={cn('text-base font-semibold text-slate-900 tracking-tight', className)}>
      {children}
    </h3>
  );
};

export const CardDescription = ({ children, className = '' }) => {
  return (
    <p className={cn('text-xs text-slate-500 mt-0.5', className)}>
      {children}
    </p>
  );
};

export const CardContent = ({ children, className = '' }) => {
  return (
    <div className={cn('p-5', className)}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={cn('px-5 py-3 bg-slate-50/60 border-t border-slate-100 rounded-b-xl flex items-center justify-between', className)}>
      {children}
    </div>
  );
};

