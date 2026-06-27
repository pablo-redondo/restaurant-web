'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLink = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <li>
        <Link
          href={href}
          className={`relative py-1 transition-colors ${
            active ? 'text-[#172E22] font-semibold' : 'hover:text-[#172E22]'
          }`}
        >
          {label}
          <span
            className={`absolute -bottom-[2px] left-0 h-[2px] bg-[#C8DC2E] transition-all duration-300 ${
              active ? 'w-full' : 'w-0'
            }`}
          />
        </Link>
      </li>
    );
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 h-[58px] border-b border-[#C4D5CA] transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_4px_24px_rgba(23,46,34,0.10)]' : ''
      }`}
      style={{ background: 'rgba(241,239,233,0.96)', backdropFilter: 'blur(14px)' }}
    >
      <nav className="px-[52px] h-full flex items-center justify-between">
        <Link
          href="/"
          className="font-heading font-bold text-[17px] tracking-[2.5px] uppercase text-[#172E22] hover:opacity-80 transition-opacity"
        >
          MARQUÉS
        </Link>

        <ul className="flex items-center gap-6 text-[14px] text-[#5A6B60]">
          {navLink('/nosotros', 'Nosotros')}
          {navLink('/carta', 'Carta')}
          {navLink('/contacto', 'Contacto')}

          {user ? (
            <>
              <li>
                <Link href="/reservations/me" className="hover:text-[#172E22] transition-colors">Mis reservas</Link>
              </li>
              {user.role === 'admin' && (
                <li>
                  <Link href="/admin" className="hover:text-[#172E22] transition-colors">Admin</Link>
                </li>
              )}
              <li className="font-medium text-[#172E22]">{user.name.split(' ')[0]}</li>
              <li>
                <button
                  onClick={() => { logout(); router.push('/'); }}
                  className="px-4 py-2 rounded-btn text-sm border border-[#C4D5CA] text-[#5A6B60] hover:bg-[#E8EDE8] transition"
                >
                  Salir
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login" className="hover:text-[#172E22] transition-colors">Entrar</Link>
              </li>
              <li>
                <Link
                  href="/reservations"
                  className="px-5 py-[9px] rounded-btn text-sm font-medium bg-[#172E22] text-white hover:bg-[#1E3A2A] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Reservar mesa
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
