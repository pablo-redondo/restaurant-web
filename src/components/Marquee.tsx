'use client';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  speed?: number;   // segundos por vuelta
  reverse?: boolean;
  className?: string;
}

export default function Marquee({ children, speed = 32, reverse = false, className = '' }: Props) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        style={{
          display: 'flex',
          width: 'max-content',
          animation: `marqueeScroll ${speed}s linear infinite${reverse ? ' reverse' : ''}`,
        }}
      >
        <div style={{ display: 'flex' }}>{children}</div>
        <div style={{ display: 'flex' }} aria-hidden>{children}</div>
      </div>
    </div>
  );
}
