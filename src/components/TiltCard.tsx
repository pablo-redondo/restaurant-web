'use client';
import { useRef, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export default function TiltCard({ children, className = '', intensity = 7 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * intensity;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * intensity;
    el.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.025)`;
    el.style.boxShadow = `${-x * 2}px ${y * 2}px 32px rgba(0,0,0,0.18)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) scale(1)';
    el.style.boxShadow = '';
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      {children}
    </div>
  );
}
