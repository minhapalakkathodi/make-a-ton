import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/helpers';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No records found',
  description = 'Try adjusting your search filters or create a new entry to get started.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50',
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-400 mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-5">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

