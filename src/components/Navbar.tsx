'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === '/';

  useEffect(() => {
    if (!isHome) { setScrolled(true); return; }
    setScrolled(window.scrollY > 20);
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [isHome]);

  const dark = isHome && !scrolled;

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 h-[58px] border-b transition-all duration-300"
      style={{
        background:    dark ? 'transparent'              : 'rgba(241,239,233,0.94)',
        backdropFilter: dark ? 'none'                    : 'blur(14px)',
        borderColor:   dark ? 'rgba(255,255,255,0.08)'  : '#C4D5CA',
      }}
    >
      <nav className="max-w-6xl mx-auto px-8 h-full flex items-center justify-between">
        <Link
          href="/"
          className="font-heading font-bold text-[17px] tracking-[2.5px] uppercase transition-colors duration-300"
          style={{ color: dark ? 'white' : '#172E22' }}
        >
          MARQUÉS
        </Link>

        <ul
          className="flex items-center gap-6 text-[14px] transition-colors duration-300"
          style={{ color: dark ? '#A8CCBA' : '#5A6B60' }}
        >
          <li>
            <Link href="/#caracteristicas" className="hover:opacity-75 transition-opacity">
              Nosotros
            </Link>
          </li>
          <li>
            <Link href="/#resenas" className="hover:opacity-75 transition-opacity">
              Reseñas
            </Link>
          </li>

          {user ? (
            <>
              <li>
                <Link href="/reservations/me" className="hover:opacity-75 transition-opacity">
                  Mis reservas
                </Link>
              </li>
              {user.role === 'admin' && (
                <li>
                  <Link href="/admin" className="hover:opacity-75 transition-opacity">
                    Admin
                  </Link>
                </li>
              )}
              <li
                className="font-medium transition-colors duration-300"
                style={{ color: dark ? 'white' : '#172E22' }}
              >
                {user.name.split(' ')[0]}
              </li>
              <li>
                <button
                  onClick={() => { logout(); router.push('/'); }}
                  className="px-4 py-2 rounded-btn text-sm transition-all duration-300"
                  style={{
                    border:      `1px solid ${dark ? 'rgba(255,255,255,0.25)' : '#C4D5CA'}`,
                    color:       dark ? '#A8CCBA' : '#5A6B60',
                  }}
                >
                  Salir
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login" className="hover:opacity-75 transition-opacity">
                  Entrar
                </Link>
              </li>
              <li>
                <Link
                  href="/reservations"
                  className="px-5 py-[9px] rounded-btn text-sm font-medium transition-all duration-300"
                  style={{
                    background: dark ? '#C8DC2E' : '#172E22',
                    color:      dark ? '#172E22' : 'white',
                  }}
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
