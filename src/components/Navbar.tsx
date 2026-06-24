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
      style={{ background: 'rgba(241,239,233,0.94)', backdropFilter: 'blur(14px)' }}
    >
      <nav className="max-w-6xl mx-auto px-8 h-full flex items-center justify-between">
        <Link
          href="/"
          className="font-heading font-bold text-[17px] tracking-[2.5px] uppercase text-[#172E22]"
        >
          MARQUÉS
        </Link>

        <ul className="flex items-center gap-6 text-[14px] text-[#5A6B60]">
          <li>
            <Link href="/#caracteristicas" className="hover:text-[#172E22] transition-colors">
              Nosotros
            </Link>
          </li>
          <li>
            <Link href="/#resenas" className="hover:text-[#172E22] transition-colors">
              Reseñas
            </Link>
          </li>

          {user ? (
            <>
              <li>
                <Link href="/reservations/me" className="hover:text-[#172E22] transition-colors">
                  Mis reservas
                </Link>
              </li>
              {user.role === 'admin' && (
                <li>
                  <Link href="/admin" className="hover:text-[#172E22] transition-colors">
                    Admin
                  </Link>
                </li>
              )}
              <li className="font-medium text-[#172E22]">{user.name.split(' ')[0]}</li>
              <li>
                <button
                  onClick={() => { logout(); router.push('/'); }}
                  className="px-4 py-2 rounded-btn border border-[#C4D5CA] text-[#5A6B60] hover:border-[#172E22] hover:text-[#172E22] text-sm transition-colors"
                >
                  Salir
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login" className="hover:text-[#172E22] transition-colors">
                  Entrar
                </Link>
              </li>
              <li>
                <Link
                  href="/reservations"
                  className="px-5 py-[9px] rounded-btn bg-[#172E22] text-white text-sm font-medium hover:bg-[#1A3D2D] transition-colors"
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
