'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { reservationsApi } from '@/lib/api';
import type { Reservation } from '@/types';
import ReservationCard from '@/components/ReservationCard';

export default function MyReservationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    reservationsApi.listMine({ status: statusFilter || undefined, page }).then(({ reservations }) => {
      setReservations(reservations);
      setHasMore(reservations.length === 10);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user, statusFilter, page]);

  if (authLoading || !user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl mb-2">Mis reservas</h1>
      <p className="text-stone-400 mb-8">Gestiona tus reservas en Marqués</p>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['', 'pending', 'confirmed', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
              statusFilter === s
                ? 'bg-amber-500 text-stone-950 border-amber-500'
                : 'border-stone-700 text-stone-400 hover:border-stone-500'
            }`}
          >
            {s === '' ? 'Todas' : s === 'pending' ? 'Pendientes' : s === 'confirmed' ? 'Confirmadas' : 'Canceladas'}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-stone-400 py-8 text-center">Cargando...</p>
      ) : reservations.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-stone-400 mb-4">No tienes reservas{statusFilter ? ' con este estado' : ''}.</p>
          <button
            onClick={() => router.push('/reservations')}
            className="px-6 py-2.5 bg-amber-500 text-stone-950 font-semibold rounded hover:bg-amber-400 transition-colors"
          >
            Hacer una reserva
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((r) => <ReservationCard key={r.id} reservation={r} />)}
        </div>
      )}

      {(page > 1 || hasMore) && (
        <div className="flex justify-center gap-3 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 border border-stone-700 rounded hover:border-stone-500 disabled:opacity-30 transition-colors"
          >
            Anterior
          </button>
          <span className="px-4 py-2 text-stone-400">{page}</span>
          <button
            disabled={!hasMore}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border border-stone-700 rounded hover:border-stone-500 disabled:opacity-30 transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
