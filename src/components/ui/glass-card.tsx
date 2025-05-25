
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'colored';
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, variant = 'default', ...props }, ref) => {
    const variants = {
      default: "bg-white/10 border-white/20",
      colored: "bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-teal-500/10 border-purple-500/20"
    };

    return (
      <div
        ref={ref}
        className={cn(
          "backdrop-blur-md border rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
