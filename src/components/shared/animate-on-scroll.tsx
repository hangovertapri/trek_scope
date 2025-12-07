'use client';

import { useRef, useEffect, useState, ReactNode, ElementType } from 'react';
import { cn } from '@/lib/utils';

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  animationClass?: string;
  delay?: number;
  threshold?: number;
  as?: ElementType;
  [x: string]: any; // for other props like id
}

export default function AnimateOnScroll({
  children,
  className,
  animationClass = 'animate-fade-in-up',
  delay = 0,
  threshold = 0.1,
  as: Tag = 'div',
  ...props
}: AnimateOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, threshold]);

  return (
    <Tag
      ref={ref}
      className={cn(
        'transition-opacity duration-1000',
        isVisible ? 'opacity-100' : 'opacity-0',
        isVisible && animationClass,
        className
      )}
      style={{ animationDelay: isVisible ? `${delay}ms` : '0ms' }}
      {...props}
    >
      {children}
    </Tag>
  );
}
