
import React from 'react';
import { cn } from '@/lib/utils';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseClasses = "relative overflow-hidden rounded-full font-medium transition-all duration-300 transform hover:scale-105 active:scale-95";
    
    const variants = {
      primary: "bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 text-white shadow-lg hover:shadow-xl",
      secondary: "bg-gradient-to-r from-slate-800 to-slate-900 text-white border border-slate-700 hover:border-slate-600"
    };
    
    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg"
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </button>
    );
  }
);

GradientButton.displayName = "GradientButton";

export { GradientButton };
