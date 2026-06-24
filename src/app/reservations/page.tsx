'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { tablesApi, reservationsApi } from '@/lib/api';
import type { Table } from '@/types';
import StatusBadge from '@/components/StatusBadge';

// ——— Calendar ———
const WEEKDAYS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];
const MONTHS = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
];

function Calendar({ selected, onSelect }: { selected: string; onSelect: (d: string) => void }) {
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const [viewYear, setViewYear] = useState(todayDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(todayDate.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1);
  const lastDay  = new Date(viewYear, viewMonth + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7; // 0 = Monday

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) cells.push(new Date(viewYear, viewMonth, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const toISO = (d: Date) => d.toISOString().split('T')[0];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center text-[#5A6B60] hover:text-[#172E22] transition-colors text-lg">‹</button>
        <p className="font-heading font-semibold text-[#172E22] text-[15px]">
          {MONTHS[viewMonth]} {viewYear}
        </p>
        <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center text-[#5A6B60] hover:text-[#172E22] transition-colors text-lg">›</button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-[#5A6B60] uppercase tracking-wide py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} />;
          const iso = toISO(day);
          const isPast = day < todayDate;
          const isSelected = iso === selected;
          const isToday = day.getTime() === todayDate.getTime();
          return (
            <button
              key={iso}
              disabled={isPast}
              onClick={() => onSelect(iso)}
              className={`w-full aspect-square flex items-center justify-center text-[13px] rounded-full transition-colors
                ${isSelected ? 'bg-[#172E22] text-white font-semibold'
                : isPast    ? 'text-[#C4D5CA] cursor-not-allowed'
                : isToday   ? 'text-[#172E22] font-bold underline hover:bg-[#E2ECE6]'
                :              'text-[#172E22] hover:bg-[#E2ECE6]'}`}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ——— Time slots ———
const TIMES = [
  '13:00','13:30','14:00','14:30','15:00',
  '20:00','20:30','21:00','21:30','22:00',
];

// ——— Stepper ———
const STEPS = ['Fecha y hora', 'Mesa', 'Confirmación'];

function Stepper({ current }: { current: number }) {
  return (
    <div className="bg-white border border-[#C4D5CA] rounded-card flex overflow-hidden mb-8">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done   = current > n;
        const active = current === n;
        return (
          <div
            key={label}
            className={`flex-1 flex items-center gap-3 px-5 py-4 text-sm border-r border-[#C4D5CA] last:border-r-0
              ${done ? 'text-[#1A8A50]' : active ? 'text-[#172E22] font-semibold' : 'text-[#C4D5CA]'}`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0
              ${done ? 'bg-[#1A8A50] text-white' : active ? 'bg-[#172E22] text-white' : 'bg-[#E2ECE6] text-[#C4D5CA]'}`}>
              {done ? '✓' : n}
            </span>
            {label}
          </div>
        );
      })}
    </div>
  );
}

// ——— Page ———
export default function ReservationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [locationTab, setLocationTab] = useState<'interior' | 'terraza'>('interior');
  const [tables, setTables] = useState<Table[]>([]);
  const [loadingTables, setLoadingTables] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [notes, setNotes] = useState('');
  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [success, setSuccess] = useState(false);
  const [reservationId, setReservationId] = useState<number | null>(null);

  const goToStep2 = async () => {
    if (!date || !time) return;
    setLoadingTables(true);
    try {
      const res = await tablesApi.list({ date, time, guests });
      setTables(res.tables.filter(t => t.is_active));
    } catch { setTables([]); }
    finally { setLoadingTables(false); }
    setStep(2);
  };

  const handleBook = async () => {
    if (!user) { router.push('/login'); return; }
    if (!selectedTable) return;
    setBooking(true);
    setBookingError('');
    try {
      const { reservation } = await reservationsApi.create({
        table_id: selectedTable.id, date, time, guests,
        notes: notes || undefined,
      });
      setReservationId(reservation.id);
      setSuccess(true);
    } catch (err: unknown) {
      const e = err as { error?: string };
      setBookingError(e?.error ?? 'Error al reservar');
    } finally { setBooking(false); }
  };

  const filteredTables = tables.filter(t => t.location === locationTab);

  // — Success screen —
  if (success) {
    return (
      <div className="min-h-[calc(100vh-58px)] bg-[#F0F4F0] flex items-center justify-center px-4 py-12">
        <div className="bg-white border border-[#C4D5CA] rounded-card-lg p-10 max-w-[500px] w-full text-center">
          <div className="w-16 h-16 rounded-full bg-[#172E22] flex items-center justify-center mx-auto mb-6 text-[#C8DC2E] text-2xl font-bold">
            ✓
          </div>
          <h2 className="font-heading font-bold text-[28px] tracking-[-0.5px] text-[#172E22] mb-2">
            Solicitud enviada
          </h2>
          <p className="text-[#5A6B60] text-[14px] mb-6">Confirmaremos su reserva a la mayor brevedad.</p>

          <div className="bg-[#F0F4F0] rounded-card p-5 text-left mb-6 space-y-2 text-sm">
            {[
              { label: 'Fecha', value: date },
              { label: 'Hora', value: time },
              { label: 'Comensales', value: `${guests} persona${guests !== 1 ? 's' : ''}` },
              { label: 'Mesa', value: `Mesa ${selectedTable?.number} · ${selectedTable?.location}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span className="text-[#5A6B60]">{label}</span>
                <span className="text-[#172E22] font-medium">{value}</span>
              </div>
            ))}
          </div>

          {reservationId && (
            <p className="font-mono text-[12px] text-[#5A6B60] mb-6">
              Ref: MRQ-{String(reservationId).padStart(5, '0')}
            </p>
          )}

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push('/reservations/me')}
              className="px-6 py-2.5 rounded-btn border border-[#C4D5CA] text-[#5A6B60] text-sm hover:border-[#172E22] hover:text-[#172E22] transition-colors"
            >
              Mis reservas
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2.5 rounded-btn bg-[#172E22] text-white text-sm font-semibold hover:bg-[#1A3D2D] transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-58px)] bg-[#F0F4F0]">
      {/* Dark header */}
      <div className="bg-[#172E22] px-8 md:px-14 pt-11 pb-14">
        <button
          onClick={() => step > 1 ? setStep(s => s - 1) : router.push('/')}
          className="text-[#6A9A80] text-sm mb-4 hover:text-[#A8CCBA] transition-colors block"
        >
          ← Volver
        </button>
        <h1 className="font-heading font-bold text-[38px] tracking-[-0.5px] text-white mb-2">
          Reservar mesa
        </h1>
        <p className="text-[#7AAD94] text-[14px]">
          Seleccione fecha, hora y número de comensales para ver disponibilidad.
        </p>
      </div>

      <div className="max-w-[920px] mx-auto px-4 -mt-6 pb-12">
        <Stepper current={step} />

        {/* — Step 1: Date + Time + Guests — */}
        {step === 1 && (
          <div className="grid md:grid-cols-2 gap-5 mb-6">
            <div className="bg-white border border-[#C4D5CA] rounded-card p-6">
              <p className="text-[11px] font-bold text-[#5A6B60] uppercase tracking-[2px] mb-4 font-body">Fecha</p>
              <Calendar selected={date} onSelect={setDate} />
            </div>

            <div className="space-y-5">
              <div className="bg-white border border-[#C4D5CA] rounded-card p-6">
                <p className="text-[11px] font-bold text-[#5A6B60] uppercase tracking-[2px] mb-4 font-body">Hora</p>
                <div className="grid grid-cols-3 gap-2">
                  {TIMES.map(t => (
                    <button
                      key={t}
                      onClick={() => setTime(t)}
                      className={`py-2.5 rounded-btn text-sm font-medium transition-colors ${
                        time === t
                          ? 'bg-[#172E22] text-white'
                          : 'border border-[#C4D5CA] text-[#172E22] hover:bg-[#E2ECE6]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-[#C4D5CA] rounded-card p-6">
                <p className="text-[11px] font-bold text-[#5A6B60] uppercase tracking-[2px] mb-4 font-body">Comensales</p>
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => setGuests(g => Math.max(1, g - 1))}
                    className="w-10 h-10 rounded-btn border border-[#C4D5CA] text-[#172E22] text-xl flex items-center justify-center hover:bg-[#E2ECE6] transition-colors"
                  >−</button>
                  <span className="font-heading font-bold text-[30px] text-[#172E22] min-w-[2ch] text-center">{guests}</span>
                  <button
                    onClick={() => setGuests(g => Math.min(20, g + 1))}
                    className="w-10 h-10 rounded-btn border border-[#C4D5CA] text-[#172E22] text-xl flex items-center justify-center hover:bg-[#E2ECE6] transition-colors"
                  >+</button>
                  <span className="text-[#5A6B60] text-sm">personas</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* — Step 2: Table selection — */}
        {step === 2 && (
          <div className="mb-6">
            <div className="flex mb-4 bg-white border border-[#C4D5CA] rounded-card overflow-hidden w-fit">
              {(['interior', 'terraza'] as const).map(loc => (
                <button
                  key={loc}
                  onClick={() => setLocationTab(loc)}
                  className={`px-6 py-3 text-sm font-medium capitalize transition-colors ${
                    locationTab === loc ? 'bg-[#172E22] text-white' : 'text-[#5A6B60] hover:bg-[#E2ECE6]'
                  }`}
                >
                  {loc.charAt(0).toUpperCase() + loc.slice(1)}
                </button>
              ))}
            </div>

            {loadingTables ? (
              <p className="text-[#5A6B60] py-8 text-center">Buscando mesas disponibles...</p>
            ) : filteredTables.length === 0 ? (
              <div className="text-center py-12 bg-white border border-[#C4D5CA] rounded-card">
                <p className="text-[#5A6B60]">
                  No hay mesas disponibles en {locationTab} para los parámetros seleccionados.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                {filteredTables.map(table => {
                  const isSelected = selectedTable?.id === table.id;
                  return (
                    <button
                      key={table.id}
                      onClick={() => setSelectedTable(table)}
                      style={isSelected ? { border: '1px solid #172E22', background: '#fff' } : { border: '1px solid #1A8A50', background: 'rgba(13,146,84,0.04)' }}
                      className="text-left rounded-card p-5 transition-all hover:brightness-95"
                    >
                      <div
                        className="w-2 h-2 rounded-full mb-3"
                        style={{ background: isSelected ? '#172E22' : '#1A8A50' }}
                      />
                      <p className="font-heading font-bold text-[#172E22] text-lg">Mesa {table.number}</p>
                      <p className="text-[#5A6B60] text-xs capitalize mt-1">{table.location}</p>
                      <p className="text-[#5A6B60] text-xs">{table.capacity} personas</p>
                      {isSelected && <p className="text-[#172E22] text-xs font-bold mt-2">Seleccionada ✓</p>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* — Step 3: Confirmation — */}
        {step === 3 && selectedTable && (
          <div className="bg-white border border-[#C4D5CA] rounded-card p-8 mb-6">
            <h2 className="font-heading font-bold text-xl text-[#172E22] mb-6">Confirmar reserva</h2>
            <div className="bg-[#F0F4F0] rounded-card p-5 mb-6 grid sm:grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Fecha', value: date },
                { label: 'Hora', value: time },
                { label: 'Comensales', value: `${guests} persona${guests !== 1 ? 's' : ''}` },
                { label: 'Mesa', value: `Mesa ${selectedTable.number} · ${selectedTable.location}` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <span className="text-[#5A6B60]">{label}: </span>
                  <span className="text-[#172E22] font-medium">{value}</span>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-[11px] font-bold text-[#5A6B60] uppercase tracking-[2px] mb-2 font-body">
                Notas o peticiones especiales (opcional)
              </label>
              <textarea
                rows={3}
                maxLength={500}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border border-[#C4D5CA] rounded-btn px-4 py-3 text-[#172E22] text-[14px] placeholder-[#C4D5CA] focus:outline-none focus:border-[#172E22] transition-colors resize-none"
                placeholder="Alergia al gluten, silla para bebé, ocasión especial..."
              />
            </div>

            {bookingError && (
              <div className="bg-[rgba(220,38,38,0.08)] border border-[rgba(220,38,38,0.3)] text-[#991B1B] rounded-btn p-3 text-sm mb-4">
                {bookingError}
              </div>
            )}

            <button
              onClick={handleBook}
              disabled={booking || authLoading}
              className="px-8 py-3 rounded-btn bg-[#172E22] text-white font-semibold text-sm hover:bg-[#1A3D2D] disabled:opacity-50 transition-colors"
            >
              {booking ? 'Enviando...' : !user ? 'Inicia sesión para reservar' : 'Solicitar reserva'}
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              className="px-6 py-2.5 rounded-btn border border-[#C4D5CA] text-[#5A6B60] text-sm hover:border-[#172E22] hover:text-[#172E22] transition-colors"
            >
              Atrás
            </button>
          ) : <div />}

          {step === 1 && (
            <button
              onClick={goToStep2}
              disabled={!date || !time}
              className="px-8 py-2.5 rounded-btn bg-[#172E22] text-white text-sm font-semibold hover:bg-[#1A3D2D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Continuar
            </button>
          )}
          {step === 2 && (
            <button
              onClick={() => setStep(3)}
              disabled={!selectedTable}
              className="px-8 py-2.5 rounded-btn bg-[#172E22] text-white text-sm font-semibold hover:bg-[#1A3D2D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Continuar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
