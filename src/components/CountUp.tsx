'use client';
import { useEffect, useRef, useState } from 'react';

interface Props {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;   // cifras decimales a mostrar
  locale?: string;     // p.ej. 'es-ES' para separador de miles con punto
  startDelay?: number; // ms antes de empezar a contar
}

export default function CountUp({
  to,
  suffix = '',
  prefix = '',
  duration = 1400,
  decimals = 0,
  locale,
  startDelay = 0,
}: Props) {
  const ref     = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const run = () => {
      let t0: number;
      const ease = (t: number) => 1 - Math.pow(1 - t, 3);
      const step = (ts: number) => {
        if (!t0) t0 = ts;
        const p = Math.min((ts - t0) / duration, 1);
        const raw = ease(p) * to;
        setVal(decimals > 0 ? parseFloat(raw.toFixed(decimals)) : Math.round(raw));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          obs.disconnect();
          if (startDelay > 0) {
            setTimeout(run, startDelay);
          } else {
            run();
          }
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration, decimals, startDelay]);

  const display = locale
    ? val.toLocaleString(locale, decimals > 0 ? { minimumFractionDigits: decimals, maximumFractionDigits: decimals } : {})
    : decimals > 0
      ? val.toFixed(decimals)
      : String(val);

  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}
