import React from 'react';

export const BrightLoopLogo = ({ className = 'w-7 h-7', textClassName = 'text-xl font-bold', showText = true, isWhite = false }) => {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className={`shrink-0 flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
          {/* Hexagonal / Geometric Loop */}
          <rect x="2" y="2" width="28" height="28" rx="8" fill="#2563eb" />
          <path
            d="M16 8L23 12V20L16 24L9 20V12L16 8Z"
            stroke="white"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <circle cx="16" cy="16" r="3" fill="white" />
        </svg>
      </div>

      {showText && (
        <span className={`tracking-tight font-extrabold ${isWhite ? 'text-white' : 'text-slate-900'} ${textClassName}`}>
          Bright<span className="text-blue-600">Loop</span>
        </span>
      )}
    </div>
  );
};

