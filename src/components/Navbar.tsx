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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cerrar el menú móvil al navegar a otra página
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Bloquear el scroll del body mientras el menú móvil está abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isAdmin = user?.role === 'admin';

  const navLinkContent = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`group relative px-1 py-2 text-[12.5px] font-semibold tracking-[0.5px] uppercase transition-colors ${
          active ? 'text-white' : 'text-[#8AB5A0] hover:text-white'
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
    );
  };

  const navLink = (href: string, label: string) => <li>{navLinkContent(href, label)}</li>;

  // Enlace del menú móvil (fila ancha con buen área de toque)
  const mobileLink = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        onClick={() => setMenuOpen(false)}
        className={`flex items-center justify-between py-[14px] border-b border-white/10 text-[15px] font-semibold uppercase tracking-[0.5px] transition-colors ${
          active ? 'text-[#C8DC2E]' : 'text-white hover:text-[#C8DC2E]'
        }`}
      >
        {label}
        <span className="text-white/30">→</span>
      </Link>
    );
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 h-[58px] border-b transition-all duration-300 ${
        scrolled
          ? 'border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.28)]'
          : 'border-transparent'
      }`}
      style={{ background: '#172E22' }}
    >
      {/* En móvil: flex con logo + hamburguesa. En md+: grid de 3 columnas con
          extremos iguales (1fr) para que el bloque central quede siempre centrado. */}
      <nav className="px-5 sm:px-8 lg:px-[52px] h-full flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] md:gap-6">
        <Link
          href="/"
          className="md:justify-self-start font-heading font-bold text-[17px] tracking-[2.5px] uppercase text-white hover:tracking-[3px] transition-all duration-300"
        >
          MARQUÉS
        </Link>

        <ul className="hidden md:flex items-center gap-9">
          {navLink('/nosotros', 'Nosotros')}
          {navLink('/carta',    'Carta')}
          {navLink('/contacto', 'Contacto')}
        </ul>

        <div className="hidden md:flex justify-self-end items-center gap-3">
          {user ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-[12.5px] font-semibold tracking-[0.5px] uppercase text-[#8AB5A0] hover:text-white transition-colors"
                >
                  Panel
                </Link>
              )}
              {!isAdmin && navLinkContent('/reservations/me', 'Mis reservas')}
              <span className="hidden lg:block text-[13px] font-medium text-white px-3 py-[5px] rounded-full bg-white/10">
                {user.name.split(' ')[0]}
              </span>
              <button
                onClick={() => { logout(); router.push('/'); }}
                className="px-4 py-[7px] rounded-full text-[12.5px] font-semibold border border-white/15 text-[#8AB5A0] hover:bg-white/5 hover:border-white/30 hover:text-white transition-all"
              >
                Salir
              </button>
            </>
          ) : (
            // Entrar y Reservar mesa unidos en una sola píldora
            <div className="flex items-center rounded-full border border-white/15 overflow-hidden">
              <Link
                href="/login"
                className="px-4 py-[9px] text-[12.5px] font-semibold uppercase tracking-[0.3px] text-[#8AB5A0] hover:bg-white/5 hover:text-white transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/reservations"
                className="btn-cta-shimmer-lime px-5 py-[9px] text-[12.5px] font-semibold uppercase tracking-[0.3px] text-[#172E22] hover:brightness-105 transition-all"
              >
                Reservar mesa
              </Link>
            </div>
          )}
        </div>

        {/* Botón hamburguesa — solo móvil/tablet */}
        <button
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(o => !o)}
          className="md:hidden relative w-9 h-9 flex flex-col items-center justify-center gap-[5px] -mr-1"
        >
          <span className={`block h-[2px] w-6 bg-white rounded-full transition-all duration-300 ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`block h-[2px] w-6 bg-white rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-[2px] w-6 bg-white rounded-full transition-all duration-300 ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>
      </nav>

      {/* Panel del menú móvil */}
      {menuOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 top-[58px] bg-black/40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="md:hidden absolute top-[58px] inset-x-0 bg-[#172E22] border-t border-white/10 shadow-[0_16px_32px_rgba(0,0,0,0.35)] px-5 sm:px-8 pt-2 pb-6">
            {mobileLink('/nosotros', 'Nosotros')}
            {mobileLink('/carta',    'Carta')}
            {mobileLink('/contacto', 'Contacto')}
            {user && !isAdmin && mobileLink('/reservations/me', 'Mis reservas')}
            {user && isAdmin && mobileLink('/admin', 'Panel')}

            <div className="mt-5">
              {user ? (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[14px] font-medium text-white px-4 py-2 rounded-full bg-white/10">
                    {user.name.split(' ')[0]}
                  </span>
                  <button
                    onClick={() => { logout(); setMenuOpen(false); router.push('/'); }}
                    className="px-5 py-[11px] rounded-full text-[13px] font-semibold border border-white/20 text-white hover:bg-white/5 transition-all"
                  >
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/reservations"
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-center bg-[#C8DC2E] text-[#172E22] font-bold text-[14px] uppercase tracking-[0.3px] py-[14px] rounded-[3px] hover:brightness-105 transition-all"
                  >
                    Reservar mesa
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-center border border-white/20 text-white font-semibold text-[14px] uppercase tracking-[0.3px] py-[13px] rounded-[3px] hover:bg-white/5 transition-all"
                  >
                    Entrar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
