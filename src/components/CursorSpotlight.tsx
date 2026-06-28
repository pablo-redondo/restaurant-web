'use client';
import { useEffect, useRef } from 'react';

// Halo lima que sigue al cursor con ligero retardo
export default function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const el = ref.current;
    if (!el) return;

    let tx = -800, ty = -800;
    let cx = -800, cy = -800;
    let raf: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      cx = lerp(cx, tx, 0.09);
      cy = lerp(cy, ty, 0.09);
      el.style.setProperty('--sx', `${cx}px`);
      el.style.setProperty('--sy', `${cy}px`);
      raf = requestAnimationFrame(animate);
    };

    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };
    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[9989]"
      style={{
        background:
          'radial-gradient(700px circle at var(--sx, -800px) var(--sy, -800px), rgba(200,220,46,0.055), transparent 62%)',
        willChange: 'background',
      }}
    />
  );
}
