'use client';

import { useEffect, useState } from 'react';
import { reservationsApi, tablesApi, reviewsApi } from '@/lib/api';

interface Stats {
  totalReservations: number;
  pendingReservations: number;
  confirmedReservations: number;
  totalTables: number;
  averageRating: number | null;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    Promise.all([
      reservationsApi.listAll({ limit: 1 }),
      reservationsApi.listAll({ status: 'pending', limit: 1 }),
      reservationsApi.listAll({ status: 'confirmed', limit: 1 }),
      tablesApi.list(),
      reviewsApi.list({ limit: 1 }),
    ]).then(([all, pending, confirmed, tables, reviews]) => {
      setStats({
        totalReservations: all.reservations.length,
        pendingReservations: pending.reservations.length,
        confirmedReservations: confirmed.reservations.length,
        totalTables: tables.total,
        averageRating: reviews.average_rating,
      });
    }).catch(() => {});
  }, []);

  const cards = stats ? [
    { label: 'Mesas activas', value: stats.totalTables, color: 'text-amber-400' },
    { label: 'Reservas pendientes', value: stats.pendingReservations, color: 'text-yellow-400' },
    { label: 'Reservas confirmadas', value: stats.confirmedReservations, color: 'text-emerald-400' },
    { label: 'Rating promedio', value: stats.averageRating !== null ? stats.averageRating.toFixed(1) + ' / 5' : 'N/A', color: 'text-amber-400' },
  ] : [];

  return (
    <div>
      <h2 className="font-serif text-2xl mb-6">Vista general</h2>
      {!stats ? (
        <p className="text-stone-400">Cargando datos...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((c) => (
            <div key={c.label} className="bg-stone-900 border border-stone-800 rounded-xl p-6">
              <p className={`font-serif text-4xl mb-2 ${c.color}`}>{c.value}</p>
              <p className="text-stone-400 text-sm">{c.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
