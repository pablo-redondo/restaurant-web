'use client';

import { useEffect, useRef, useState, ReactNode, CSSProperties } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: 'bottom' | 'left' | 'right' | 'none';
  style?: CSSProperties;
}

export default function AnimateIn({
  children,
  className = '',
  delay = 0,
  from = 'bottom',
  style,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const initial: Record<string, string> = {
    bottom: 'opacity-0 translate-y-8',
    left:   'opacity-0 -translate-x-8',
    right:  'opacity-0 translate-x-8',
    none:   'opacity-0',
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        visible
          ? 'opacity-100 translate-y-0 translate-x-0'
          : initial[from]
      } ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
}
