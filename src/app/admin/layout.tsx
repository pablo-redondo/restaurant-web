'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <p className="text-amber-400 text-xs tracking-widest uppercase mb-1">Panel de administración</p>
        <h1 className="font-serif text-3xl">Marqués &mdash; Admin</h1>
      </div>
      <div className="flex gap-2 mb-8 flex-wrap">
        {[
          { href: '/admin', label: 'Dashboard' },
          { href: '/admin/reservations', label: 'Reservas' },
          { href: '/admin/tables', label: 'Mesas' },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="px-4 py-2 rounded-lg border border-stone-700 text-stone-300 hover:border-amber-400 hover:text-amber-400 transition-colors text-sm"
          >
            {label}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
