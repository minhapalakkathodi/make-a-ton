import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../utils/helpers';

export const StatsCard = ({
  title,
  value,
  change,
  isPositive,
  icon: Icon,
  iconColor = 'text-brand-600 bg-brand-50 border-brand-100',
  subtext,
  className = '',
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs transition duration-150 hover:shadow-sm hover:border-slate-300 flex flex-col justify-between',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">{value}</div>
        </div>

        {Icon && (
          <div className={cn('p-2.5 rounded-xl border shrink-0', iconColor)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(change !== undefined || subtext) && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {change !== undefined && (
            <div
              className={cn(
                'inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5',
                isPositive
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-rose-700 bg-rose-50'
              )}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              <span>{change}</span>
            </div>
          )}
          {subtext && (
            <span className="text-slate-400 font-medium truncate ml-auto">{subtext}</span>
          )}
        </div>
      )}
    </div>
  );
};

