
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: boolean;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, error, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const handleFocus = () => setFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      setHasValue(e.target.value !== '');
    };

    return (
      <div className="relative">
        <input
          ref={ref}
          className={cn(
            "peer w-full px-4 pt-6 pb-2 text-base bg-white border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-0",
            error ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-blue-500",
            className
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder=" "
          {...props}
        />
        <label
          className={cn(
            "absolute left-4 transition-all duration-200 pointer-events-none",
            focused || hasValue || props.value
              ? "top-2 text-xs text-blue-600"
              : "top-1/2 -translate-y-1/2 text-base text-slate-500",
            error && "text-red-500"
          )}
        >
          {label}
        </label>
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";

export { FloatingInput };
