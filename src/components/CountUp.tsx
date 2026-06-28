'use client';
import { useEffect, useRef, useState } from 'react';

interface Props {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

export default function CountUp({ to, suffix = '', prefix = '', duration = 1400 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          obs.disconnect();
          let t0: number;
          const ease = (t: number) => 1 - Math.pow(1 - t, 3);
          const step = (ts: number) => {
            if (!t0) t0 = ts;
            const p = Math.min((ts - t0) / duration, 1);
            setVal(Math.round(ease(p) * to));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.6 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);

  return <span ref={ref}>{prefix}{val}{suffix}</span>;
}
