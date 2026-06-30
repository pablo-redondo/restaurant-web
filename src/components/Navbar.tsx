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

  const isAdmin = user?.role === 'admin';

  const navLink = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <li>
        <Link
          href={href}
          className={`group relative px-1 py-2 text-[12.5px] font-semibold tracking-[0.5px] uppercase transition-colors ${
            active ? 'text-[#172E22]' : 'text-[#7C8C82] hover:text-[#172E22]'
          }`}
        >
          {label}
          {/* Indicador centrado bajo el texto, en vez de subrayado completo */}
          <span
            className={`absolute left-1/2 -translate-x-1/2 bottom-0 h-[3px] rounded-full bg-[#C8DC2E] transition-all duration-300 ease-out ${
              active ? 'w-[16px]' : 'w-0 group-hover:w-[16px]'
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
      {/* Grid de 3 columnas con extremos iguales (1fr) para que el bloque central quede
          siempre centrado en el nav, sin importar cuánto contenido haya a cada lado. */}
      <nav className="px-[40px] md:px-[52px] h-full grid grid-cols-[1fr_auto_1fr] items-center gap-6">
        <Link
          href="/"
          className="justify-self-start font-heading font-bold text-[17px] tracking-[2.5px] uppercase text-[#172E22] hover:tracking-[3px] transition-all duration-300"
        >
          MARQUÉS
        </Link>

        <ul className="flex items-center gap-9">
          {navLink('/nosotros', 'Nosotros')}
          {navLink('/carta',    'Carta')}
          {navLink('/contacto', 'Contacto')}
          {user && !isAdmin && navLink('/reservations/me', 'Mis reservas')}
        </ul>

        <div className="justify-self-end flex items-center gap-3">
          {user ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-[12.5px] font-semibold tracking-[0.5px] uppercase text-[#7C8C82] hover:text-[#172E22] transition-colors"
                >
                  Admin
                </Link>
              )}
              <span className="hidden sm:block text-[13px] font-medium text-[#172E22] px-1">
                {user.name.split(' ')[0]}
              </span>
              <button
                onClick={() => { logout(); router.push('/'); }}
                className="px-4 py-[7px] rounded-full text-[12.5px] font-semibold border border-[#C4D5CA] text-[#5A6B60] hover:bg-[#E8EDE8] hover:border-[#A8C0B0] transition-all"
              >
                Salir
              </button>
            </>
          ) : (
            // Entrar y Reservar mesa unidos en una sola píldora
            <div className="flex items-center rounded-full border border-[#C4D5CA] overflow-hidden">
              <Link
                href="/login"
                className="px-4 py-[9px] text-[12.5px] font-semibold uppercase tracking-[0.3px] text-[#5A6B60] hover:bg-[#E8EDE8] hover:text-[#172E22] transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/reservations"
                className="btn-cta-shimmer px-5 py-[9px] text-[12.5px] font-semibold uppercase tracking-[0.3px] text-white hover:brightness-110 transition-all"
              >
                Reservar mesa
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
