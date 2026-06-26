'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 h-[58px] border-b border-[#C4D5CA]"
      style={{ background: 'rgba(241,239,233,0.96)', backdropFilter: 'blur(14px)' }}
    >
      <nav className="px-[52px] h-full flex items-center justify-between">
        <Link
          href="/"
          className="font-heading font-bold text-[17px] tracking-[2.5px] uppercase text-[#172E22]"
        >
          MARQUÉS
        </Link>

        <ul className="flex items-center gap-6 text-[14px] text-[#5A6B60]">
          <li><Link href="/nosotros" className="hover:opacity-75 transition-opacity">Nosotros</Link></li>
          <li><Link href="/carta" className="hover:opacity-75 transition-opacity">Carta</Link></li>
          <li><Link href="/contacto" className="hover:opacity-75 transition-opacity">Contacto</Link></li>

          {user ? (
            <>
              <li><Link href="/reservations/me" className="hover:opacity-75 transition-opacity">Mis reservas</Link></li>
              {user.role === 'admin' && (
                <li><Link href="/admin" className="hover:opacity-75 transition-opacity">Admin</Link></li>
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
              <li><Link href="/login" className="hover:opacity-75 transition-opacity">Entrar</Link></li>
              <li>
                <Link
                  href="/reservations"
                  className="px-5 py-[9px] rounded-btn text-sm font-medium bg-[#172E22] text-white hover:bg-[#1E3A2A] transition"
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
