'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { reservationsApi } from '@/lib/api';
import type { Reservation } from '@/types';
import ReservationCard from '@/components/ReservationCard';

const STATUS_OPTIONS = [
  { value: '', label: 'Todas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'confirmed', label: 'Confirmadas' },
  { value: 'cancelled', label: 'Canceladas' },
];

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
    reservationsApi.listMine({ status: statusFilter || undefined, page })
      .then(({ reservations }) => {
        setReservations(reservations);
        setHasMore(reservations.length === 10);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, statusFilter, page]);

  if (authLoading || !user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <p className="text-[#5A6B60] text-[11px] font-bold tracking-[2.5px] uppercase font-body mb-2">Mi cuenta</p>
      <h1 className="font-heading font-bold text-[38px] tracking-[-0.5px] text-[#172E22] mb-2">Mis reservas</h1>
      <p className="text-[#5A6B60] text-[14px] mb-8">Gestiona tus reservas en Marqués</p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUS_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => { setStatusFilter(value); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              statusFilter === value
                ? 'bg-[#172E22] text-white border-[#172E22]'
                : 'border-[#C4D5CA] text-[#5A6B60] hover:border-[#172E22] hover:text-[#172E22]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-[#5A6B60] py-8 text-center">Cargando...</p>
      ) : reservations.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[#5A6B60] mb-4">No tienes reservas{statusFilter ? ' con este estado' : ''}.</p>
          <button
            onClick={() => router.push('/reservations')}
            className="px-6 py-2.5 rounded-btn bg-[#172E22] text-white font-semibold text-sm hover:bg-[#1A3D2D] transition-colors"
          >
            Hacer una reserva
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map(r => <ReservationCard key={r.id} reservation={r} />)}
        </div>
      )}

      {(page > 1 || hasMore) && (
        <div className="flex justify-center gap-3 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 rounded-btn border border-[#C4D5CA] text-[#5A6B60] hover:border-[#172E22] hover:text-[#172E22] disabled:opacity-30 transition-colors text-sm"
          >
            Anterior
          </button>
          <span className="px-4 py-2 text-[#5A6B60]">{page}</span>
          <button
            disabled={!hasMore}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 rounded-btn border border-[#C4D5CA] text-[#5A6B60] hover:border-[#172E22] hover:text-[#172E22] disabled:opacity-30 transition-colors text-sm"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
