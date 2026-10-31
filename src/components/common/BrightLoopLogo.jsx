import React from 'react';

export const BrightLoopLogo = ({ className = 'w-6 h-6', textClassName = 'text-lg font-extrabold', showText = true }) => {
  return (
    <div className="flex items-center gap-2 select-none">
      <div className={`shrink-0 flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Golden Swirl Loop Mark matching the new template */}
          <circle cx="14" cy="14" r="13" fill="#fef3c7" stroke="#f5b72e" strokeWidth="2" />
          <path
            d="M9 14C9 11.2386 11.2386 9 14 9C16.7614 9 19 11.2386 19 14C19 16.7614 16.7614 19 14 19C12 19 10.5 17.5 10.5 15.5C10.5 13.5 12 12 14 12"
            stroke="#d97706"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="14" cy="14" r="2.2" fill="#d97706" />
        </svg>
      </div>

      {showText && (
        <span className={`tracking-tight font-extrabold text-slate-900 ${textClassName}`}>
          BrightLoop
        </span>
      )}
    </div>
  );
};
