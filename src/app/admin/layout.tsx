'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const NAV = [
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

  const currentLabel = NAV.find(n => n.href === pathname)?.label ?? 'Admin';

  return (
    <div className="flex min-h-screen">
      <aside className="fixed top-0 left-0 h-full w-[230px] bg-[#172E22] flex flex-col z-50">
        <div className="h-[58px] flex items-center px-6 border-b border-[#1A3D2D]">
          <Link href="/admin" className="font-heading font-bold text-[17px] tracking-[2.5px] uppercase text-white">
            MARQUÉS
          </Link>
        </div>

        <nav className="flex-1 py-5 px-3">
          <p className="text-[#4A6A58] text-[10px] font-bold uppercase tracking-[2px] px-3 mb-2 font-body">Panel</p>
          {NAV.map(({ href, label, icon }) => {
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

          <div className="mt-4 pt-4 border-t border-[#1A3D2D] px-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-btn text-[14px] transition-colors"
              style={{ color: '#4A6A58' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#7AAD94'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#4A6A58'; }}
            >
              <span className="text-base w-4 shrink-0">←</span>
              Ver web
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-[#1A3D2D]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C8DC2E] flex items-center justify-center text-[#172E22] font-bold text-sm font-heading shrink-0">
              {user.name[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[13px] font-medium truncate">{user.name}</p>
              <p className="text-[#4A6A58] text-[11px] truncate">{user.email}</p>
            </div>
            <button
              onClick={() => { logout(); router.push('/'); }}
              className="text-[#4A6A58] hover:text-[#7AAD94] text-sm transition-colors"
              title="Salir"
            >
              ↩
            </button>
          </div>
        </div>
      </aside>

      <div className="ml-[230px] flex-1 min-h-screen bg-[#F0F4F0]">
        <header className="h-[58px] bg-white border-b border-[#C4D5CA] flex items-center px-8 sticky top-0 z-40">
          <h1 className="font-heading font-bold text-[17px] tracking-[-0.3px] text-[#172E22]">{currentLabel}</h1>
        </header>
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
