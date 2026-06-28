'use client';
import { useRef, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export default function MagneticEl({ children, strength = 0.28, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width  / 2)) * strength;
    const dy = (e.clientY - (r.top  + r.height / 2)) * strength;
    el.style.transform = `translate(${dx}px,${dy}px)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = 'translate(0,0)';
  };

  return (
    <div
      ref={ref}
      className={`transition-transform duration-[600ms] ease-out ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}
