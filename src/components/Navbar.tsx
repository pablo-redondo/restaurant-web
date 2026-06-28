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
          className={`relative py-1 transition-colors group ${
            active ? 'text-[#172E22] font-semibold' : 'text-[#5A6B60] hover:text-[#172E22]'
          }`}
        >
          {label}
          {/* Underline que se dibuja de izquierda a derecha */}
          <span
            className={`absolute -bottom-[2px] left-0 h-[2px] bg-[#C8DC2E] transition-all duration-300 ease-out ${
              active ? 'w-full' : 'w-0 group-hover:w-full'
            }`}
          />
        </Link>
      </li>
    );
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 h-[58px] border-b transition-all duration-300 ${
        scrolled
          ? 'border-[#C4D5CA] shadow-[0_4px_24px_rgba(23,46,34,0.10)]'
          : 'border-transparent'
      }`}
      style={{ background: 'rgba(241,239,233,0.97)', backdropFilter: 'blur(16px)' }}
    >
      <nav className="px-[52px] h-full flex items-center justify-between">
        <Link
          href="/"
          className="font-heading font-bold text-[17px] tracking-[2.5px] uppercase text-[#172E22] hover:tracking-[3px] transition-all duration-300"
        >
          MARQUÉS
        </Link>

        <ul className="flex items-center gap-6 text-[14px]">
          {navLink('/nosotros', 'Nosotros')}
          {navLink('/carta',    'Carta')}
          {navLink('/contacto', 'Contacto')}

          {user ? (
            <>
              <li>
                <Link href="/reservations/me" className="text-[#5A6B60] hover:text-[#172E22] transition-colors">Mis reservas</Link>
              </li>
              {user.role === 'admin' && (
                <li>
                  <Link href="/admin" className="text-[#5A6B60] hover:text-[#172E22] transition-colors">Admin</Link>
                </li>
              )}
              <li className="font-medium text-[#172E22]">{user.name.split(' ')[0]}</li>
              <li>
                <button
                  onClick={() => { logout(); router.push('/'); }}
                  className="px-4 py-2 rounded-btn text-sm border border-[#C4D5CA] text-[#5A6B60] hover:bg-[#E8EDE8] hover:border-[#A8C0B0] transition-all"
                >
                  Salir
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login" className="text-[#5A6B60] hover:text-[#172E22] transition-colors">Entrar</Link>
              </li>
              <li>
                <Link
                  href="/reservations"
                  className="btn-cta-shimmer px-5 py-[9px] rounded-btn text-sm font-medium text-white hover:scale-[1.03] active:scale-[0.97] transition-transform duration-200"
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
