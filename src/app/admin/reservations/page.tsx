'use client';

import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { reservationsApi } from '@/lib/api';
import type { Reservation } from '@/types';
import StatusBadge from '@/components/StatusBadge';

function formatDate(date: string) {
  return new Date(String(date).substring(0, 10) + 'T12:00:00')
    .toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const load = () => {
    setLoading(true);
    reservationsApi.listAll({
      status: statusFilter || undefined,
      date:   dateFilter   || undefined,
      page,
      limit: 20,
    }).then(({ reservations }) => {
      setReservations(reservations);
      setHasMore(reservations.length === 20);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [statusFilter, dateFilter, page]);

  const updateStatus = async (id: number, status: string) => {
    try {
      const { reservation } = await reservationsApi.update(id, { status });
      setReservations(prev => prev.map(r => r.id === id ? reservation : r));
    } catch { alert('Error al actualizar'); }
  };

  const STATUS_TABS = [
    { value: '',          label: 'Todas' },
    { value: 'pending',   label: 'Pendientes' },
    { value: 'confirmed', label: 'Confirmadas' },
    { value: 'cancelled', label: 'Canceladas' },
  ];

  const tabActive: Record<string, CSSProperties> = {
    '':          { background: '#172E22', color: '#fff' },
    pending:     { background: 'rgba(217,119,6,0.12)',  color: '#92400E' },
    confirmed:   { background: 'rgba(13,146,84,0.10)',  color: '#065F3A' },
    cancelled:   { background: 'rgba(220,38,38,0.10)',  color: '#991B1B' },
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="date"
          value={dateFilter}
          onChange={e => { setDateFilter(e.target.value); setPage(1); }}
          className="border border-[#C4D5CA] rounded-btn px-3 py-2 text-[#172E22] text-sm focus:outline-none focus:border-[#172E22] transition-colors bg-white"
        />
        <div className="flex bg-white border border-[#C4D5CA] rounded-card overflow-hidden">
          {STATUS_TABS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => { setStatusFilter(value); setPage(1); }}
              className="px-4 py-2 text-sm font-medium border-r border-[#C4D5CA] last:border-r-0 transition-colors"
              style={statusFilter === value ? tabActive[value] : { color: '#5A6B60' }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#C4D5CA] rounded-card overflow-hidden">
        {loading ? (
          <p className="text-[#5A6B60] p-8 text-center">Cargando...</p>
        ) : reservations.length === 0 ? (
          <p className="text-[#5A6B60] p-8 text-center">No hay reservas.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F0F4F0] border-b border-[#C4D5CA] text-left">
                {['#', 'Cliente', 'Fecha', 'Hora', 'Mesa', 'Com.', 'Estado', 'Acciones'].map(h => (
                  <th key={h} className="px-4 py-3 text-[10px] font-bold text-[#5A6B60] uppercase tracking-[2px] font-body">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F4F0]">
              {reservations.map(r => (
                <tr key={r.id} className="hover:bg-[#F0F4F0] transition-colors">
                  <td className="px-4 py-3 text-[#5A6B60]">{r.id}</td>
                  <td className="px-4 py-3">
                    <p className="text-[#172E22] font-medium">{r.user_name ?? '—'}</p>
                    <p className="text-[#5A6B60] text-xs">{r.user_email ?? ''}</p>
                  </td>
                  <td className="px-4 py-3 text-[#172E22]">{formatDate(r.date)}</td>
                  <td className="px-4 py-3 text-[#172E22]">{r.time}</td>
                  <td className="px-4 py-3 text-[#172E22]">#{r.table_id}</td>
                  <td className="px-4 py-3 text-[#172E22]">{r.guests}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {r.status !== 'confirmed' && r.status !== 'cancelled' && (
                        <button
                          onClick={() => updateStatus(r.id, 'confirmed')}
                          className="px-2.5 py-1 rounded text-xs font-medium"
                          style={{ background: 'rgba(13,146,84,0.10)', color: '#065F3A' }}
                        >
                          Confirmar
                        </button>
                      )}
                      {r.status !== 'cancelled' && (
                        <button
                          onClick={() => updateStatus(r.id, 'cancelled')}
                          className="px-2.5 py-1 rounded text-xs font-medium"
                          style={{ background: 'rgba(220,38,38,0.10)', color: '#991B1B' }}
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {(page > 1 || hasMore) && (
        <div className="flex gap-3 mt-5">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 rounded-btn border border-[#C4D5CA] text-[#5A6B60] hover:border-[#172E22] hover:text-[#172E22] disabled:opacity-30 transition-colors text-sm">
            Anterior
          </button>
          <span className="px-4 py-2 text-[#5A6B60]">{page}</span>
          <button disabled={!hasMore} onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 rounded-btn border border-[#C4D5CA] text-[#5A6B60] hover:border-[#172E22] hover:text-[#172E22] disabled:opacity-30 transition-colors text-sm">
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
