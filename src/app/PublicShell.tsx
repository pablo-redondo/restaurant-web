'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Navbar />}
      <main className={`flex-1${!isAdmin ? ' pt-[58px]' : ''}${!isAdmin ? ' pb-[72px] md:pb-0' : ''}`}>
        {children}
      </main>
      {!isAdmin && <Footer />}

      {/* Botón flotante reservar — solo móvil */}
      {!isAdmin && (
        <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[rgba(241,239,233,0.97)] border-t border-[#C4D5CA] px-4 py-3" style={{ backdropFilter: 'blur(12px)' }}>
          <Link
            href="/reservations"
            className="block w-full text-center py-[14px] bg-[#172E22] text-white font-bold text-[14px] rounded-[3px] hover:bg-[#1E3A2A] transition"
          >
            Reservar mesa →
          </Link>
        </div>
      )}
    </>
  );
}
