'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-stone-950/90 backdrop-blur border-b border-stone-800">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl text-amber-400 tracking-widest uppercase">
          Marqués
        </Link>

        <ul className="flex items-center gap-6 text-sm text-stone-300">
          <li>
            <Link href="/#reviews" className="hover:text-amber-400 transition-colors">
              Reseñas
            </Link>
          </li>
          <li>
            <Link href="/reservations" className="hover:text-amber-400 transition-colors">
              Reservar
            </Link>
          </li>

          {user ? (
            <>
              <li>
                <Link href="/reservations/me" className="hover:text-amber-400 transition-colors">
                  Mis reservas
                </Link>
              </li>
              {user.role === 'admin' && (
                <li>
                  <Link href="/admin" className="hover:text-amber-400 transition-colors">
                    Admin
                  </Link>
                </li>
              )}
              <li>
                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 rounded border border-stone-700 hover:border-amber-400 hover:text-amber-400 transition-colors"
                >
                  Salir
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login" className="hover:text-amber-400 transition-colors">
                  Entrar
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="px-4 py-1.5 rounded bg-amber-500 text-stone-950 font-medium hover:bg-amber-400 transition-colors"
                >
                  Registrarse
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
