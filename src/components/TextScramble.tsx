'use client';
import { useEffect, useRef, useState } from 'react';

const POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·—#@%&';

interface Props {
  text: string;
  className?: string;
  delay?: number; // ms antes de arrancar
}

export default function TextScramble({ text, className = '', delay = 0 }: Props) {
  const [output, setOutput] = useState(text); // SSR: texto real (sin flash)
  const ref     = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const run = () => {
      const chars = text.split('');
      const indices = chars.reduce<number[]>((a, c, i) => (/[A-Za-z0-9]/.test(c) ? [...a, i] : a), []);
      let ptr = 0;
      let frame = 0;
      const framesPerStep = Math.max(1, Math.round(indices.length < 8 ? 3 : 2));

      const tick = () => {
        frame++;
        if (frame % framesPerStep === 0 && ptr < indices.length) ptr++;

        const next = chars
          .map((c, i) => {
            if (!/[A-Za-z0-9]/.test(c)) return c;
            const pos = indices.indexOf(i);
            if (pos < ptr) return c;
            return POOL[Math.floor(Math.random() * POOL.length)];
          })
          .join('');

        setOutput(next);
        if (ptr < indices.length) requestAnimationFrame(tick);
        else setOutput(text);
      };

      // arranca mostrando la versión scrambled primero
      setOutput(
        chars.map(c => (/[A-Za-z0-9]/.test(c) ? POOL[Math.floor(Math.random() * POOL.length)] : c)).join('')
      );
      requestAnimationFrame(tick);
    };

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          obs.disconnect();
          if (delay > 0) setTimeout(run, delay);
          else run();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [text, delay]);

  return <span ref={ref} className={className}>{output}</span>;
}
