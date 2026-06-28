'use client';
import { useEffect, useRef, ReactNode } from 'react';

interface Props { children: ReactNode; speed?: number; className?: string; }

// Coloca esta dentro de un contenedor con position:relative y overflow:hidden
// La imagen se mueve a distinta velocidad que el scroll → efecto de profundidad
export default function ParallaxImage({ children, speed = 0.22, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const parent = el.parentElement;
      if (!parent) return;
      const r = parent.getBoundingClientRect();
      const mid = (r.top + r.height / 2) - window.innerHeight / 2;
      el.style.transform = `scale(1.16) translateY(${mid * speed * 0.28}px)`;
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, [speed]);

  return (
    <div ref={ref} className={`absolute inset-0 will-change-transform ${className}`}>
      {children}
    </div>
  );
}
