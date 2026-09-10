import React from 'react';
import { Button } from './button';
import { cn } from '../../lib/utils';

export interface SelectableChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSelected?: boolean;
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'sm';
}

export const SelectableChip = React.forwardRef<HTMLButtonElement, SelectableChipProps>(
  ({ isSelected = false, children, className, size = 'sm', ...props }, ref) => {
    return (
      <Button
        ref={ref}
        type="button"
        variant="outline"
        size={size}
        className={cn(
          'h-7 px-2.5 text-xs font-semibold rounded-md border transition-all shadow-2xs',
          isSelected
            ? 'border-[#15171a] hover:border-[#2e3238] dark:border-white bg-[#15171a] hover:bg-[#2e3238] dark:bg-white dark:hover:bg-slate-100 text-white hover:text-white dark:text-[#112220] dark:hover:text-[#112220] font-bold'
            : 'bg-white dark:bg-slate-900 border-[#e5e7eb] dark:border-slate-700 text-[#64748b] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#112220] dark:hover:text-white',
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

SelectableChip.displayName = 'SelectableChip';
