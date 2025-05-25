
import React from 'react';
import { cn } from '@/lib/utils';

interface SegmentedControlProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  className
}) => {
  return (
    <div className={cn("relative flex bg-slate-100 rounded-lg p-1", className)}>
      {options.map((option, index) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "relative flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
            value === option.value
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export { SegmentedControl };
