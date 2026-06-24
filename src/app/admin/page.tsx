'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { reservationsApi, tablesApi, reviewsApi } from '@/lib/api';
import type { Reservation } from '@/types';

interface DashStats {
  todayCount: number;
  pendingCount: number;
  totalTables: number;
  activeTables: number;
  avgRating: number | null;
}

const CHART_DATA = [
  { conf: 60, pend: 20 },
  { conf: 45, pend: 30 },
  { conf: 80, pend: 15 },
  { conf: 55, pend: 25 },
  { conf: 90, pend: 10 },
  { conf: 70, pend: 30 },
  { conf: 50, pend: 40 },
];
const CHART_LABELS = ['L 10', 'M 11', 'X 12', 'J 13', 'V 14', 'S 15', 'D 16'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashStats | null>(null);
  const [todayRes, setTodayRes] = useState<Reservation[]>([]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    Promise.all([
      reservationsApi.listAll({ date: today, limit: 50 }),
      reservationsApi.listAll({ status: 'pending', limit: 100 }),
      tablesApi.list(),
      reviewsApi.list({ limit: 1 }),
    ]).then(([todayData, pendingData, tablesData, reviewData]) => {
      setStats({
        todayCount:   todayData.reservations.length,
        pendingCount: pendingData.reservations.length,
        totalTables:  tablesData.total ?? tablesData.tables.length,
        activeTables: tablesData.tables.filter((t: { is_active: boolean }) => t.is_active).length,
        avgRating:    reviewData.average_rating !== null ? Number(reviewData.average_rating) : null,
      });
      setTodayRes(todayData.reservations.slice(0, 3));
    }).catch(() => {});
  }, []);

  const totalTables  = stats?.totalTables  ?? 10;
  const activeTables = stats?.activeTables ?? 7;
  const occupation   = Math.round((activeTables / Math.max(totalTables, 1)) * 100);
  const circumference = 283;
  const dashOffset    = circumference - (circumference * occupation) / 100;

  return (
    <div>
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-[18px]">
        {!stats
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white border border-[#C4D5CA] rounded-[4px] p-[18px_20px] h-[100px] animate-pulse" />
            ))
          : [
              { label: 'Reservas hoy', value: stats.todayCount,  delta: '↑ más que ayer',          up: true,  amber: false },
              { label: 'Pendientes',   value: stats.pendingCount, delta: 'Requieren confirmación',   up: false, amber: true  },
              { label: 'Ocupación',    value: `${occupation}%`,   delta: '↑ 8% vs. semana anterior', up: true,  amber: false },
              { label: 'Rating medio', value: stats.avgRating !== null ? stats.avgRating.toFixed(1) : '—', delta: 'Basado en reseñas', up: false, amber: true },
            ].map(({ label, value, delta, up, amber }) => (
              <div key={label} className="bg-white border border-[#C4D5CA] rounded-[4px] p-[18px_20px]">
                <div className="text-[10px] font-bold text-[#5A6B60] uppercase tracking-[0.8px] mb-[10px]">{label}</div>
                <div
                  className="font-heading font-bold text-[30px] leading-none mb-[7px]"
                  style={{ color: amber ? '#B07010' : '#172E22' }}
                >
                  {value}
                </div>
                <div className={`text-[12px] ${up ? 'text-[#1A8A50]' : 'text-[#5A6B60]'}`}>{delta}</div>
              </div>
            ))
        }
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-[14px]">
        {/* Bar chart */}
        <div className="bg-white border border-[#C4D5CA] rounded-[4px] p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="text-[11px] font-bold text-[#172E22] uppercase tracking-[1px]">Reservas últimas 2 semanas</div>
            <Link href="/admin/reservations" className="text-[12px] font-bold text-[#172E22] hover:underline">Ver todas →</Link>
          </div>
          <div className="h-[150px] flex items-end gap-[9px] pb-2 border-b border-[#E2ECE6] mb-2">
            {CHART_DATA.map((d, i) => (
              <div key={i} className="flex-1 flex gap-0.5 items-end h-full">
                <div className="flex-1 rounded-[2px_2px_0_0] bg-[#172E22] min-h-[4px]" style={{ height: `${d.conf}%` }} />
                <div className="flex-1 rounded-[2px_2px_0_0] bg-[#C8DC2E] opacity-65 min-h-[4px]" style={{ height: `${d.pend}%` }} />
              </div>
            ))}
          </div>
          <div className="flex gap-[9px] mb-[9px]">
            {CHART_LABELS.map(d => (
              <div key={d} className="flex-1 text-[10px] text-[#5A6B60] text-center">{d}</div>
            ))}
          </div>
          <div className="flex gap-[14px]">
            <div className="flex items-center gap-1.5 text-[11px] text-[#5A6B60]">
              <div className="w-[7px] h-[7px] rounded-[2px] bg-[#172E22]" /> Confirmadas
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#5A6B60]">
              <div className="w-[7px] h-[7px] rounded-[2px] bg-[#C8DC2E] opacity-65" /> Pendientes
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-[14px]">
          {/* Occupation ring */}
          <div className="bg-white border border-[#C4D5CA] rounded-[4px] p-5">
            <div className="text-[11px] font-bold text-[#172E22] uppercase tracking-[1px] mb-3">Ocupación actual</div>
            <div className="flex flex-col items-center py-2">
              <div className="relative w-[108px] h-[108px] mb-[14px]">
                <svg width="108" height="108" viewBox="0 0 120 120" className="-rotate-90">
                  <circle cx="60" cy="60" r="45" fill="none" stroke="#E2ECE6" strokeWidth="9" />
                  <circle
                    cx="60" cy="60" r="45" fill="none"
                    stroke="#172E22" strokeWidth="9" strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="font-heading font-bold text-[20px] text-[#172E22]">{occupation}%</div>
                  <div className="text-[9px] font-bold text-[#5A6B60] uppercase tracking-[0.5px]">mesas</div>
                </div>
              </div>
              <div className="flex gap-5 text-[12px]">
                <div className="text-center">
                  <div className="font-bold text-[#172E22] text-[18px]">{activeTables}</div>
                  <div className="text-[#5A6B60]">Ocupadas</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-[#1A8A50] text-[18px]">{totalTables - activeTables}</div>
                  <div className="text-[#5A6B60]">Libres</div>
                </div>
              </div>
            </div>
          </div>

          {/* Próximas hoy */}
          <div className="bg-white border border-[#C4D5CA] rounded-[4px] p-5">
            <div className="flex justify-between items-center mb-3">
              <div className="text-[11px] font-bold text-[#172E22] uppercase tracking-[1px]">Próximas hoy</div>
              <Link href="/admin/reservations" className="text-[12px] font-bold text-[#172E22] hover:underline">Ver todas</Link>
            </div>
            <div className="flex flex-col gap-[7px]">
              {todayRes.length === 0 ? (
                <p className="text-[#5A6B60] text-[12px] text-center py-2">Sin reservas hoy</p>
              ) : todayRes.map(r => (
                <div key={r.id} className="flex items-center gap-[9px] bg-[#F0F4F0] rounded-[3px] p-[9px_10px]">
                  <div className="bg-[#172E22] text-white text-[10px] font-bold px-2 py-1 rounded-[2px] whitespace-nowrap tracking-[0.3px]">
                    {String(r.time ?? '').slice(0, 5)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-[#172E22] truncate">{r.user_name ?? `#${r.id}`}</div>
                    <div className="text-[11px] text-[#5A6B60]">Mesa {r.table_id} · {r.guests} pers.</div>
                  </div>
                  <span className={`text-[10px] font-bold px-[9px] py-[3px] rounded-[2px] uppercase tracking-[0.5px] ${
                    r.status === 'confirmed' ? 'bg-[rgba(13,146,84,0.1)] text-[#065F3A]'
                    : r.status === 'cancelled' ? 'bg-[rgba(220,38,38,0.1)] text-[#991B1B]'
                    : 'bg-[rgba(217,119,6,0.12)] text-[#92400E]'
                  }`}>
                    {r.status === 'confirmed' ? '✓' : r.status === 'cancelled' ? '✕' : 'Pend.'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
