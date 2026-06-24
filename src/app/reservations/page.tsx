'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { tablesApi, reservationsApi } from '@/lib/api';
import type { Table } from '@/types';

const TIMES = ['13:00','13:30','14:00','14:30','20:00','20:30','21:00','21:30','22:00'];

export default function ReservationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [location, setLocation] = useState('');
  const [tables, setTables] = useState<Table[]>([]);
  const [searched, setSearched] = useState(false);
  const [loadingTables, setLoadingTables] = useState(false);

  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [notes, setNotes] = useState('');
  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [success, setSuccess] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingTables(true);
    setSearched(true);
    setSelectedTable(null);
    try {
      const res = await tablesApi.list({ date, time, guests, location: location || undefined });
      setTables(res.tables.filter((t) => t.is_active));
    } catch {
      setTables([]);
    } finally {
      setLoadingTables(false);
    }
  };

  const handleBook = async () => {
    if (!user) { router.push('/login'); return; }
    if (!selectedTable) return;
    setBooking(true);
    setBookingError('');
    try {
      await reservationsApi.create({
        table_id: selectedTable.id,
        date,
        time,
        guests,
        notes: notes || undefined,
      });
      setSuccess(true);
    } catch (err: unknown) {
      const e = err as { error?: string };
      setBookingError(e?.error ?? 'Error al reservar');
    } finally {
      setBooking(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-center px-4">
        <div>
          <div className="text-5xl mb-4">✓</div>
          <h2 className="font-serif text-3xl mb-3">Reserva realizada</h2>
          <p className="text-stone-400 mb-8">Recibiremos su solicitud y la confirmaremos en breve.</p>
          <button
            onClick={() => router.push('/reservations/me')}
            className="px-6 py-3 bg-amber-500 text-stone-950 font-semibold rounded hover:bg-amber-400 transition-colors"
          >
            Ver mis reservas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl mb-2">Reservar mesa</h1>
      <p className="text-stone-400 mb-8">Seleccione fecha, hora y número de comensales para ver disponibilidad.</p>

      {/* Search form */}
      <form onSubmit={search} className="bg-stone-900 border border-stone-800 rounded-xl p-6 grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div>
          <label className="block text-xs text-stone-400 mb-1.5 uppercase tracking-wide">Fecha</label>
          <input
            type="date"
            required
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-stone-400 mb-1.5 uppercase tracking-wide">Hora</label>
          <select
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-400 transition-colors"
          >
            <option value="">Seleccionar</option>
            {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-stone-400 mb-1.5 uppercase tracking-wide">Comensales</label>
          <input
            type="number"
            min={1}
            max={20}
            required
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-stone-400 mb-1.5 uppercase tracking-wide">Zona</label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-400 transition-colors"
          >
            <option value="">Cualquiera</option>
            <option value="interior">Interior</option>
            <option value="terraza">Terraza</option>
          </select>
        </div>
        <button
          type="submit"
          className="sm:col-span-2 md:col-span-4 py-2.5 bg-amber-500 text-stone-950 font-semibold rounded-lg hover:bg-amber-400 transition-colors"
        >
          Buscar disponibilidad
        </button>
      </form>

      {/* Results */}
      {loadingTables && <p className="text-center text-stone-400 py-8">Buscando mesas disponibles...</p>}

      {searched && !loadingTables && (
        tables.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-stone-400">No hay mesas disponibles para los parámetros seleccionados.</p>
            <p className="text-stone-600 text-sm mt-1">Pruebe con otra fecha, hora o número de comensales.</p>
          </div>
        ) : (
          <>
            <p className="text-stone-400 mb-4">{tables.length} mesa{tables.length !== 1 ? 's' : ''} disponible{tables.length !== 1 ? 's' : ''}</p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {tables.map((table) => (
                <button
                  key={table.id}
                  onClick={() => setSelectedTable(table)}
                  className={`text-left rounded-xl p-5 border transition-all ${
                    selectedTable?.id === table.id
                      ? 'border-amber-400 bg-amber-400/10'
                      : 'border-stone-700 bg-stone-900 hover:border-stone-500'
                  }`}
                >
                  <p className="text-amber-400 font-serif text-xl mb-1">Mesa {table.number}</p>
                  <p className="text-stone-300 text-sm capitalize">{table.location}</p>
                  <p className="text-stone-400 text-sm">Hasta {table.capacity} comensales</p>
                  {selectedTable?.id === table.id && (
                    <p className="text-amber-400 text-xs mt-2">Seleccionada ✔</p>
                  )}
                </button>
              ))}
            </div>

            {selectedTable && (
              <div className="bg-stone-900 border border-amber-400/30 rounded-xl p-6">
                <h2 className="font-serif text-xl mb-4">
                  Confirmar reserva &mdash; Mesa {selectedTable.number}
                </h2>
                <div className="grid sm:grid-cols-3 gap-4 mb-5 text-sm">
                  <div><span className="text-stone-500">Fecha:</span> <span className="text-stone-200">{date}</span></div>
                  <div><span className="text-stone-500">Hora:</span> <span className="text-stone-200">{time}</span></div>
                  <div><span className="text-stone-500">Comensales:</span> <span className="text-stone-200">{guests}</span></div>
                </div>
                <div className="mb-5">
                  <label className="block text-sm text-stone-300 mb-1.5">Notas o peticiones especiales (opcional)</label>
                  <textarea
                    rows={3}
                    maxLength={500}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-2.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                    placeholder="Alergia al gluten, silla para bebé..."
                  />
                </div>
                {bookingError && (
                  <div className="bg-red-900/40 border border-red-700 text-red-300 rounded p-3 text-sm mb-4">{bookingError}</div>
                )}
                <button
                  onClick={handleBook}
                  disabled={booking || authLoading}
                  className="px-8 py-3 bg-amber-500 text-stone-950 font-semibold rounded-lg hover:bg-amber-400 disabled:opacity-50 transition-colors"
                >
                  {booking ? 'Reservando...' : user ? 'Confirmar reserva' : 'Inicia sesión para reservar'}
                </button>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
}
