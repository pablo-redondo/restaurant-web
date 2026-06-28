'use client';
import { useEffect, useRef, useState } from 'react';

type Tag = 'h1' | 'h2' | 'h3' | 'p' | 'span';

interface Props {
  text: string;
  as?: Tag;
  className?: string;
  wordClassName?: string;
  baseDelay?: number;
  stagger?: number;
}

export default function SplitText({
  text,
  as: Tag = 'span',
  className = '',
  wordClassName = '',
  baseDelay = 0,
  stagger = 55,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.15, rootMargin: '0px 0px -24px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const words = text.split(' ');
  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden
          className={`inline-block mr-[0.26em] last:mr-0 ${wordClassName}`}
          style={{
            opacity: vis ? 1 : 0,
            transform: vis ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 0.75s cubic-bezier(0.22,1,0.36,1) ${baseDelay + i * stagger}ms,
                         transform 0.75s cubic-bezier(0.22,1,0.36,1) ${baseDelay + i * stagger}ms`,
          }}
        >
          {word}
        </span>
      ))}
    </Tag>
  );
}
