'use client';
import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hov, setHov] = useState(false);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    document.body.classList.add('has-custom-cursor');
    let mx = -200, my = -200, cx = -200, cy = -200;
    let raf: number;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      cx = lerp(cx, mx, 0.11);
      cy = lerp(cy, my, 0.11);
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
      if (!vis) setVis(true);
    };

    const isInteractive = (t: EventTarget | null) =>
      !!(t as HTMLElement)?.closest?.('a,button,[role="button"],input,textarea,select,label');

    const onOver = (e: MouseEvent) => { if (isInteractive(e.target)) setHov(true); };
    const onOut  = (e: MouseEvent) => { if (isInteractive(e.target)) setHov(false); };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    raf = requestAnimationFrame(tick);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      cancelAnimationFrame(raf);
    };
  }, [vis]);

  if (!vis) return null;

  return (
    <>
      {/* Punto — sin retardo */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full bg-[#C8DC2E]"
        style={{
          width: hov ? 6 : 8,
          height: hov ? 6 : 8,
          willChange: 'transform',
          transition: 'width 200ms, height 200ms',
        }}
      />
      {/* Anillo — con retardo */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] rounded-full border-2"
        style={{
          width:  hov ? 48 : 36,
          height: hov ? 48 : 36,
          borderColor: '#C8DC2E',
          backgroundColor: hov ? 'rgba(200,220,46,0.12)' : 'transparent',
          willChange: 'transform',
          transition: 'width 300ms cubic-bezier(0.22,1,0.36,1), height 300ms cubic-bezier(0.22,1,0.36,1), background-color 300ms',
        }}
      />
    </>
  );
}
