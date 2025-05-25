
import React, { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  duration = 2000,
  suffix = '',
  className
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = 0;
    const startValue = 0;
    const endValue = end;

    const animate = (currentTime: number) => {
      if (startTime === 0) startTime = currentTime;
      
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setCount(Math.floor(startValue + (endValue - startValue) * easeOutQuart));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return (
    <span className={className}>
      {count}{suffix}
    </span>
  );
};

export { AnimatedCounter };
