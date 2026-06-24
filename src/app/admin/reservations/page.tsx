'use client';

import { useEffect, useState } from 'react';
import { reservationsApi } from '@/lib/api';
import type { Reservation } from '@/types';
import StatusBadge from '@/components/StatusBadge';

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetch = () => {
    setLoading(true);
    reservationsApi.listAll({
      status: statusFilter || undefined,
      date: dateFilter || undefined,
      page,
      limit: 20,
    }).then(({ reservations }) => {
      setReservations(reservations);
      setHasMore(reservations.length === 20);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [statusFilter, dateFilter, page]);

  const updateStatus = async (id: number, status: string) => {
    try {
      const { reservation } = await reservationsApi.update(id, { status });
      setReservations((prev) => prev.map((r) => r.id === id ? reservation : r));
    } catch {
      alert('Error al actualizar');
    }
  };

  return (
    <div>
      <h2 className="font-serif text-2xl mb-6">Todas las reservas</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
          className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-400 transition-colors text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-400 transition-colors text-sm"
        >
          <option value="">Todos los estados</option>
          <option value="pending">Pendientes</option>
          <option value="confirmed">Confirmadas</option>
          <option value="cancelled">Canceladas</option>
        </select>
      </div>

      {loading ? (
        <p className="text-stone-400">Cargando...</p>
      ) : reservations.length === 0 ? (
        <p className="text-stone-400">No hay reservas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-stone-400 border-b border-stone-800 text-left">
                <th className="pb-3 pr-4">#</th>
                <th className="pb-3 pr-4">Fecha</th>
                <th className="pb-3 pr-4">Hora</th>
                <th className="pb-3 pr-4">Mesa</th>
                <th className="pb-3 pr-4">Com.</th>
                <th className="pb-3 pr-4">Estado</th>
                <th className="pb-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/50">
              {reservations.map((r) => (
                <tr key={r.id} className="hover:bg-stone-900/50 transition-colors">
                  <td className="py-3 pr-4 text-stone-500">{r.id}</td>
                  <td className="py-3 pr-4">{r.date}</td>
                  <td className="py-3 pr-4">{r.time}</td>
                  <td className="py-3 pr-4">#{r.table_id}</td>
                  <td className="py-3 pr-4">{r.guests}</td>
                  <td className="py-3 pr-4"><StatusBadge status={r.status} /></td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      {r.status !== 'confirmed' && r.status !== 'cancelled' && (
                        <button
                          onClick={() => updateStatus(r.id, 'confirmed')}
                          className="px-2.5 py-1 bg-emerald-900/50 text-emerald-300 border border-emerald-700 rounded text-xs hover:bg-emerald-900 transition-colors"
                        >
                          Confirmar
                        </button>
                      )}
                      {r.status !== 'cancelled' && (
                        <button
                          onClick={() => updateStatus(r.id, 'cancelled')}
                          className="px-2.5 py-1 bg-red-900/50 text-red-300 border border-red-700 rounded text-xs hover:bg-red-900 transition-colors"
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
        </div>
      )}

      {(page > 1 || hasMore) && (
        <div className="flex gap-3 mt-6">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 border border-stone-700 rounded hover:border-stone-500 disabled:opacity-30 transition-colors text-sm">
            Anterior
          </button>
          <span className="px-4 py-2 text-stone-400">{page}</span>
          <button disabled={!hasMore} onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border border-stone-700 rounded hover:border-stone-500 disabled:opacity-30 transition-colors text-sm">
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
