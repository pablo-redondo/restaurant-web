'use client';

import Link from 'next/link';

interface Props {
  label?: string;
  variant?: 'light' | 'dark';
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function BackButton({
  label = 'Volver',
  variant = 'light',
  href,
  onClick,
  className = '',
}: Props) {
  const base =
    'inline-flex items-center px-4 py-[7px] rounded-full border text-[11.5px] font-semibold uppercase tracking-[1px] transition-all';
  const styles =
    variant === 'dark'
      ? 'border-white/15 text-[#8AB5A0] hover:text-white hover:border-white/30 hover:bg-white/5'
      : 'border-[#C4D5CA] text-[#5A6B60] hover:text-[#172E22] hover:border-[#A8C0B0] hover:bg-[#E8EDE8]';

  if (href) {
    return (
      <Link href={href} className={`${base} ${styles} ${className}`}>
        {label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`${base} ${styles} ${className}`}>
      {label}
    </button>
  );
}
