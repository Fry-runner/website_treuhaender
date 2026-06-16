import React from 'react';

interface TurevaLinesProps {
  variant?: 'horizontal' | 'slanted' | 'footer' | 'inline' | 'hero';
  count?: number;
  className?: string;
}

export default function TurevaLines({ variant = 'horizontal', count = 3, className = '' }: TurevaLinesProps) {
  if (variant === 'slanted' || variant === 'hero') {
    // Return quiet ambient soft glowing backgrounds or hidden space to prevent sharp slanted logo lines
    return null;
  }

  if (variant === 'footer') {
    return (
      <div className={`w-full relative py-6 ${className}`}>
        <div className="flex items-center space-x-2 justify-center md:justify-start">
          <div className="h-0.5 w-16 bg-brand-mid-gray/30 rounded-full" />
          <div className="w-1.5 h-1.5 bg-brand-mid-gray rounded-full" />
          <div className="h-0.5 w-8 bg-brand-mid-gray/10 rounded-full" />
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <span className={`inline-flex items-center mx-1.5 ${className}`}>
        <span className="w-1.5 h-1.5 bg-brand-mid-gray rounded-full shadow-sm" />
      </span>
    );
  }

  // Default elegant horizontal separator
  return (
    <div className={`w-full flex items-center justify-between border-t border-brand-light-gray/60 py-5 ${className}`}>
      <span className="text-[10px] tracking-[0.25em] font-sans font-semibold text-brand-mid-gray uppercase">
        Tureva Treuhand AG
      </span>
      <div className="flex items-center space-x-1.5">
        <div className="w-1.5 h-1.5 bg-brand-mid-gray rounded-full" />
        <div className="w-1 h-1 bg-brand-mid-gray/50 rounded-full" />
      </div>
    </div>
  );
}
