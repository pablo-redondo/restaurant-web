'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { reservationsApi, tablesApi, reviewsApi } from '@/lib/api';
import type { Reservation, Table } from '@/types';

function getLast14Days() {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d.toISOString().substring(0, 10);
  });
}

function dayLabel(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00');
  return ['D','L','M','X','J','V','S'][d.getDay()] + ' ' + d.getDate();
}

export default function AdminDashboard() {
  const today = new Date().toISOString().substring(0, 10);
  const [todayRes, setTodayRes] = useState<Reservation[]>([]);
  const [recentRes, setRecentRes] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      reservationsApi.listAll({ date: today, limit: 100 }),
      reservationsApi.listAll({ limit: 200 }),
      tablesApi.list(),
      reviewsApi.list({ limit: 100 }),
    ]).then(([t, r, tb, rv]) => {
      setTodayRes(t.reservations);
      setRecentRes(r.reservations);
      setTables(tb.tables);
      setAvgRating(rv.average_rating !== null ? Number(rv.average_rating) : null);
      setReviewCount(rv.reviews.length);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const days = getLast14Days();
  const active = tables.filter(t => t.is_active).length;
  const occupiedToday = todayRes.filter(r => r.status === 'confirmed').length;
  const pendingToday = todayRes.filter(r => r.status === 'pending').length;
  const occupationPct = active > 0 ? Math.round((occupiedToday / active) * 100) : 0;

  const chartData = days.map(date => ({
    label: dayLabel(date),
    confirmed: recentRes.filter(r => String(r.date).substring(0, 10) === date && r.status === 'confirmed').length,
    pending:   recentRes.filter(r => String(r.date).substring(0, 10) === date && r.status === 'pending').length,
  }));
  const maxBar = Math.max(...chartData.map(d => d.confirmed + d.pending), 1);

  const upcoming = [...todayRes]
    .filter(r => r.status !== 'cancelled')
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 5);

  const circumference = 283;
  const ringOffset = circumference - (occupationPct / 100) * circumference;

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-[#C4D5CA] rounded-card p-6 h-[110px] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Reservas hoy',  value: todayRes.filter(r => r.status !== 'cancelled').length, sub: `${occupiedToday} confirmadas`,      accent: false },
          { label: 'Pendientes',    value: pendingToday,  sub: 'Requieren confirmación',            accent: true  },
          { label: 'Ocupación',    value: `${occupationPct}%`, sub: `${occupiedToday} de ${active} mesas`, accent: true  },
          { label: 'Rating medio',  value: avgRating !== null ? avgRating.toFixed(1) : '—', sub: `Basado en ${reviewCount} reseñas`, accent: true  },
        ].map(({ label, value, sub, accent }) => (
          <div key={label} className="bg-white border border-[#C4D5CA] rounded-card p-6">
            <p className="text-[#5A6B60] text-[10px] font-bold uppercase tracking-[2.5px] font-body mb-2">{label}</p>
            <p className="font-heading font-bold text-[30px] leading-none mb-1" style={{ color: accent ? '#B07010' : '#172E22' }}>{value}</p>
            <p className="text-[#5A6B60] text-xs">{sub}</p>
          </div>
        ))}
      </div>

      {/* Chart + Ring + Upcoming */}
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 320px' }}>
        {/* Bar chart */}
        <div className="bg-white border border-[#C4D5CA] rounded-card p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-[#5A6B60] text-[10px] font-bold uppercase tracking-[2px] font-body">Reservas últimas 2 semanas</p>
            <Link href="/admin/reservations" className="text-[#172E22] text-xs font-medium hover:underline">Ver todas →</Link>
          </div>
          <div className="flex items-end gap-[3px]" style={{ height: 160 }}>
            {chartData.map(({ label, confirmed, pending }) => {
              const ch = maxBar > 0 ? (confirmed / maxBar) * 130 : 0;
              const ph = maxBar > 0 ? (pending   / maxBar) * 130 : 0;
              return (
                <div key={label} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col justify-end gap-[2px]" style={{ height: 130 }}>
                    {pending   > 0 && <div style={{ height: Math.max(ph, 3), background: 'rgba(200,220,46,0.65)' }} className="w-full rounded-sm" />}
                    {confirmed > 0 && <div style={{ height: Math.max(ch, 3), background: '#172E22'              }} className="w-full rounded-sm" />}
                    {confirmed === 0 && pending === 0 && <div style={{ height: 3, background: '#E2ECE6' }} className="w-full rounded-sm" />}
                  </div>
                  <p className="text-[#5A6B60] text-[9px] mt-1 font-body text-center">{label}</p>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-4 pt-3 border-t border-[#F0F4F0]">
            <span className="flex items-center gap-1.5 text-xs text-[#5A6B60]">
              <span className="w-3 h-3 rounded-sm bg-[#172E22] inline-block" />Confirmadas
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#5A6B60]">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ background: 'rgba(200,220,46,0.65)' }} />Pendientes
            </span>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Ring */}
          <div className="bg-white border border-[#C4D5CA] rounded-card p-6">
            <p className="text-[#5A6B60] text-[10px] font-bold uppercase tracking-[2px] font-body mb-4">Ocupación actual</p>
            <div className="flex flex-col items-center">
              <div className="relative w-[100px] h-[100px] mb-3">
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#E2ECE6" strokeWidth="9" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#172E22" strokeWidth="9"
                    strokeDasharray={circumference}
                    strokeDashoffset={ringOffset}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="font-heading font-bold text-[18px] text-[#172E22] leading-none">{occupationPct}%</p>
                  <p className="text-[#5A6B60] text-[9px] font-body uppercase tracking-[1px]">Mesas</p>
                </div>
              </div>
              <div className="flex gap-8">
                <div className="text-center">
                  <p className="font-heading font-bold text-xl text-[#172E22]">{occupiedToday}</p>
                  <p className="text-[#5A6B60] text-xs">Ocupadas</p>
                </div>
                <div className="text-center">
                  <p className="font-heading font-bold text-xl text-[#1A8A50]">{Math.max(0, active - occupiedToday)}</p>
                  <p className="text-[#5A6B60] text-xs">Libres</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming */}
          <div className="bg-white border border-[#C4D5CA] rounded-card p-6 flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[#5A6B60] text-[10px] font-bold uppercase tracking-[2px] font-body">Próximas hoy</p>
              <Link href="/admin/reservations" className="text-[#172E22] text-xs font-medium hover:underline">Ver todas</Link>
            </div>
            {upcoming.length === 0 ? (
              <p className="text-[#5A6B60] text-sm">No hay reservas hoy.</p>
            ) : (
              <div className="space-y-3">
                {upcoming.map(r => {
                  const res = r as Reservation & { user_name?: string };
                  return (
                    <div key={r.id} className="flex items-center gap-2.5">
                      <div className="bg-[#172E22] text-white text-[11px] font-bold rounded px-2 py-1 shrink-0 font-body w-[44px] text-center">
                        {r.time.substring(0, 5)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#172E22] text-[13px] font-medium truncate">{res.user_name ?? `Reserva #${r.id}`}</p>
                        <p className="text-[#5A6B60] text-[11px]">Mesa {r.table_id} · {r.guests} personas</p>
                      </div>
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0"
                        style={r.status === 'confirmed'
                          ? { background: 'rgba(13,146,84,0.10)', color: '#065F3A' }
                          : { background: 'rgba(217,119,6,0.12)',  color: '#92400E' }
                        }
                      >
                        {r.status === 'confirmed' ? '✓' : 'PEND.'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
