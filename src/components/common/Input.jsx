import React from 'react';
import { cn } from '../../utils/helpers';

export const Input = React.forwardRef(({
  label,
  error,
  hint,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  required = false,
  className = '',
  wrapperClassName = '',
  id,
  type = 'text',
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={cn('w-full flex flex-col gap-1.5', wrapperClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-slate-700 flex items-center justify-between">
          <span>
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center">
        {LeftIcon && (
          <div className="absolute left-3 pointer-events-none text-slate-400">
            <LeftIcon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            'w-full rounded-xl border border-[#faefbe] bg-white px-3.5 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 transition duration-150',
            'focus:border-[#f5b72e] focus:outline-none focus:ring-2 focus:ring-[#f5b72e]/30',
            'disabled:bg-[#fef8db]/40 disabled:text-zinc-400 disabled:cursor-not-allowed',
            LeftIcon && 'pl-9',
            RightIcon && 'pr-9',
            error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 text-rose-900',
            className
          )}
          {...props}
        />

        {RightIcon && (
          <div className="absolute right-3 text-slate-400 flex items-center">
            {RightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs text-rose-600 font-medium">{error}</p>
      ) : hint ? (
        <p className="text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

