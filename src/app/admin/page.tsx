'use client';

import { useEffect, useState } from 'react';
import { reservationsApi, tablesApi, reviewsApi } from '@/lib/api';

interface Stats {
  pending: number;
  confirmed: number;
  totalTables: number;
  avgRating: number | null;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    Promise.all([
      reservationsApi.listAll({ status: 'pending',   limit: 100 }),
      reservationsApi.listAll({ status: 'confirmed', limit: 100 }),
      tablesApi.list(),
      reviewsApi.list({ limit: 1 }),
    ]).then(([p, c, t, r]) => {
      setStats({
        pending:     p.reservations.length,
        confirmed:   c.reservations.length,
        totalTables: t.total,
        avgRating:   r.average_rating,
      });
    }).catch(() => {});
  }, []);

  const cards = stats ? [
    { label: 'Mesas activas',       value: stats.totalTables,                                  accent: false },
    { label: 'Reservas pendientes', value: stats.pending,                                       accent: true  },
    { label: 'Confirmadas',         value: stats.confirmed,                                     accent: false },
    { label: 'Rating medio',        value: stats.avgRating !== null ? stats.avgRating.toFixed(1) + ' / 5' : '—', accent: true },
  ] : [];

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {!stats ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-[#C4D5CA] rounded-card p-6 h-[100px] animate-pulse" />
          ))
        ) : (
          cards.map(({ label, value, accent }) => (
            <div key={label} className="bg-white border border-[#C4D5CA] rounded-card p-6">
              <p className="text-[#5A6B60] text-[10px] font-bold uppercase tracking-[2.5px] font-body mb-3">{label}</p>
              <p
                className="font-heading font-bold text-[30px]"
                style={{ color: accent ? '#B07010' : '#172E22' }}
              >
                {value}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
