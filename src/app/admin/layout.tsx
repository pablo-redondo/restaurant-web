'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const NAV_MAIN = [
  { href: '/admin',              label: 'Dashboard', icon: '◫' },
  { href: '/admin/reservations', label: 'Reservas',  icon: '≡' },
  { href: '/admin/tables',       label: 'Mesas',     icon: '⊡' },
  { href: '/admin/reviews',      label: 'Reseñas',   icon: '★' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/');
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') return null;

  const today = new Date().toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  const currentLabel = NAV_MAIN.find(n => n.href === pathname)?.label ?? 'Admin';

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-[230px] bg-[#172E22] flex flex-col z-50">
        {/* Logo */}
        <div className="px-[22px] py-[26px] pb-[18px] border-b border-[#1C1C1C]">
          <span className="block font-heading font-bold text-[15px] tracking-[2.5px] uppercase text-white">
            MARQUÉS
          </span>
          <span className="block text-[9px] text-[#4A6A58] tracking-[1.5px] uppercase mt-1">
            Panel de gestión
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-[14px] px-[10px] flex flex-col">
          <p className="text-[9px] font-bold text-[#4A6A58] tracking-[2px] uppercase px-3 pt-[14px] pb-1">
            Principal
          </p>
          {NAV_MAIN.map(({ href, label, icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-[10px] px-3 py-[9px] rounded-[3px] text-[13px] font-medium transition-colors mb-0.5"
                style={{
                  background: active ? 'rgba(200,220,46,0.12)' : 'transparent',
                  color:      active ? '#C8DC2E' : '#7AAD94',
                }}
              >
                <span className="text-[14px] w-4 text-center shrink-0">{icon}</span>
                {label}
              </Link>
            );
          })}

          <p className="text-[9px] font-bold text-[#4A6A58] tracking-[2px] uppercase px-3 pt-[18px] pb-1">
            Configuración
          </p>
          {[{ label: 'Usuarios', icon: '◎' }, { label: 'Ajustes', icon: '⚙' }].map(({ label, icon }) => (
            <div
              key={label}
              className="flex items-center gap-[10px] px-3 py-[9px] rounded-[3px] text-[13px] font-medium text-[#4A6A58] cursor-not-allowed select-none mb-0.5"
            >
              <span className="text-[14px] w-4 text-center shrink-0">{icon}</span>
              {label}
            </div>
          ))}

          <div className="mt-auto pt-6">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-[9px] rounded-[3px] text-[13px] text-[#4A6A58] hover:text-[#7AAD94] transition-colors"
            >
              ← Ver web
            </Link>
          </div>
        </nav>

        {/* User footer */}
        <div className="px-[14px] py-[14px] border-t border-[#181818] flex items-center gap-[10px]">
          <div className="w-7 h-7 rounded-full bg-[#C8DC2E] flex items-center justify-center text-[#172E22] font-bold text-[11px] shrink-0">
            {user.name?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div>
            <p className="text-white text-[13px] font-semibold leading-tight">Admin</p>
            <p className="text-[#4A6A58] text-[10px]">Administrador</p>
          </div>
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="ml-auto text-[#4A6A58] hover:text-[#7AAD94] transition-colors text-sm"
            title="Cerrar sesión"
          >
            ↩
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="ml-[230px] flex-1 min-h-screen bg-[#F0F4F0]">
        {/* Header */}
        <header className="h-[58px] bg-white border-b border-[#C4D5CA] flex items-center justify-between px-[26px] sticky top-0 z-40">
          <h1 className="font-heading font-bold text-[17px] tracking-[-0.3px] text-[#172E22]">
            {currentLabel}
          </h1>
          <div className="flex items-center gap-2">
            <div className="text-[12px] text-[#5A6B60] bg-[#F0F4F0] border border-[#C4D5CA] rounded-[3px] px-3 py-[5px] font-semibold">
              {today}
            </div>
            <div className="relative w-8 h-8 border border-[#C4D5CA] rounded-[3px] flex items-center justify-center text-[14px] cursor-pointer">
              🔔
              <span className="absolute top-[5px] right-[5px] w-[5px] h-[5px] bg-[#DC2626] rounded-full border-[1.5px] border-white" />
            </div>
          </div>
        </header>

        <div className="p-[22px_26px]">{children}</div>
      </div>
    </div>
  );
}
