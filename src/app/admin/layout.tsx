'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const NAV_MAIN = [
  { href: '/admin',              label: 'Dashboard', icon: '◫' },
  { href: '/admin/reservations', label: 'Reservas',  icon: '≡' },
  { href: '/admin/tables',       label: 'Mesas',     icon: '⊟' },
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

  const currentLabel = NAV_MAIN.find(n => n.href === pathname)?.label ?? 'Admin';
  const dateLabel = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="flex min-h-screen">
      <aside className="fixed top-0 left-0 h-full w-[230px] bg-[#172E22] flex flex-col z-50">
        {/* Logo */}
        <div className="h-[58px] flex flex-col justify-center px-6 border-b border-[#1A3D2D]">
          <Link href="/admin" className="font-heading font-bold text-[17px] tracking-[2.5px] uppercase text-white leading-tight">
            MARQUÉS
          </Link>
          <p className="text-[#4A6A58] text-[9px] font-bold uppercase tracking-[2px] font-body">Panel de gestión</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-5 px-3 overflow-y-auto">
          <p className="text-[#4A6A58] text-[10px] font-bold uppercase tracking-[2px] px-3 mb-2 font-body">Principal</p>
          {NAV_MAIN.map(({ href, label, icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-btn text-[14px] mb-0.5 transition-colors"
                style={{
                  background: active ? 'rgba(200,220,46,0.12)' : 'transparent',
                  color:      active ? '#C8DC2E' : '#7AAD94',
                }}
                onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.color = '#A8CCBA'; } }}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#7AAD94'; } }}
              >
                <span className="text-base w-4 shrink-0">{icon}</span>
                {label}
              </Link>
            );
          })}

          <p className="text-[#4A6A58] text-[10px] font-bold uppercase tracking-[2px] px-3 mb-2 mt-5 font-body">Configuración</p>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-btn text-[14px] mb-0.5 transition-colors"
            style={{ color: '#4A6A58' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#7AAD94'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#4A6A58'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            <span className="text-base w-4 shrink-0">←</span>
            Ver web
          </Link>
        </nav>

        {/* User */}
        <div className="p-4 border-t border-[#1A3D2D]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C8DC2E] flex items-center justify-center text-[#172E22] font-bold text-sm font-heading shrink-0">
              {user.name[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[13px] font-medium truncate">{user.name}</p>
              <p className="text-[#4A6A58] text-[11px]">Administrador</p>
            </div>
            <button
              onClick={() => { logout(); router.push('/'); }}
              className="text-[#4A6A58] hover:text-[#7AAD94] text-sm transition-colors"
              title="Salir"
            >↩</button>
          </div>
        </div>
      </aside>

      <div className="ml-[230px] flex-1 min-h-screen bg-[#F0F4F0]">
        <header className="h-[58px] bg-white border-b border-[#C4D5CA] flex items-center justify-between px-8 sticky top-0 z-40">
          <h1 className="font-heading font-bold text-[17px] tracking-[-0.3px] text-[#172E22]">{currentLabel}</h1>
          <div className="flex items-center gap-3">
            <span className="text-[#5A6B60] text-sm font-body">{dateLabel}</span>
            <div className="w-8 h-8 flex items-center justify-center rounded-btn border border-[#C4D5CA] text-[#5A6B60] text-base cursor-pointer hover:border-[#172E22] hover:text-[#172E22] transition-colors">🔔</div>
          </div>
        </header>
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
