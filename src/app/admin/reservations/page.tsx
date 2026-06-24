'use client';

import { useEffect, useState } from 'react';
import { reservationsApi } from '@/lib/api';
import type { Reservation } from '@/types';

function formatDate(dateStr: string) {
  const d = new Date(String(dateStr).substring(0, 10) + 'T12:00:00');
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

const TABS = [
  { value: '',          label: 'Todas',       active: 'bg-[#172E22] text-white' },
  { value: 'pending',   label: 'Pendientes',  active: 'bg-[rgba(217,119,6,0.10)] text-[#92400E] border border-[rgba(217,119,6,0.2)]' },
  { value: 'confirmed', label: 'Confirmadas', active: 'bg-[rgba(13,146,84,0.10)] text-[#065F3A] border border-[rgba(13,146,84,0.2)]' },
  { value: 'cancelled', label: 'Canceladas',  active: 'bg-[rgba(220,38,38,0.10)] text-[#991B1B] border border-[rgba(220,38,38,0.2)]' },
];

const LIMIT = 10;

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter,   setDateFilter]   = useState('');
  const [search,       setSearch]       = useState('');
  const [page,         setPage]         = useState(1);
  const [total,        setTotal]        = useState(0);

  const load = () => {
    setLoading(true);
    reservationsApi.listAll({
      status: statusFilter || undefined,
      date:   dateFilter   || undefined,
      page,
      limit: LIMIT,
    }).then((res: { reservations: Reservation[]; total?: number }) => {
      setReservations(res.reservations);
      setTotal(res.total ?? res.reservations.length);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [statusFilter, dateFilter, page]);

  const updateStatus = async (id: number, status: string) => {
    try {
      const { reservation } = await reservationsApi.update(id, { status });
      setReservations(prev => prev.map(r => r.id === id ? { ...r, ...reservation } : r));
    } catch { alert('Error al actualizar'); }
  };

  const filtered = search
    ? reservations.filter(r =>
        (r.user_name  ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (r.user_email ?? '').toLowerCase().includes(search.toLowerCase()))
    : reservations;

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div>
      {/* Filter bar */}
      <div className="bg-white border border-[#C4D5CA] rounded-[4px] p-3 px-4 mb-3 flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-1.5 bg-[#F0F4F0] border border-[#C4D5CA] rounded-[3px] px-3 py-[7px] text-[13px] flex-1 min-w-[180px]">
          <span className="text-[#5A6B60]">🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre o email…"
            className="bg-transparent outline-none flex-1 text-[13px] text-[#172E22] placeholder-[#5A6B60]"
          />
        </div>
        <select
          value={dateFilter}
          onChange={e => { setDateFilter(e.target.value); setPage(1); }}
          className="border border-[#C4D5CA] rounded-[3px] px-3 py-[7px] text-[13px] text-[#172E22] bg-white outline-none"
        >
          <option value="">Todas las fechas</option>
          <option value={new Date().toISOString().split('T')[0]}>Hoy</option>
        </select>
        <div className="flex gap-1">
          {TABS.map(({ value, label, active }) => (
            <button
              key={value}
              onClick={() => { setStatusFilter(value); setPage(1); }}
              className={`px-3 py-[6px] rounded-[3px] text-[11px] font-bold tracking-[0.3px] transition-all ${
                statusFilter === value ? active : 'text-[#5A6B60] hover:bg-[#F0F4F0]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#C4D5CA] rounded-[4px] overflow-hidden">
        {loading ? (
          <p className="text-[#5A6B60] p-8 text-center text-sm">Cargando...</p>
        ) : filtered.length === 0 ? (
          <p className="text-[#5A6B60] p-8 text-center text-sm">No hay reservas.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#C4D5CA]">
                {['#', 'Cliente', 'Fecha · Hora', 'Mesa', 'Pax', 'Estado', 'Acciones'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-[#5A6B60] uppercase tracking-[2px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F4F0]">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-[#F8FAF8] transition-colors">
                  <td className="px-4 py-3 text-[11px] text-[#5A6B60]">#{String(r.id).padStart(3, '0')}</td>
                  <td className="px-4 py-3">
                    <div className="text-[13px] font-semibold text-[#172E22]">{r.user_name ?? '—'}</div>
                    <div className="text-[11px] text-[#5A6B60]">{r.user_email ?? ''}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-[13px] font-semibold text-[#172E22]">{formatDate(r.date)}</div>
                    <div className="text-[11px] text-[#5A6B60]">{String(r.time ?? '').slice(0, 5)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-[13px] font-semibold text-[#172E22]">
                      {r.table_number != null ? `Mesa ${r.table_number}` : `Mesa #${r.table_id}`}
                    </div>
                    <div className="text-[11px] text-[#5A6B60]">{r.guests} pax</div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#172E22]">{r.guests}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-[9px] py-[3px] rounded-[2px] uppercase tracking-[0.5px] ${
                      r.status === 'confirmed' ? 'bg-[rgba(13,146,84,0.1)] text-[#065F3A]'
                      : r.status === 'cancelled' ? 'bg-[rgba(220,38,38,0.1)] text-[#991B1B]'
                      : 'bg-[rgba(217,119,6,0.12)] text-[#92400E]'
                    }`}>
                      {r.status === 'confirmed' ? 'Confirmada' : r.status === 'cancelled' ? 'Cancelada' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {r.status === 'pending' && (
                        <button
                          onClick={() => updateStatus(r.id, 'confirmed')}
                          className="px-2 py-1 rounded-[2px] text-[11px] font-bold bg-[rgba(13,146,84,0.1)] text-[#065F3A] hover:bg-[rgba(13,146,84,0.2)] transition whitespace-nowrap"
                        >
                          ✓ Confirmar
                        </button>
                      )}
                      {r.status !== 'cancelled' && (
                        <button
                          onClick={() => updateStatus(r.id, 'cancelled')}
                          className="px-2 py-1 rounded-[2px] text-[11px] font-bold bg-[rgba(220,38,38,0.1)] text-[#991B1B] hover:bg-[rgba(220,38,38,0.2)] transition"
                        >
                          ✕{r.status === 'confirmed' ? ' Cancelar' : ''}
                        </button>
                      )}
                      <button className="px-2 py-1 rounded-[2px] text-[11px] font-bold border border-[#C4D5CA] text-[#5A6B60] hover:border-[#172E22] hover:text-[#172E22] transition">
                        Ver
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#F0F4F0]">
            <div className="text-[12px] text-[#5A6B60]">
              Mostrando {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} de {total} reservas
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(p => p - 1)} disabled={page === 1}
                className="px-3 py-1 rounded-[3px] border border-[#C4D5CA] text-[#5A6B60] text-[12px] disabled:opacity-30"
              >‹</button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`px-3 py-1 rounded-[3px] text-[12px] font-bold ${
                    page === n ? 'bg-[#172E22] text-white' : 'border border-[#C4D5CA] text-[#5A6B60]'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}
                className="px-3 py-1 rounded-[3px] border border-[#C4D5CA] text-[#5A6B60] text-[12px] disabled:opacity-30"
              >›</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
